export default function Footer() {
  const links = ['#inicio|Início','#historia|História','#empreendimentos|Empreendimentos','#contato|Contato']
  return (
    <footer style={{background:'#2A2A2A',padding:'3.75rem 1.5rem 2rem'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'2.5rem',marginBottom:'2.5rem',paddingBottom:'2.5rem',borderBottom:'1px solid rgba(255,255,255,0.08)'}} className="cf-footer-grid">
          <div>
            <div style={{marginBottom:'1rem'}}>
              <img
                src="https://idjzhzqvfhtfycvmfoen.supabase.co/storage/v1/object/public/empreendimentos/logosemfundo%20casa%20forte.png"
                alt="Casa Forte"
                style={{height:'44px',width:'auto',objectFit:'contain',filter:'brightness(0) invert(1)'}}
              />
            </div>
            <p style={{fontSize:'0.8125rem',color:'rgba(255,255,255,0.4)',lineHeight:1.7,fontWeight:'300',maxWidth:'17.5rem'}}>
              Há 13 anos construindo com qualidade, responsabilidade e compromisso.
            </p>
          </div>
          <div>
            <div style={{fontSize:'0.6875rem',fontWeight:'600',color:'rgba(255,255,255,0.35)',marginBottom:'1rem',letterSpacing:'0.15em'}}>NAVEGAÇÃO</div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {links.map(item => {
                const [href, label] = item.split('|')
                return (
                  <a key={href} href={href} style={{fontSize:'0.875rem',color:'rgba(255,255,255,0.55)',fontWeight:'300'}}>
                    {label}
                  </a>
                )
              })}
            </div>
          </div>
          <div>
            <div style={{fontSize:'0.6875rem',fontWeight:'600',color:'rgba(255,255,255,0.35)',marginBottom:'1rem',letterSpacing:'0.15em'}}>CONTATO</div>
            <a href="https://wa.me/5582991017208" target="_blank" rel="noopener noreferrer"
              style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',padding:'0.625rem 1.125rem',background:'rgba(232,57,14,0.15)',border:'1px solid rgba(232,57,14,0.3)',color:'#E8390E',borderRadius:'8px',fontSize:'0.8125rem',fontWeight:'500'}}>
              WhatsApp: (82) 99101-7208
            </a>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',alignItems:'center',textAlign:'center'}} className="cf-footer-bottom">
          <span style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.25)'}}>Casa Forte Construtora e Incorporadora.</span>
          <span style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.15)'}}>Alagoas, Brasil</span>
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .cf-footer-grid { grid-template-columns: 1fr 1fr 1fr !important; gap: 3rem !important; }
          .cf-footer-bottom { flex-direction: row !important; justify-content: space-between !important; text-align: left !important; }
        }
      `}</style>
    </footer>
  )
}