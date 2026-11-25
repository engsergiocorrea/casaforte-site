import Reveal from './Reveal'

const icone = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: '#E8390E', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }

const points = [
  {
    // capacete de obra
    icon: <svg {...icone}><path d="M3 18h18" /><path d="M5 18v-3a7 7 0 0 1 14 0v3" /><path d="M10 8V5h4v3" /></svg>,
    title: 'Gestão técnica próxima da obra',
    desc: 'Acompanhamento direto em cada etapa construtiva, garantindo precisão e padrão elevado.',
  },
  {
    // camadas / padrão
    icon: <svg {...icone}><path d="M12 3 3 8l9 5 9-5-9-5z" /><path d="m3 13 9 5 9-5" /></svg>,
    title: 'Padrão construtivo consistente',
    desc: 'Materiais selecionados e processos rigorosos que resultam em obras de qualidade duradoura.',
  },
  {
    // calendário com check
    icon: <svg {...icone}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /><path d="m9 15 2 2 4-4" /></svg>,
    title: 'Entrega rigorosamente no prazo',
    desc: 'Compromisso real com os prazos assumidos — para clientes, investidores e parceiros.',
  },
]

export default function QualitySection() {
  return (
    <section style={{background:'#2A2A2A',padding:'6rem 1.5rem'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'3rem',alignItems:'center'}} className="cf-quality-grid">
          <Reveal>
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1.25rem'}}>
              <span style={{width:'32px',height:'1px',background:'#E8390E'}} />
              <span style={{fontSize:'0.75rem',fontWeight:600,color:'#E8390E',letterSpacing:'0.16em',textTransform:'uppercase'}}>Qualidade</span>
            </div>
            <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(1.875rem, 4.5vw, 2.75rem)',fontWeight:600,color:'#FFFFFF',lineHeight:1.15,letterSpacing:'-0.02em',marginBottom:'1.5rem'}}>
              Qualidade de entrega e compromisso com prazo
            </h2>
            <p style={{fontSize:'1rem',color:'rgba(255,255,255,0.72)',lineHeight:1.75,fontWeight:400}}>
              Na Casa Forte, cada obra é conduzida com gestão próxima, acompanhamento técnico e responsabilidade em todas as etapas. Nosso compromisso é entregar com qualidade, organização e rigor no cumprimento dos prazos assumidos.
            </p>
          </Reveal>
          <div style={{display:'flex',flexDirection:'column'}}>
            {points.map((point, i) => (
              <Reveal key={i} delay={i * 70}>
                <div style={{padding:'1.75rem 0',borderBottom: i < points.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',display:'flex',gap:'1.25rem',alignItems:'flex-start'}}>
                  <span style={{width:'44px',height:'44px',borderRadius:'12px',background:'rgba(232,57,14,0.12)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{point.icon}</span>
                  <div>
                    <div style={{fontSize:'1.0625rem',fontWeight:600,color:'#FFFFFF',marginBottom:'0.375rem'}}>{point.title}</div>
                    <div style={{fontSize:'0.9375rem',color:'rgba(255,255,255,0.66)',lineHeight:1.65,fontWeight:400}}>{point.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 900px) {
          .cf-quality-grid { grid-template-columns: 1fr 1fr !important; gap: 5rem !important; }
        }
      `}</style>
    </section>
  )
}
