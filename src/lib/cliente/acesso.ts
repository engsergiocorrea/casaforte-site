import 'server-only'
import { db } from './supabase'
import { soDigitos } from './formato'
import { clientePorDocumento, contratosDoCliente, telefoneWhatsApp, type Contrato, type SiengeCliente } from './sienge'

// Fonte única do vínculo cliente ↔ empreendimento ↔ obra: o SIENGE.
//   CPF/CNPJ → cliente no Sienge → contratos de venda não cancelados
//   → filtrados pelos empreendimentos habilitados em area_cliente_empreendimentos
//     ('liberado' = todos; 'teste' = só CPFs em area_cliente_testadores).
// Sem nenhum contrato habilitado = sem acesso à Área do Cliente.

export type ContratoLiberado = {
  contratoId: number
  numero: string | null
  billId: number | null
  enterpriseId: number
  empreendimento: string
  unidade: string | null
  entregaPrevista: string | null
  obraId: string | null
}

export type Acesso = {
  cliente: SiengeCliente
  contratos: ContratoLiberado[]
  telefone: string | null   // WhatsApp p/ link de senha (testador pode sobrescrever)
  teste: boolean            // acesso concedido só por estar na lista de testadores
}

type Empreendimento = { sienge_enterprise_id: number; nome: string; status: string; obra_id: string | null }

// Cache curto por instância: cada página consulta o acesso, e o Sienge não precisa
// ser chamado a cada clique. Troca de status/testador vale em até 5 minutos.
const TTL_MS = 5 * 60_000
const memo = new Map<string, { em: number; valor: Acesso | null }>()

export async function acessoPorDocumento(doc: string, { semCache = false } = {}): Promise<Acesso | null> {
  const d = soDigitos(doc)
  const hit = memo.get(d)
  if (!semCache && hit && Date.now() - hit.em < TTL_MS) return hit.valor
  const valor = await calcularAcesso(d)
  memo.set(d, { em: Date.now(), valor })
  return valor
}

async function calcularAcesso(doc: string): Promise<Acesso | null> {
  const [{ data: emps, error: e1 }, { data: testador, error: e2 }] = await Promise.all([
    db().from('area_cliente_empreendimentos').select('sienge_enterprise_id, nome, status, obra_id').neq('status', 'desligado'),
    db().from('area_cliente_testadores').select('cpf, telefone_whatsapp, ativo').eq('cpf', doc).maybeSingle(),
  ])
  if (e1 || e2) throw new Error(`config da área do cliente indisponível: ${(e1 ?? e2)?.message}`)

  const ehTestador = !!testador?.ativo
  const habilitados = new Map<number, Empreendimento>()
  for (const e of (emps ?? []) as Empreendimento[]) {
    if (e.status === 'liberado' || (e.status === 'teste' && ehTestador)) habilitados.set(e.sienge_enterprise_id, e)
  }
  if (!habilitados.size) return null

  const cliente = await clientePorDocumento(doc)
  if (!cliente) return null

  const contratos = (await contratosDoCliente(cliente.id))
    .filter((c): c is Contrato & { enterpriseId: number } => typeof c.enterpriseId === 'number' && habilitados.has(c.enterpriseId))
    // Garante que a pessoa é parte do contrato (se a API ignorar o filtro customerId).
    .filter((c) => !c.salesContractCustomers || c.salesContractCustomers.some((p) => p.id === cliente.id))
  if (!contratos.length) return null

  const somenteTeste = contratos.every((c) => habilitados.get(c.enterpriseId)!.status === 'teste')
  return {
    cliente,
    teste: somenteTeste,
    telefone: (ehTestador && testador?.telefone_whatsapp) || telefoneWhatsApp(cliente),
    contratos: contratos.map((c) => {
      const emp = habilitados.get(c.enterpriseId)!
      return {
        contratoId: c.id,
        numero: c.number ?? null,
        billId: c.receivableBillId ?? null,
        enterpriseId: c.enterpriseId,
        empreendimento: emp.nome || c.enterpriseName || 'Empreendimento',
        unidade: c.salesContractUnits?.find((u) => u.main)?.name ?? c.salesContractUnits?.[0]?.name ?? null,
        entregaPrevista: c.expectedDeliveryDate ?? null,
        obraId: emp.obra_id,
      }
    }),
  }
}
