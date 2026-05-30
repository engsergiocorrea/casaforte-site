const stats = [
  { value: '13', label: 'Anos de mercado' },
  { value: '5+', label: 'Empreendimentos' },
  { value: '100%', label: 'Obras no prazo' },
  { value: '+500', label: 'Famílias atendidas' },
]

export default function AboutSection() {
  return (
    <section id="historia" style={{background:'#FFFFFF',padding:'100px 32px'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
          <span style={{width:'32px',height:'1px',background:'#E8390E'}} />
          <span style={{fontSize:'11px',fontWeight:'600',color:'#E8390E',letterSpacing:'0.15em',textTransform:'uppercase'}}>Nossa história</span>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'80px',alignItems:'start'}}>
          <div>
            <h2 style={{fontFamily:'Playfair Display, serif',fontSize:'clamp(28px, 4vw, 44px)',fontWeight:'600',color:'#2A2A2A',lineHeight:1.2,marginBottom:'28px'}}>
              Uma trajetória construída com responsabilidade
            </h2>
            <p style={{fontSize:'15px',color:'#4A4845',lineHeight:1.8,fontWeight:'300'}}>
              A Casa Forte atua há 13 anos no mercado da construção civil, construindo uma trajetória marcada por responsabilidade, qualidade e compromisso. Ao longo dos anos, a empresa passou por diferentes segmentos do mercado, da construção de casas populares a empreendimentos de luxo, sempre mantendo o foco em entregar bem, cumprir prazos e gerar valor para clientes, parceiros e investidores.
            </p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2px'}}>
            {stats.map((stat, i) => (
              <div key={i} style={{padding:'36px 28px',background: i % 2 === 0 ? '#F5F3F0' : '#FFFFFF',border:'1px solid #ECEAE6'}}>
                <div style={{fontFamily:'Playfair Display, serif',fontSize:'40px',fontWeight:'700',color:'#2A2A2A',lineHeight:1,marginBottom:'8px'}}>{stat.value}</div>
                <div style={{fontSize:'12px',color:'#8A8680',fontWeight:'500'}}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}