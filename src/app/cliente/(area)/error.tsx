'use client'

export default function ErroArea({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="ac-card ac-vazio">
      <p style={{ marginBottom: '1rem' }}>Não conseguimos carregar seus dados agora. O sistema financeiro pode estar temporariamente indisponível.</p>
      <button className="ac-btn" onClick={reset}>Tentar novamente</button>
    </div>
  )
}
