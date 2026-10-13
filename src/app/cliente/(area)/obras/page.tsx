import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { exigirConta } from '@/lib/cliente/sessao'
import { obrasDoCliente, rdosDasObras } from '@/lib/cliente/obras'
import { dataExtenso } from '@/lib/cliente/formato'
import { whatsappLink } from '../../_ui/constantes'

export const metadata: Metadata = { title: 'Minha obra' }

export default async function ObrasPage() {
  const conta = await exigirConta()
  const obras = await obrasDoCliente(conta)
  const semObra = conta.acesso.contratos.filter((c) => !c.obraId)
  if (obras.length === 1 && !semObra.length) redirect(`/cliente/obras/${obras[0].id}`)

  const rdos = await rdosDasObras(obras.map((o) => o.id))
  const ultimoPorObra = new Map<string, (typeof rdos)[number]>()
  for (const r of rdos) if (!ultimoPorObra.has(r.obra_id)) ultimoPorObra.set(r.obra_id, r)

  return (
    <>
      <div className="ac-head">
        <div className="ac-kicker">Acompanhamento</div>
        <h1 className="ac-h1">Minhas obras</h1>
        <p className="ac-sub">Relatórios diários e fotos publicados pela engenharia da Casa Forte.</p>
      </div>
      {semObra.length > 0 && (
        <div className="ac-stack" style={{ marginBottom: '1rem' }}>
          {semObra.map((c) => (
            <div key={c.contratoId} className="ac-card">
              <strong>{c.empreendimento}</strong>{c.unidade && <span className="ac-mute"> · {c.unidade}</span>}
              <p className="ac-mute" style={{ marginTop: 6 }}>
                O acompanhamento desta obra (relatórios e fotos) estará disponível aqui em breve.
              </p>
            </div>
          ))}
        </div>
      )}
      {obras.length === 0 ? (
        semObra.length ? null : (
          <div className="ac-card ac-vazio">
            Nenhuma obra disponível para acompanhamento.<br />
            <a href={whatsappLink('Olá! Não encontrei minha obra na Área do Cliente.')} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)', fontWeight: 500 }}>
              Fale com a Casa Forte
            </a>
          </div>
        )
      ) : (
        <div className="ac-grid ac-grid-3">
          {obras.map((o) => {
            const u = ultimoPorObra.get(o.id)
            return (
              <Link key={o.id} href={`/cliente/obras/${o.id}`} className="ac-card ac-card-link" style={{ padding: '0.75rem' }}>
                <div className="ac-capa">
                  {u?.capa ? <img src={u.capa} alt="" /> : <div className="ac-capa-vazia" style={{ height: '100%' }}>Sem fotos ainda</div>}
                </div>
                <div style={{ padding: '0.75rem 0.25rem 0.25rem' }}>
                  <strong>{o.nome}</strong>
                  {o.unidade && <span className="ac-mute"> · {o.unidade}</span>}
                  <p className="ac-mute" style={{ marginTop: 4 }}>{u ? `Último relatório: ${dataExtenso(u.data_relatorio)}` : 'Sem relatórios publicados'}</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
