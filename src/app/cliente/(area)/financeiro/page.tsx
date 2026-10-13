import type { Metadata } from 'next'
import { exigirConta } from '@/lib/cliente/sessao'
import { financeiroDoCliente, type ParcelaVista } from '@/lib/cliente/financeiro'
import { data, moeda } from '@/lib/cliente/formato'
import BoletoBotao from '../../_ui/BoletoBotao'
import { whatsappLink } from '../../_ui/constantes'

export const metadata: Metadata = { title: 'Financeiro' }

function rotulo(p: ParcelaVista) {
  return p.installmentNumber ?? String(p.installmentId)
}

function TabelaParcelas({ parcelas, titulo, comBoleto }: { parcelas: ParcelaVista[]; titulo: number; comBoleto: boolean }) {
  return (
    <div className="ac-scroll">
      <table className="ac-tabela">
        <thead>
          <tr>
            <th>Parcela</th>
            <th>Vencimento</th>
            <th className="ocultar-m">Tipo</th>
            <th className="num">{comBoleto ? 'Valor atualizado' : 'Valor'}</th>
            {comBoleto && <th className="acao"><span className="ocultar-m">2ª via</span></th>}
          </tr>
        </thead>
        <tbody>
          {parcelas.map((p) => (
            <tr key={p.installmentId}>
              <td>
                {rotulo(p)}
                {p.situacao === 'vencida' && <> <span className="ac-tag ac-tag-red">Vencida</span></>}
                {p.situacao === 'paga' && <> <span className="ac-tag ac-tag-ok">Paga</span></>}
              </td>
              <td>{data(p.dueDate)}</td>
              <td className="ocultar-m">{p.conditionType ?? '—'}</td>
              <td className="num">{moeda(p.situacao === 'paga' ? (p.adjustedValue ?? p.originalValue) : p.currentBalance)}</td>
              {comBoleto && (
                <td className="acao">
                  {p.generatedBoleto ? (
                    <BoletoBotao titulo={titulo} parcela={p.installmentId} rotulo={rotulo(p)} valor={moeda(p.currentBalance)} vencimento={data(p.dueDate)} />
                  ) : (
                    <span className="ac-mute" title="O boleto é emitido pelo financeiro perto do vencimento">Não emitido</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default async function FinanceiroPage() {
  const conta = await exigirConta()
  const fin = await financeiroDoCliente(conta)
  const qtdVencidas = fin.titulos.reduce((s, t) => s + t.vencidas.length, 0)
  const proxima = fin.titulos.flatMap((t) => t.aVencer).sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]

  return (
    <>
      <div className="ac-head">
        <div className="ac-kicker">Financeiro</div>
        <h1 className="ac-h1">Boletos e saldo devedor</h1>
        <p className="ac-sub">Valores atualizados direto do sistema financeiro da Casa Forte, com correção até hoje.</p>
      </div>

      {fin.erro ? (
        <div className="ac-alerta ac-alerta-erro">{fin.erro}</div>
      ) : fin.titulos.length === 0 ? (
        <div className="ac-card ac-vazio">
          Não encontramos parcelas nos seus contratos.<br />
          <a href={whatsappLink('Olá! Não encontrei meu contrato no Financeiro da Área do Cliente.')} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)', fontWeight: 500 }}>
            Falar com o financeiro
          </a>
        </div>
      ) : (
        <>
          <div className="ac-grid ac-grid-3" id="saldo">
            <div className="ac-card">
              <div className="ac-card-titulo">Saldo devedor atualizado</div>
              <div className="ac-num">{moeda(fin.saldoTotal)}</div>
              <p className="ac-mute" style={{ marginTop: 4 }}>Soma das parcelas em aberto, corrigidas</p>
            </div>
            <div className="ac-card">
              <div className="ac-card-titulo">Em atraso</div>
              <div className="ac-num" style={{ color: qtdVencidas ? 'var(--red-dark)' : undefined }}>{moeda(fin.totalVencido)}</div>
              <p className="ac-mute" style={{ marginTop: 4 }}>{qtdVencidas ? `${qtdVencidas} ${qtdVencidas === 1 ? 'parcela' : 'parcelas'}` : 'Tudo em dia ✓'}</p>
            </div>
            <div className="ac-card">
              <div className="ac-card-titulo">Próxima parcela</div>
              {proxima ? (
                <>
                  <div className="ac-num">{moeda(proxima.currentBalance)}</div>
                  <p className="ac-mute" style={{ marginTop: 4 }}>vence em {data(proxima.dueDate)}</p>
                </>
              ) : <p className="ac-mute">Nenhuma parcela a vencer</p>}
            </div>
          </div>

          {fin.titulos.map((t) => (
            <section key={t.billId} className="ac-sec">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                <h2 className="ac-h2" style={{ marginBottom: 0 }}>
                  {t.empreendimento}{t.unidade ? ` · ${t.unidade}` : ''}
                </h2>
                <span className="ac-mute" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {t.contrato ? `Contrato ${t.contrato} · ` : ''}Saldo {moeda(t.saldo)}
                  <a className="ac-btn ac-btn-sec ac-btn-sm" href={`/cliente/api/saldo-devedor?titulo=${t.billId}`} target="_blank" rel="noopener noreferrer">
                    Extrato de saldo devedor (PDF)
                  </a>
                </span>
              </div>
              <div className="ac-card">
                {t.vencidas.length + t.aVencer.length === 0 ? (
                  <p className="ac-mute">Nenhuma parcela em aberto neste contrato. ✓</p>
                ) : (
                  <>
                    <TabelaParcelas parcelas={[...t.vencidas, ...t.aVencer.slice(0, 6)]} titulo={t.billId} comBoleto />
                    {t.aVencer.length > 6 && (
                      <details className="ac-details">
                        <summary>Ver as outras {t.aVencer.length - 6} parcelas a vencer</summary>
                        <TabelaParcelas parcelas={t.aVencer.slice(6)} titulo={t.billId} comBoleto />
                      </details>
                    )}
                  </>
                )}
                {t.pagas.length > 0 && (
                  <details className="ac-details">
                    <summary>Parcelas pagas ({t.pagas.length})</summary>
                    <TabelaParcelas parcelas={t.pagas} titulo={t.billId} comBoleto={false} />
                  </details>
                )}
              </div>
            </section>
          ))}

          <p className="ac-mute" style={{ marginTop: '2rem' }}>
            Dúvidas sobre valores, antecipação ou renegociação?{' '}
            <a href={whatsappLink('Olá! Tenho uma dúvida sobre meu financeiro.')} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)' }}>
              Fale com o financeiro
            </a>.
          </p>
        </>
      )}
    </>
  )
}
