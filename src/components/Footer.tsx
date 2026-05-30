export default function Footer() {
  const links = ['#inicio|Início','#historia|História','#empreendimentos|Empreendimentos','#contato|Contato']
  return (
    <footer style={{background:'#2A2A2A',padding:'60px 32px 32px'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'48px',marginBottom:'48px',paddingBottom:'48px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          <div>
            <div style={{marginBottom:'16px'}}>
              <img
                src="/images/logosemfundo_casa_forte.png"
                alt="Casa Forte"
                style={{height:'48px',width:'auto',objectFit:'contain',filter:'brightness(0) invert(1)'}}
              />
            </div>
            <p style={{fontSize:'13px',color:'rgba(255,255,255,0.4)',lineHeight:1.7,fontWeight:'300'}}>
              Há 13 anos construindo com qualidade, responsabilidade e compromisso.
            </p>
          </div>
          <div>
            <div style={{fontSize:'11px',fontWeight:'600',color:'rgba(255,255,255,0.35)',marginBottom:'20px',letterSpacing:'0.1em'}}>NAVEGAÇÃO</div>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {links.map(item => {
                const [href, label] = item.split('|')
                return (
                  <a key={href} href={href} style={{fontSize:'14px',color:'rgba(255,255,255,0.55)',fontWeight:'300'}}>
                    {label}
                  </a>
                )
              })}
            </div>
          </div>
          <div>
            <div style={{fontSize:'11px',fontWeight:'600',color:'rgba(255,255,255,0.35)',marginBottom:'20px',letterSpacing:'0.1em'}}>CONTATO</div>
            <a href="https://wa.me/5582991017208" target="_blank" rel="noopener noreferrer"
              style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'10px 18px',background:'rgba(232,57,14,0.15)',border:'1px solid rgba(232,57,14,0.3)',color:'#E8390E',borderRadius:'8px',fontSize:'13px',fontWeight:'500'}}>
              WhatsApp: (82) 99101-7208
            </a>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:'12px',color:'rgba(255,255,255,0.25)'}}>Casa Forte Construtora e Incorporadora.</span>
          <span style={{fontSize:'12px',color:'rgba(255,255,255,0.15)'}}>Alagoas, Brasil</span>
        </div>
      </div>
    </footer>
  )
}