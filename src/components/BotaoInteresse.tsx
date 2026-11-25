'use client'
// "Quero saber mais" do card: pré-seleciona o empreendimento no formulário
// de interesse e rola até ele.
export default function BotaoInteresse({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <a href={`?interesse=${slug}#contato`} className="cf-link-cta"
      onClick={(e) => {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('cf-interesse', { detail: slug }))
        document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }}
      style={{ fontSize: '0.875rem', fontWeight: 600, color: '#E8390E', display: 'inline-flex', alignItems: 'center', gap: '0.375rem', alignSelf: 'flex-start', padding: '0.25rem 0' }}>
      {children}
    </a>
  )
}
