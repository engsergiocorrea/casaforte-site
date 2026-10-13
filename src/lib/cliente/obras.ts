import 'server-only'
import { cache } from 'react'
import { db } from './supabase'
import type { Conta } from './sessao'

// Vínculo cliente ↔ obra vem do SIENGE (ver acesso.ts): contrato liberado →
// empreendimento → area_cliente_empreendimentos.obra_id. O cadastro de clientes
// das obras (clientes/cliente_obras) NÃO concede acesso.

export type Obra = {
  id: string
  nome: string
  tipo: string | null
  endereco: string | null
  cidade: string | null
  estado: string | null
  status: string | null
  data_inicio: string | null
  data_prevista_conclusao: string | null
  prazo_contratual_dias: number | null
  unidade: string | null
}

const CAMPOS_OBRA = 'id, nome, tipo, endereco, cidade, estado, status, data_inicio, data_prevista_conclusao, prazo_contratual_dias, ativo'

export const obrasDoCliente = cache(async (conta: Conta): Promise<Obra[]> => {
  const unidadesPorObra = new Map<string, string[]>()
  for (const c of conta.acesso.contratos) {
    if (!c.obraId) continue
    const lista = unidadesPorObra.get(c.obraId) ?? []
    if (c.unidade) lista.push(c.unidade)
    unidadesPorObra.set(c.obraId, lista)
  }
  const ids = [...unidadesPorObra.keys()]
  if (!ids.length) return []
  const { data: obras } = await db().from('obras').select(CAMPOS_OBRA).in('id', ids).order('nome')
  return (obras ?? [])
    .filter((o) => o.ativo !== false)
    .map((o) => ({ ...o, unidade: unidadesPorObra.get(o.id)?.join(', ') || null }))
})

export async function obraDoCliente(conta: Conta, obraId: string): Promise<Obra | null> {
  return (await obrasDoCliente(conta)).find((o) => o.id === obraId) ?? null
}

type Imagem = { id: string; url: string; legenda: string | null; ordem: number | null }
const porOrdem = (a: Pick<Imagem, 'ordem'>, b: Pick<Imagem, 'ordem'>) => (a.ordem ?? 0) - (b.ordem ?? 0)

export type RdoDetalhe = {
  id: string; numero: number | null; tipo: string | null; obra_id: string; data_relatorio: string; status: string
  clima_manha: string | null; clima_tarde: string | null; observacoes_clima: string | null
  prazo_contratual_dias: number | null; prazo_decorrido_dias: number | null; prazo_a_vencer_dias: number | null
  total_mao_obra_direta: number | null
  comentarios: string | null; objetivo: string | null; descricao_tecnica: string | null; constatacoes: string | null
  analise_tecnica: string | null; recomendacoes: string | null; conclusao: string | null
  obra_nome_snapshot: string | null; obra_local_snapshot: string | null
  engenheiro_nome_snapshot: string | null; engenheiro_registro_snapshot: string | null; engenheiro_cargo_snapshot: string | null
  relatorio_atividades: { id: string; descricao: string; percentual: number | null; status: string | null }[] | null
  relatorio_mao_obra: { id: string; funcao: string | null; quantidade: number | null }[] | null
  relatorio_imagens: Imagem[] | null
}

export type RdoResumo = {
  id: string
  numero: number | null
  data_relatorio: string
  obra_id: string
  comentarios: string | null
  conclusao: string | null
  capa: string | null
  qtd_fotos: number
}

// Cliente só vê RDO APROVADO (o mesmo que recebe pelo WhatsApp).
export async function rdosDasObras(obraIds: string[], limite = 200): Promise<RdoResumo[]> {
  if (!obraIds.length) return []
  const { data } = await db()
    .from('relatorios')
    .select('id, numero, data_relatorio, obra_id, comentarios, conclusao, relatorio_imagens(url, ordem)')
    .in('obra_id', obraIds)
    .eq('status', 'aprovado')
    .order('data_relatorio', { ascending: false })
    .limit(limite)
  type Linha = Pick<RdoDetalhe, 'id' | 'numero' | 'data_relatorio' | 'obra_id' | 'comentarios' | 'conclusao'> & { relatorio_imagens: Pick<Imagem, 'url' | 'ordem'>[] | null }
  return ((data ?? []) as Linha[]).map((r) => {
    const imgs = [...(r.relatorio_imagens ?? [])].sort(porOrdem)
    return {
      id: r.id, numero: r.numero, data_relatorio: r.data_relatorio, obra_id: r.obra_id,
      comentarios: r.comentarios, conclusao: r.conclusao,
      capa: imgs[0]?.url ?? null, qtd_fotos: imgs.length,
    }
  })
}

export type Foto = { id: string; url: string; legenda: string | null; data_relatorio: string; relatorio_id: string }

export async function fotosDaObra(obraId: string, limite = 300): Promise<Foto[]> {
  const { data } = await db()
    .from('relatorios')
    .select('id, data_relatorio, relatorio_imagens(id, url, legenda, ordem)')
    .eq('obra_id', obraId)
    .eq('status', 'aprovado')
    .order('data_relatorio', { ascending: false })
    .limit(120)
  const fotos: Foto[] = []
  for (const r of (data ?? []) as { id: string; data_relatorio: string; relatorio_imagens: Imagem[] | null }[]) {
    const imgs = [...(r.relatorio_imagens ?? [])].sort(porOrdem)
    for (const i of imgs) fotos.push({ id: i.id, url: i.url, legenda: i.legenda, data_relatorio: r.data_relatorio, relatorio_id: r.id })
  }
  return fotos.slice(0, limite)
}

// Detalhe do RDO — só se a obra pertence ao cliente e o RDO está aprovado.
export async function rdoDoCliente(conta: Conta, rdoId: string) {
  const { data: rdo } = await db()
    .from('relatorios')
    .select(`id, numero, tipo, obra_id, data_relatorio, status, clima_manha, clima_tarde, observacoes_clima,
      prazo_contratual_dias, prazo_decorrido_dias, prazo_a_vencer_dias, total_mao_obra_direta,
      comentarios, objetivo, descricao_tecnica, constatacoes, analise_tecnica, recomendacoes, conclusao,
      obra_nome_snapshot, obra_local_snapshot, engenheiro_nome_snapshot, engenheiro_registro_snapshot, engenheiro_cargo_snapshot,
      relatorio_atividades(id, descricao, percentual, status),
      relatorio_mao_obra(id, funcao, quantidade),
      relatorio_imagens(id, url, legenda, ordem)`)
    .eq('id', rdoId)
    .maybeSingle()
  if (!rdo || rdo.status !== 'aprovado') return null
  const obra = await obraDoCliente(conta, rdo.obra_id)
  if (!obra) return null
  const detalhe = rdo as RdoDetalhe
  detalhe.relatorio_imagens = [...(detalhe.relatorio_imagens ?? [])].sort(porOrdem)
  return { rdo: detalhe, obra }
}
