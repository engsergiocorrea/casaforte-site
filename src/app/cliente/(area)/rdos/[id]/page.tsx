import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { exigirConta } from '@/lib/cliente/sessao'
import { rdoDoCliente, type RdoDetalhe } from '@/lib/cliente/obras'
import { dataExtenso } from '@/lib/cliente/formato'
import Galeria from '../../../_ui/Galeria'
import BotaoImprimir from '../../../_ui/BotaoImprimir'

export const metadata: Metadata = { title: 'Relatório da obra' }

const CLIMA: Record<string, string> = { sol: '☀️ Sol', nublado: '⛅ Nublado', chuva: '🌧️ Chuva', chuvoso: '🌧️ Chuva', impraticavel: '⛈️ Impraticável' }
const STATUS_ATV: Record<string, string> = { em_andamento: 'Em andamento', concluida: 'Concluída', concluido: 'Concluída', nao_iniciada: 'Não iniciada', paralisada: 'Paralisada' }

const SECOES: [keyof RdoDetalhe, string][] = [
  ['objetivo', 'Objetivo'],
  ['descricao_tecnica', 'Descrição técnica'],
  ['constatacoes', 'Constatações'],
  ['analise_tecnica', 'Análise técnica'],
  ['recomendacoes', 'Recomendações'],
  ['comentarios', 'Comentários'],
  ['conclusao', 'Conclusão'],
]

export default async function RdoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const conta = await exigirConta()
  const r = await rdoDoCliente(conta, id)
  if (!r) notFound()
  const { rdo, obra } = r

  const fotos = rdo.relatorio_imagens ?? []
  const atividades = rdo.relatorio_atividades ?? []
  const maoObra = (rdo.relatorio_mao_obra ?? []).filter((m) => Number(m.quantidade) > 0)
  const totalEquipe = maoObra.reduce((s, m) => s + Number(m.quantidade), 0) || rdo.total_mao_obra_direta

  return (
    <>
      <div className="ac-noprint" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <Link href={`/cliente/obras/${obra.id}`} className="ac-voltar">← {obra.nome}</Link>
        <BotaoImprimir />
      </div>
      <div className="ac-head">
        <div className="ac-kicker">Relatório diário de obra{rdo.numero ? ` · nº ${rdo.numero}` : ''}</div>
        <h1 className="ac-h1">{dataExtenso(rdo.data_relatorio)}</h1>
        <p className="ac-sub">{obra.nome}{rdo.engenheiro_nome_snapshot ? ` · Responsável: ${rdo.engenheiro_nome_snapshot}` : ''}</p>
      </div>

      <div className="ac-card">
        <dl className="ac-dl">
          <div><dt>Clima manhã</dt><dd>{CLIMA[rdo.clima_manha ?? ''] ?? rdo.clima_manha ?? '—'}</dd></div>
          <div><dt>Clima tarde</dt><dd>{CLIMA[rdo.clima_tarde ?? ''] ?? rdo.clima_tarde ?? '—'}</dd></div>
          {totalEquipe ? <div><dt>Equipe no dia</dt><dd>{totalEquipe} {totalEquipe === 1 ? 'pessoa' : 'pessoas'}</dd></div> : null}
          {rdo.prazo_a_vencer_dias != null && <div><dt>Prazo a vencer</dt><dd>{rdo.prazo_a_vencer_dias} dias</dd></div>}
        </dl>
        {rdo.observacoes_clima && <p className="ac-mute" style={{ marginTop: '0.75rem' }}>{rdo.observacoes_clima}</p>}
      </div>

      {fotos.length > 0 && (
        <section className="ac-sec">
          <h2 className="ac-h2">Fotos do dia</h2>
          <Galeria fotos={fotos.map((f) => ({ id: f.id, url: f.url, legenda: f.legenda }))} />
        </section>
      )}

      {atividades.length > 0 && (
        <section className="ac-sec">
          <h2 className="ac-h2">Atividades</h2>
          <div className="ac-card">
            {atividades.map((a) => (
              <div key={a.id} className="ac-atv">
                <span>{a.descricao}<span className="ac-mute"> · {STATUS_ATV[a.status ?? ''] ?? a.status}</span></span>
                <div className="ac-barra"><span style={{ width: `${Math.min(Number(a.percentual ?? 0), 100)}%` }} /></div>
                <span>{Number(a.percentual ?? 0)}%</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {maoObra.length > 0 && (
        <section className="ac-sec">
          <h2 className="ac-h2">Equipe</h2>
          <div className="ac-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {maoObra.map((m) => (
              <span key={m.id} className="ac-tag" style={{ textTransform: 'none', fontSize: '0.8125rem', letterSpacing: 0 }}>
                {m.quantidade}× {String(m.funcao ?? '').replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </section>
      )}

      {SECOES.filter(([k]) => rdo[k]).map(([k, titulo]) => (
        <section key={k} className="ac-sec">
          <h2 className="ac-h2">{titulo}</h2>
          <div className="ac-card"><p className="ac-body">{String(rdo[k])}</p></div>
        </section>
      ))}

      {rdo.engenheiro_nome_snapshot && (
        <p className="ac-mute" style={{ marginTop: '2rem' }}>
          Elaborado por {rdo.engenheiro_nome_snapshot}
          {rdo.engenheiro_cargo_snapshot ? `, ${rdo.engenheiro_cargo_snapshot}` : ''}
          {rdo.engenheiro_registro_snapshot ? ` — ${rdo.engenheiro_registro_snapshot}` : ''}
        </p>
      )}
    </>
  )
}
