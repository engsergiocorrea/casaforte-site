'use client'

export default function BotaoImprimir() {
  return (
    <button type="button" className="ac-btn ac-btn-sec ac-btn-sm" onClick={() => window.print()}>
      Imprimir / salvar PDF
    </button>
  )
}
