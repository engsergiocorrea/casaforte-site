import Reveal from './Reveal'
import FormInteresse from './FormInteresse'

const WHATSAPP = 'https://wa.me/5582991017208'

export default function ContactSection() {
  return (
    <section id="contato" style={{background:'#F5F3F0',padding:'6rem 1.5rem'}}>
      <Reveal style={{maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{background:'#FFFFFF',borderRadius:'20px',padding:'clamp(1.75rem, 5vw, 3.5rem)',boxShadow:'0 1px 2px rgba(42,42,42,0.04), 0 0 0 1px rgba(42,42,42,0.05)'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'2.5rem'}} className="cf-contact-grid">
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1.25rem'}}>
                <span style={{width:'32px',height:'1px',background:'#E8390E'}} />
                <span style={{fontSize:'0.75rem',fontWeight:600,color:'#E8390E',letterSpacing:'0.16em',textTransform:'uppercase'}}>Contato</span>
              </div>
              <h2 style={{fontFamily:'var(--display)',fontSize:'clamp(1.875rem, 5vw, 2.75rem)',fontWeight:600,color:'#2A2A2A',lineHeight:1.15,letterSpacing:'-0.03em',marginBottom:'0.75rem'}}>
                Fale com a Casa Forte
              </h2>
              <p style={{fontSize:'1rem',color:'#45433F',lineHeight:1.7,fontWeight:400,marginBottom:'1.75rem',maxWidth:'34rem'}}>
                Deixe seu contato e nossa equipe fala com você pelo WhatsApp — sobre um empreendimento específico, investimento ou para conhecer as opções.
              </p>
              <FormInteresse />
            </div>
            <aside style={{padding:'2rem',background:'#F5F3F0',borderRadius:'14px',alignSelf:'start'}}>
              <img src="/images/logosemfundo_casa_forte.png" alt="Casa Forte" width={69} height={48} style={{height:'48px',width:'auto',objectFit:'contain',marginBottom:'1rem'}} />
              <div style={{fontSize:'0.8125rem',color:'#6F6B66',marginBottom:'1.25rem',fontWeight:500}}>Construtora e Incorporadora</div>
              <dl style={{display:'grid',gap:'0.875rem',fontSize:'0.9375rem',marginBottom:'1.5rem'}}>
                <div>
                  <dt style={{fontSize:'0.75rem',color:'#6F6B66',marginBottom:'0.125rem'}}>Endereço</dt>
                  <dd style={{color:'#2A2A2A'}}>Maceió · Alagoas</dd>
                </div>
                <div>
                  <dt style={{fontSize:'0.75rem',color:'#6F6B66',marginBottom:'0.125rem'}}>WhatsApp</dt>
                  <dd><a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{color:'#2A2A2A',fontWeight:500}}>(82) 99101-7208</a></dd>
                </div>
              </dl>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="cf-btn"
                style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',width:'100%',padding:'0.8125rem 1.25rem',background:'#FFFFFF',color:'#2A2A2A',border:'1px solid #DDD9D3',borderRadius:'10px',fontSize:'0.9375rem',fontWeight:600}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true"><path d="M12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12S18.6 0 12 0zm5.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z"/></svg>
                Prefiro chamar no WhatsApp
              </a>
            </aside>
          </div>
        </div>
      </Reveal>
      <style>{`
        @media (min-width: 900px) {
          .cf-contact-grid { grid-template-columns: 1.5fr 1fr !important; gap: 4rem !important; }
        }
      `}</style>
    </section>
  )
}
