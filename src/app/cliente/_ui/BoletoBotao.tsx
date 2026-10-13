'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'

type Resultado = { url: string | null; linha: string | null } | { erro: string }

export default function BoletoBotao({ titulo, parcela, rotulo, valor, vencimento }: {
  titulo: number; parcela: number; rotulo: string; valor: string; vencimento: string
}) {
  const [aberto, setAberto] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [res, setRes] = useState<Resultado | null>(null)
  const [copiado, setCopiado] = useState(false)

  async function emitir() {
    setAberto(true)
    if (res && !('erro' in res)) return
    setCarregando(true)
    try {
      const r = await fetch(`/cliente/api/boleto?titulo=${titulo}&parcela=${parcela}`, { cache: 'no-store' })
      setRes(await r.json())
    } catch {
      setRes({ erro: 'Falha de conexão. Tente novamente.' })
    } finally {
      setCarregando(false)
    }
  }

  async function copiar(linha: string) {
    try {
      await navigator.clipboard.writeText(linha.replace(/\D/g, ''))
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch { /* navegador sem clipboard */ }
  }

  return (
    <>
      <button type="button" className="ac-btn ac-btn-sm" onClick={emitir}>Boleto</button>
      {aberto && createPortal(
        <div className="ac-modal-fundo" onClick={(e) => e.target === e.currentTarget && setAberto(false)}>
          <div className="ac-modal" role="dialog" aria-modal="true" aria-labelledby="boleto-titulo">
            <div className="ac-card-titulo" id="boleto-titulo">2ª via de boleto</div>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>Parcela {rotulo}</p>
            <p className="ac-mute" style={{ marginBottom: '1rem' }}>{valor} · vencimento {vencimento}</p>
            {carregando ? (
              <p className="ac-mute">Gerando boleto atualizado no sistema financeiro…</p>
            ) : res && 'erro' in res ? (
              <div className="ac-alerta ac-alerta-erro">{res.erro}</div>
            ) : res ? (
              <div className="ac-stack">
                {res.linha && (
                  <>
                    <div className="ac-linha">{res.linha}</div>
                    <button type="button" className="ac-btn ac-btn-sec" onClick={() => copiar(res.linha!)}>
                      {copiado ? 'Código copiado ✓' : 'Copiar código de barras'}
                    </button>
                  </>
                )}
                {res.url && (
                  <a className="ac-btn" href={res.url} target="_blank" rel="noopener noreferrer">Abrir boleto (PDF)</a>
                )}
                <p className="ac-mute">O PDF do boleto abre com os <strong>5 primeiros dígitos do seu CPF/CNPJ</strong>.</p>
              </div>
            ) : null}
            <button type="button" className="ac-btn ac-btn-sec ac-btn-full" style={{ marginTop: '1rem' }} onClick={() => setAberto(false)}>Fechar</button>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
