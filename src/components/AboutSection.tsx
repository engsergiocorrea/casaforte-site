const stats = [
  { value: '13', label: 'Anos de atuação no mercado da construção civil' },
  { value: '500+', label: 'Casas populares construídas ao longo da trajetória' },
  { value: '5', label: 'Empreendimentos na Rota Ecológica dos Milagres' },
  { value: '100%', label: 'Compromisso com qualidade, prazo e responsabilidade técnica' },
]

export default function AboutSection() {
  return (
    <section id="historia" style={{background:'#FFFFFF',padding:'5rem 1.5rem'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1.25rem'}}>
          <span style={{width:'32px',height:'1px',background:'#E8390E'}} />
          <span style={{fontSize:'0.6875rem',fontWeight:'600',color:'#E8390E',letterSpacing:'0.15em',textTransform:'uppercase'}}>Nossa história</span>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'3rem'}} className="cf-about-grid">
          <div>
            <h2 style={{fontFamily:'Playfair Display, serif',fontSize:'clamp(1.625rem, 5vw, 2.75rem)',fontWeight:'600',color:'#2A2A2A',lineHeight:1.2,letterSpacing:'-0.015em',marginBottom:'1.5rem'}}>
              Uma trajetória construída com solidez
            </h2>
            <p style={{fontSize:'0.9375rem',color:'#4A4845',lineHeight:1.8,fontWeight:'300',marginBottom:'1rem'}}>
              A Casa Forte atua há 13 anos no mercado da construção civil, com uma trajetória marcada por responsabilidade técnica, qualidade construtiva e compromisso com a entrega.
            </p>
            <p style={{fontSize:'0.9375rem',color:'#4A4845',lineHeight:1.8,fontWeight:'300',marginBottom:'1rem'}}>
              Antes de expandir sua atuação para a Rota Ecológica dos Milagres, a empresa construiu mais de 500 casas populares, consolidando experiência prática em execução, gestão de obra e cumprimento de prazos.
            </p>
            <p style={{fontSize:'0.9375rem',color:'#4A4845',lineHeight:1.8,fontWeight:'300'}}>
              Com essa base sólida, a Casa Forte evoluiu para o desenvolvimento de empreendimentos imobiliários em uma das regiões mais valorizadas do litoral alagoano, mantendo o mesmo compromisso: executar bem, entregar no prazo e gerar valor para clientes, parceiros e investidores.
            </p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2px'}}>
            {stats.map((stat, i) => (
              <div key={i} style={{padding:'1.75rem 1.25rem',background:i%2===0?'#F5F3F0':'#FFFFFF',border:'1px solid #ECEAE6'}}>
                <div style={{fontFamily:'Playfair Display, serif',fontSize:'2.25rem',fontWeight:'700',color:'#2A2A2A',lineHeight:1,marginBottom:'0.5rem'}}>{stat.value}</div>
                <div style={{fontSize:'0.75rem',color:'#8A8680',fontWeight:'500',lineHeight:1.5}}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 900px) {
          .cf-about-grid { grid-template-columns: 1fr 1fr !important; gap: 5rem !important; }
        }
      `}</style>
    </section>
  )
}