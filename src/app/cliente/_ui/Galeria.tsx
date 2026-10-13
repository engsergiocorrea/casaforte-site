'use client'

import { useCallback, useEffect, useState } from 'react'

export type FotoGaleria = { id: string; url: string; legenda: string | null; grupo?: string }

export default function Galeria({ fotos }: { fotos: FotoGaleria[] }) {
  const [aberta, setAberta] = useState<number | null>(null)
  const fechar = useCallback(() => setAberta(null), [])
  const mover = useCallback(
    (d: number) => setAberta((i) => (i === null ? null : (i + d + fotos.length) % fotos.length)),
    [fotos.length],
  )

  useEffect(() => {
    if (aberta === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fechar()
      if (e.key === 'ArrowRight') mover(1)
      if (e.key === 'ArrowLeft') mover(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [aberta, fechar, mover])

  const atual = aberta !== null ? fotos[aberta] : null

  return (
    <>
      <div className="ac-galeria">
        {fotos.map((f, i) => {
          const cabecalho = f.grupo && f.grupo !== fotos[i - 1]?.grupo ? f.grupo : null
          return (
            <FragmentoFoto key={f.id} cabecalho={cabecalho}>
              <button type="button" onClick={() => setAberta(i)} aria-label={f.legenda ? `Ampliar: ${f.legenda}` : 'Ampliar foto'}>
                <img src={f.url} alt={f.legenda ?? ''} loading="lazy" />
              </button>
            </FragmentoFoto>
          )
        })}
      </div>

      {atual && (
        <figure className="ac-lightbox" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && fechar()}>
          <button className="ac-lb-btn ac-lb-fechar" onClick={fechar} aria-label="Fechar">✕</button>
          {fotos.length > 1 && <button className="ac-lb-btn ac-lb-ant" onClick={() => mover(-1)} aria-label="Foto anterior">‹</button>}
          <img src={atual.url} alt={atual.legenda ?? ''} />
          <figcaption>
            {atual.legenda}
            {atual.grupo && <span style={{ opacity: 0.6 }}>{atual.legenda ? ' · ' : ''}{atual.grupo}</span>}
            <span style={{ opacity: 0.5 }}> · {aberta! + 1}/{fotos.length}</span>
          </figcaption>
          {fotos.length > 1 && <button className="ac-lb-btn ac-lb-prox" onClick={() => mover(1)} aria-label="Próxima foto">›</button>}
        </figure>
      )}
    </>
  )
}

function FragmentoFoto({ cabecalho, children }: { cabecalho: string | null; children: React.ReactNode }) {
  return (
    <>
      {cabecalho && <div className="ac-galeria-data">{cabecalho}</div>}
      {children}
    </>
  )
}
