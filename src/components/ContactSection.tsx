export default function ContactSection() {
  return (
    <section id="contato" style={{background:'#F5F3F0',padding:'5rem 1.5rem'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{background:'#FFFFFF',border:'1px solid #ECEAE6',borderRadius:'16px',padding:'3rem 2rem'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'3rem'}} className="cf-contact-grid">
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1.25rem'}}>
                <span style={{width:'32px',height:'1px',background:'#E8390E'}} />
                <span style={{fontSize:'0.6875rem',fontWeight:'600',color:'#E8390E',letterSpacing:'0.15em',textTransform:'uppercase'}}>Contato</span>
              </div>
              <h2 style={{fontFamily:'Playfair Display, serif',fontSize:'clamp(1.75rem, 5vw, 2.625rem)',fontWeight:'600',color:'#2A2A2A',lineHeight:1.2,letterSpacing:'-0.015em',marginBottom:'1rem'}}>
                Fale com a Casa Forte
              </h2>
              <p style={{fontSize:'0.9375rem',color:'#4A4845',lineHeight:1.7,fontWeight:'300',marginBottom:'2rem'}}>
                Quer conhecer nossos empreendimentos, investir ou falar com nossa equipe?
              </p>
              <a href="https://wa.me/5582991017208" target="_blank" rel="noopener noreferrer"
                style={{display:'inline-flex',alignItems:'center',gap:'0.625rem',padding:'0.9375rem 2rem',background:'#E8390E',color:'white',borderRadius:'8px',fontSize:'0.875rem',fontWeight:'600'}}>
                Chamar no WhatsApp
              </a>
            </div>
            <div style={{padding:'2rem',background:'#F5F3F0',borderRadius:'12px',border:'1px solid #ECEAE6'}}>
              <div style={{marginBottom:'1rem'}}>
                <img
                  src="https://idjzhzqvfhtfycvmfoen.supabase.co/storage/v1/object/public/empreendimentos/logosemfundo%20casa%20forte.png"
                  alt="Casa Forte"
                  style={{height:'48px',width:'auto',objectFit:'contain'}}
                />
              </div>
              <div style={{fontSize:'0.75rem',color:'#8A8680',marginBottom:'1.25rem'}}>Construtora e Incorporadora</div>
              <div style={{fontSize:'0.875rem',color:'#4A4845',marginBottom:'0.5rem'}}>Alagoas, Brasil</div>
              <a href="https://wa.me/5582991017208" target="_blank" rel="noopener noreferrer"
                style={{fontSize:'0.875rem',color:'#2A2A2A'}}>
                (82) 99101-7208
              </a>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .cf-contact-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  )
}