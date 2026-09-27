const points = [
  { icon: '◎', title: 'Gestão técnica próxima da obra', desc: 'Acompanhamento direto em cada etapa construtiva, garantindo precisão e padrão elevado.' },
  { icon: '◈', title: 'Padrão construtivo consistente', desc: 'Materiais selecionados e processos rigorosos que resultam em obras de qualidade duradoura.' },
  { icon: '◇', title: 'Entrega rigorosamente no prazo', desc: 'Compromisso real com os prazos assumidos — para clientes, investidores e parceiros.' },
]

export default function QualitySection() {
  return (
    <section style={{background:'#2A2A2A',padding:'6.25rem 2rem'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'center'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1.25rem'}}>
              <span style={{width:'32px',height:'1px',background:'#E8390E'}} />
              <span style={{fontSize:'0.6875rem',fontWeight:'600',color:'#E8390E',letterSpacing:'0.15em',textTransform:'uppercase'}}>Qualidade</span>
            </div>
            <h2 style={{fontFamily:'Playfair Display, serif',fontSize:'clamp(1.625rem, 3.5vw, 2.5rem)',fontWeight:'600',color:'#FFFFFF',lineHeight:1.2,letterSpacing:'-0.015em',marginBottom:'1.5rem'}}>
              Qualidade de entrega e compromisso com prazo
            </h2>
            <p style={{fontSize:'0.9375rem',color:'rgba(255,255,255,0.55)',lineHeight:1.8,fontWeight:'300'}}>
              Na Casa Forte, cada obra é conduzida com gestão próxima, acompanhamento técnico e responsabilidade em todas as etapas. Nosso compromisso é entregar com qualidade, organização e rigor no cumprimento dos prazos assumidos.
            </p>
          </div>
          <div style={{display:'flex',flexDirection:'column'}}>
            {points.map((point, i) => (
              <div key={i} style={{padding:'1.75rem 0',borderBottom: i < points.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',display:'flex',gap:'1.25rem',alignItems:'flex-start'}}>
                <span style={{fontSize:'1.25rem',color:'#E8390E',marginTop:'2px',flexShrink:0}}>{point.icon}</span>
                <div>
                  <div style={{fontSize:'0.9375rem',fontWeight:'600',color:'#FFFFFF',marginBottom:'0.375rem'}}>{point.title}</div>
                  <div style={{fontSize:'0.8125rem',color:'rgba(255,255,255,0.45)',lineHeight:1.7,fontWeight:'300'}}>{point.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}