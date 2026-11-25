import Image from 'next/image'
import heroImg from '../../public/images/Uma__Milagres.png'

export default function Hero() {
  return (
    <section id="inicio" style={{position:'relative',minHeight:'100svh',display:'flex',alignItems:'center',overflow:'hidden',background:'#2A2A2A'}}>
      <Image
        src={heroImg}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        style={{objectFit:'cover',objectPosition:'center',filter:'brightness(0.6)'}}
      />
      <div style={{position:'absolute',inset:0,background:'linear-gradient(110deg, rgba(30,29,28,0.82) 0%, rgba(30,29,28,0.45) 55%, rgba(30,29,28,0.1) 100%)'}} />
      <div style={{position:'absolute',inset:'auto 0 0 0',height:'30%',background:'linear-gradient(to top, rgba(30,29,28,0.55), transparent)'}} />
      <div style={{position:'relative',maxWidth:'1200px',margin:'0 auto',padding:'7rem 1.5rem 5rem',width:'100%'}}>
        <div style={{maxWidth:'38rem'}} className="cf-hero-texto">
          <div style={{display:'inline-flex',alignItems:'center',gap:'0.625rem',marginBottom:'1.5rem'}}>
            <span style={{width:'28px',height:'1px',background:'#E8390E'}} />
            <span style={{fontSize:'0.75rem',fontWeight:600,color:'rgba(255,255,255,0.8)',letterSpacing:'0.16em',textTransform:'uppercase'}}>Construtora &amp; Incorporadora</span>
          </div>
          <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(2.75rem, 9vw, 4.75rem)',fontWeight:700,color:'#FFFFFF',lineHeight:1.02,letterSpacing:'-0.025em',marginBottom:'1.25rem'}}>
            Casa Forte
          </h1>
          <p style={{fontSize:'clamp(1.0625rem, 3.6vw, 1.25rem)',fontWeight:400,color:'rgba(255,255,255,0.92)',lineHeight:1.55,marginBottom:'0.875rem'}}>
            Há 13 anos construindo com solidez, qualidade e compromisso em Alagoas.
          </p>
          <p style={{fontSize:'0.9375rem',color:'rgba(255,255,255,0.72)',lineHeight:1.7,marginBottom:'2.25rem',maxWidth:'31rem'}}>
            Da construção de casas populares a empreendimentos de luxo, a Casa Forte entrega obras com responsabilidade, padrão construtivo e rigor no cumprimento dos prazos.
          </p>
          <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}} className="cf-hero-btns">
            <a href="#empreendimentos" className="cf-btn cf-btn-primary" style={{padding:'0.9375rem 1.75rem',background:'#E8390E',color:'white',borderRadius:'10px',fontSize:'0.9375rem',fontWeight:600,display:'inline-block',textAlign:'center'}}>
              Conheça nossos empreendimentos
            </a>
            <a href="https://wa.me/5582991017208" target="_blank" rel="noopener noreferrer" className="cf-btn cf-btn-ghost" style={{padding:'0.9375rem 1.75rem',background:'transparent',color:'white',border:'1px solid rgba(255,255,255,0.45)',borderRadius:'10px',fontSize:'0.9375rem',fontWeight:500,display:'inline-block',textAlign:'center'}}>
              Fale conosco
            </a>
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 600px) {
          .cf-hero-btns { flex-direction: row !important; }
        }
        .cf-hero-texto > * {
          animation: cf-sobe 700ms var(--ease-out) both;
        }
        .cf-hero-texto > *:nth-child(2) { animation-delay: 60ms; }
        .cf-hero-texto > *:nth-child(3) { animation-delay: 120ms; }
        .cf-hero-texto > *:nth-child(4) { animation-delay: 180ms; }
        .cf-hero-texto > *:nth-child(5) { animation-delay: 240ms; }
        @keyframes cf-sobe { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .cf-hero-texto > * { animation: none; }
        }
      `}</style>
    </section>
  )
}
