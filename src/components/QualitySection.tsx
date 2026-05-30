const points = [
  { icon: '◎', title: 'Gestão técnica próxima da obra', desc: 'Acompanhamento direto em cada etapa construtiva, garantindo precisão e padrão elevado.' },
  { icon: '◈', title: 'Padrão construtivo consistente', desc: 'Materiais selecionados e processos rigorosos que resultam em obras de qualidade duradoura.' },
  { icon: '◇', title: 'Entrega rigorosamente no prazo', desc: 'Compromisso real com os prazos assumidos — para clientes, investidores e parceiros.' },
]

export default function QualitySection() {
  return (
    <section style={{background:'#2A2A2A',padding:'100px 32px'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'80px',alignItems:'center'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
              <span style={{width:'32px',height:'1px',background:'#E8390E'}} />
              <span style={{fontSize:'11px',fontWeight:'600',color:'#E8390E',letterSpacing:'0.15em'}}>QUALIDADE</span>
            </div>
            <h2 style={{fontFamily:'Playfair Display, serif',fontSize:'clamp(26px, 3.5vw, 40px)',fontWeight:'600',color:'#FFFFFF',lineHeight:1.2,marginBottom:'24px'}}>
              Qualidade de entrega e compromisso com prazo
            </h2>
            <p style={{fontSize:'15px',color:'rgba(255,255,255,0.55)',lineHeight:1.8,fontWeight:'300'}}>
              Na Casa Forte, cada obra é conduzida com gestão próxima, acompanhamento técnico e responsabilidade em todas as etapas. Nosso compromisso é entregar com qualidade, organização e rigor no cumprimento dos prazos assumidos.
            </p>
          </div>
          <div style={{display:'flex',flexDirection:'column'}}>
            {points.map((point, i) => (
              <div key={i} style={{padding:'28px 0',borderBottom: i < points.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',display:'flex',gap:'20px',alignItems:'flex-start'}}>
                <span style={{fontSize:'20px',color:'#E8390E',marginTop:'2px',flexShrink:0}}>{point.icon}</span>
                <div>
                  <div style={{fontSize:'15px',fontWeight:'600',color:'#FFFFFF',marginBottom:'6px'}}>{point.title}</div>
                  <div style={{fontSize:'13px',color:'rgba(255,255,255,0.45)',lineHeight:1.7,fontWeight:'300'}}>{point.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}