export default function Hero() {
  return (
    <section id="inicio" style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:'url(/images/Uma__Milagres.png)',backgroundSize:'cover',backgroundPosition:'center center',filter:'brightness(0.55)'}} />
      <div style={{position:'absolute',inset:0,background:'linear-gradient(120deg, rgba(42,42,42,0.75) 0%, rgba(42,42,42,0.3) 70%, transparent 100%)'}} />
      <div style={{position:'absolute',left:0,top:'30%',width:'4px',height:'100px',background:'#E8390E'}} />
      <div style={{position:'relative',maxWidth:'1200px',margin:'0 auto',padding:'6.25rem 1.5rem 5rem',width:'100%'}}>
        <div style={{maxWidth:'37.5rem'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',marginBottom:'1.5rem'}}>
            <span style={{width:'28px',height:'1px',background:'#E8390E'}} />
            <span style={{fontSize:'0.6875rem',fontWeight:'600',color:'rgba(255,255,255,0.7)',letterSpacing:'0.15em',textTransform:'uppercase'}}>Construtora &amp; Incorporadora</span>
          </div>
          <h1 style={{fontFamily:'Playfair Display, serif',fontSize:'clamp(2rem, 8vw, 4.25rem)',fontWeight:'700',color:'#FFFFFF',lineHeight:1.1,letterSpacing:'-0.02em',marginBottom:'1.25rem'}}>
            Casa Forte
          </h1>
          <p style={{fontSize:'clamp(0.9375rem, 4vw, 1.125rem)',fontWeight:'300',color:'rgba(255,255,255,0.85)',lineHeight:1.6,marginBottom:'0.875rem'}}>
            Há 13 anos construindo com solidez, qualidade e compromisso em Alagoas.
          </p>
          <p style={{fontSize:'0.875rem',color:'rgba(255,255,255,0.6)',lineHeight:1.7,marginBottom:'2.25rem',maxWidth:'30rem'}}>
            Da construção de casas populares a empreendimentos de luxo, a Casa Forte entrega obras com responsabilidade, padrão construtivo e rigor no cumprimento dos prazos.
          </p>
          <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}} className="cf-hero-btns">
            <a href="#empreendimentos" style={{padding:'0.875rem 1.75rem',background:'#E8390E',color:'white',borderRadius:'8px',fontSize:'0.875rem',fontWeight:'600',display:'inline-block',textAlign:'center'}}>
              Conheça nossos empreendimentos
            </a>
            <a href="https://wa.me/5582991017208" target="_blank" rel="noopener noreferrer" style={{padding:'0.875rem 1.75rem',background:'transparent',color:'white',border:'1px solid rgba(255,255,255,0.4)',borderRadius:'8px',fontSize:'0.875rem',fontWeight:'500',display:'inline-block',textAlign:'center'}}>
              Fale conosco
            </a>
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 600px) {
          .cf-hero-btns { flex-direction: row !important; }
        }
      `}</style>
    </section>
  )
}