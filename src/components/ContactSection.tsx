export default function ContactSection() {
  return (
    <section id="contato" style={{background:'#F5F3F0',padding:'100px 32px'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{background:'#FFFFFF',border:'1px solid #ECEAE6',borderRadius:'16px',padding:'72px 64px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'80px',alignItems:'center'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
              <span style={{width:'32px',height:'1px',background:'#E8390E'}} />
              <span style={{fontSize:'11px',fontWeight:'600',color:'#E8390E',letterSpacing:'0.15em',textTransform:'uppercase'}}>Contato</span>
            </div>
            <h2 style={{fontFamily:'Playfair Display, serif',fontSize:'clamp(28px, 4vw, 42px)',fontWeight:'600',color:'#2A2A2A',lineHeight:1.2,marginBottom:'20px'}}>
              Fale com a<br /><em style={{fontStyle:'italic',color:'#8A8680'}}>Casa Forte</em>
            </h2>
            <p style={{fontSize:'15px',color:'#4A4845',lineHeight:1.7,fontWeight:'300',marginBottom:'36px'}}>
              Quer conhecer nossos empreendimentos, investir ou falar com nossa equipe?
            </p>
            <a href="https://wa.me/5582991017208" target="_blank" rel="noopener noreferrer"
              style={{display:'inline-flex',alignItems:'center',gap:'10px',padding:'15px 32px',background:'#E8390E',color:'white',borderRadius:'8px',fontSize:'14px',fontWeight:'600'}}>
              Chamar no WhatsApp
            </a>
          </div>
          <div style={{padding:'40px',background:'#F5F3F0',borderRadius:'12px',border:'1px solid #ECEAE6'}}>
            <div style={{marginBottom:'20px'}}>
              <img
                src="https://idjzhzqvfhtfycvmfoen.supabase.co/storage/v1/object/public/empreendimentos/logosemfundo%20casa%20forte.png"
                alt="Casa Forte"
                style={{height:'52px',width:'auto',objectFit:'contain'}}
              />
            </div>
            <div style={{fontSize:'12px',color:'#8A8680',marginBottom:'28px'}}>Construtora e Incorporadora</div>
            <div style={{fontSize:'14px',color:'#4A4845',marginBottom:'8px'}}>Alagoas, Brasil</div>
            <a href="https://wa.me/5582991017208" target="_blank" rel="noopener noreferrer" style={{fontSize:'14px',color:'#2A2A2A'}}>
              (82) 99101-7208
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}