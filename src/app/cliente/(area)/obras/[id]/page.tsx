import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { exigirConta } from '@/lib/cliente/sessao'
import { fotosDaObra, obraDoCliente, obrasDoCliente, rdosDasObras } from '@/lib/cliente/obras'
import { data, dataExtenso, hojeISO } from '@/lib/cliente/formato'
import Galeria from '../../../_ui/Galeria'

export const metadata: Metadata = { title: 'Obra' }

const STATUS_OBRA: Record<string, string> = {
  planejamento: 'Em planejamento', em_andamento: 'Em andamento', andamento: 'Em andamento',
  paralisada: 'Paralisada', concluida: 'Concluída', entregue: 'Entregue',
}

function diasEntre(a: string, b: string) {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000)
}

export default async function ObraPage({ params, searchParams }: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ aba?: string }>
}) {
  const [{ id }, { aba }] = await Promise.all([params, searchParams])
  const conta = await exigirConta()
  const obra = await obraDoCliente(conta, id)
  if (!obra) notFound()
  const variasObras = (await obrasDoCliente(conta)).length > 1
  const verFotos = aba === 'fotos'

  const [rdos, fotos] = await Promise.all([
    verFotos ? Promise.resolve([]) : rdosDasObras([obra.id]),
    verFotos ? fotosDaObra(obra.id) : Promise.resolve([]),
  ])

  const termino = obra.data_prevista_conclusao ??
    (obra.data_inicio && obra.prazo_contratual_dias
      ? new Date(Date.parse(obra.data_inicio) + obra.prazo_contratual_dias * 86_400_000).toISOString().slice(0, 10)
      : null)
  const prazoPct = obra.data_inicio && termino
    ? Math.max(0, Math.min(100, Math.round((diasEntre(obra.data_inicio, hojeISO()) / Math.max(1, diasEntre(obra.data_inicio, termino))) * 100)))
    : null

  return (
    <>
      {variasObras && <Link href="/cliente/obras" className="ac-voltar">← Minhas obras</Link>}
      <div className="ac-head">
        <div className="ac-kicker">Minha obra</div>
        <h1 className="ac-h1">{obra.nome}</h1>
        <p className="ac-sub">
          {[obra.unidade, obra.endereco, obra.cidade && `${obra.cidade}${obra.estado ? `/${obra.estado}` : ''}`].filter(Boolean).join(' · ')}
        </p>
      </div>

      <div className="ac-card" style={{ marginBottom: '1.5rem' }}>
        <dl className="ac-dl">
          <div><dt>Situação</dt><dd>{STATUS_OBRA[obra.status ?? ''] ?? obra.status ?? '—'}</dd></div>
          <div><dt>Início</dt><dd>{data(obra.data_inicio)}</dd></div>
          <div><dt>Previsão de término</dt><dd>{data(termino)}</dd></div>
        </dl>
        {prazoPct !== null && (
          <div style={{ marginTop: '1.1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }} className="ac-mute">
              <span>Prazo contratual decorrido</span><span>{prazoPct}%</span>
            </div>
            <div className="ac-barra"><span style={{ width: `${prazoPct}%` }} /></div>
          </div>
        )}
      </div>

      <nav className="ac-tabs" aria-label="Conteúdo da obra">
        <Link href={`/cliente/obras/${obra.id}`} aria-current={!verFotos ? 'page' : undefined}>Relatórios</Link>
        <Link href={`/cliente/obras/${obra.id}?aba=fotos`} aria-current={verFotos ? 'page' : undefined}>Fotos</Link>
      </nav>

      {verFotos ? (
        fotos.length ? (
          <Galeria fotos={fotos.map((f) => ({ id: f.id, url: f.url, legenda: f.legenda, grupo: dataExtenso(f.data_relatorio) }))} />
        ) : (
          <div className="ac-card ac-vazio">As fotos da obra aparecerão aqui junto com os relatórios.</div>
        )
      ) : rdos.length ? (
        <div className="ac-card" style={{ padding: '0.25rem' }}>
          {rdos.map((r, i) => (
            <Link key={r.id} href={`/cliente/rdos/${r.id}`} className="ac-rdo-item" style={{ borderTop: i ? '1px solid var(--border-light)' : 0, display: 'grid' }}>
              <div className="ac-capa">
                {r.capa ? <img src={r.capa} alt="" loading="lazy" /> : <div className="ac-capa-vazia" style={{ height: '100%' }}>—</div>}
              </div>
              <div style={{ minWidth: 0 }}>
                <strong>Relatório {r.numero ? `nº ${r.numero} · ` : ''}{dataExtenso(r.data_relatorio)}</strong>
                <p>{r.comentarios || r.conclusao || `${r.qtd_fotos} fotos registradas`}</p>
              </div>
              <span className="ac-mute">{r.qtd_fotos} fotos →</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="ac-card ac-vazio">Nenhum relatório publicado ainda. Assim que a engenharia publicar, ele aparece aqui e no seu WhatsApp.</div>
      )}
    </>
  )
}
