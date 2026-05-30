export default function Hero() {
  return (
    <section id="inicio" style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:'url(/images/Uma__Milagres.png)',backgroundSize:'cover',backgroundPosition:'center center',filter:'brightness(0.55)'}} />
      <div style={{position:'absolute',inset:0,background:'linear-gradient(120deg, rgba(42,42,42,0.75) 0%, rgba(42,42,42,0.3) 70%, transparent 100%)'}} />
      <div style={{position:'absolute',left:0,top:'30%',width:'4px',height:'100px',background:'#E8390E'}} />
      <div style={{position:'relative',maxWidth:'1200px',margin:'0 auto',padding:'100px 24px 80px',width:'100%'}}>
        <div style={{maxWidth:'600px'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',marginBottom:'24px'}}>
            <span style={{width:'28px',height:'1px',background:'#E8390E'}} />
            <span style={{fontSize:'11px',fontWeight:'600',color:'rgba(255,255,255,0.7)',letterSpacing:'0.12em',textTransform:'uppercase'}}>Construtora &amp; Incorporadora</span>
          </div>
          <h1 style={{fontFamily:'Playfair Display, serif',fontSize:'clamp(32px, 8vw, 68px)',fontWeight:'700',color:'#FFFFFF',lineHeight:1.1,marginBottom:'20px'}}>
            Casa Forte<br />
            <em style={{fontStyle:'italic',color:'rgba(255,255,255,0.85)'}}>Construtora</em>
          </h1>
          <p style={{fontSize:'clamp(15px, 4vw, 18px)',fontWeight:'300',color:'rgba(255,255,255,0.85)',lineHeight:1.6,marginBottom:'14px'}}>
            Há 13 anos construindo com solidez, qualidade e compromisso em Alagoas.
          </p>
          <p style={{fontSize:'14px',color:'rgba(255,255,255,0.6)',lineHeight:1.7,marginBottom:'36px',maxWidth:'480px'}}>
            Da construção de casas populares a empreendimentos de luxo, a Casa Forte entrega obras com responsabilidade, padrão construtivo e rigor no cumprimento dos prazos.
          </p>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}} className="cf-hero-btns">
            <a href="#empreendimentos" style={{padding:'14px 28px',background:'#E8390E',color:'white',borderRadius:'8px',fontSize:'14px',fontWeight:'600',display:'inline-block',textAlign:'center'}}>
              Conheça nossos empreendimentos
            </a>
            <a href="https://wa.me/5582991017208" target="_blank" rel="noopener noreferrer"
              style={{padding:'14px 28px',background:'transparent',color:'white',border:'1px solid rgba(255,255,255,0.4)',borderRadius:'8px',fontSize:'14px',fontWeight:'500',display:'inline-block',textAlign:'center'}}>
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