'use client'
import { useState, useEffect } from 'react'

const WHATSAPP = 'https://wa.me/5582991017208'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'História', href: '#historia' },
    { label: 'Empreendimentos', href: '#empreendimentos' },
    { label: 'Contato', href: '#contato' },
  ]

  const solido = scrolled || menuOpen
  const corLink = solido ? '#45433F' : 'rgba(255,255,255,0.92)'
  const corBarra = solido ? '#2A2A2A' : '#FFFFFF'
  const barra = { width: '22px', height: '2px', background: corBarra, display: 'block', borderRadius: '1px', transition: 'transform 200ms var(--ease-out), opacity 150ms ease, background-color 200ms ease' }

  return (
    <header className="cf-header" data-solido={solido} style={{position:'fixed',top:0,left:0,right:0,zIndex:100}}>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 1.5rem',height:'68px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <a href="#inicio" style={{display:'flex',alignItems:'center'}} aria-label="Casa Forte — início">
          {/* Sobre a foto escura o logo fica branco; ao rolar volta às cores. */}
          <img
            src="/images/logosemfundo_casa_forte.png"
            alt="Casa Forte"
            width={60} height={42}
            style={{height:'42px',width:'auto',objectFit:'contain',filter:solido?'none':'brightness(0) invert(1)',transition:'filter 200ms ease'}}
          />
        </a>

        {/* Nav desktop */}
        <nav style={{display:'flex',alignItems:'center',gap:'2rem'}} className="cf-desktop-nav" aria-label="Principal">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="cf-nav-link"
              style={{fontSize:'0.875rem',fontWeight:500,color:corLink,transition:'color 150ms ease'}}>
              {link.label}
            </a>
          ))}
          <a href="/cliente" className="cf-btn"
            style={{padding:'0.5rem 1.125rem',border:`1px solid ${solido?'#DDD9D3':'rgba(255,255,255,0.55)'}`,color:solido?'#2A2A2A':'#FFFFFF',borderRadius:'8px',fontSize:'0.875rem',fontWeight:500}}>
            Área do Cliente
          </a>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="cf-btn cf-btn-primary"
            style={{padding:'0.5625rem 1.25rem',background:'#E8390E',color:'white',borderRadius:'8px',fontSize:'0.875rem',fontWeight:600}}>
            Fale conosco
          </a>
        </nav>

        {/* Hamburguer mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{display:'none',background:'none',border:'none',padding:'10px',flexDirection:'column',gap:'5px',cursor:'pointer'}}
          className="cf-mobile-btn"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          <span style={{...barra,transform:menuOpen?'translateY(7px) rotate(45deg)':'none'}} />
          <span style={{...barra,opacity:menuOpen?0:1}} />
          <span style={{...barra,transform:menuOpen?'translateY(-7px) rotate(-45deg)':'none'}} />
        </button>
      </div>

      {/* Menu mobile */}
      <div
        className="cf-mobile-menu"
        style={{
          background:'rgba(245,243,240,0.98)',borderTop:'1px solid #DDD9D3',
          padding:'1.25rem 1.5rem 1.75rem',display:'flex',flexDirection:'column',gap:'1.25rem',
          position:'absolute',top:'100%',left:0,right:0,
          opacity:menuOpen?1:0,
          transform:menuOpen?'translateY(0)':'translateY(-8px)',
          pointerEvents:menuOpen?'auto':'none',
          transition:'opacity 200ms ease, transform 200ms var(--ease-out)',
          boxShadow:'0 16px 32px -20px rgba(42,42,42,0.35)',
        }}
      >
        {navLinks.map(link => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
            style={{fontSize:'1.0625rem',fontWeight:500,color:'#2A2A2A'}}>
            {link.label}
          </a>
        ))}
        <a href="/cliente" onClick={() => setMenuOpen(false)}
          style={{padding:'0.875rem 1.25rem',border:'1px solid #DDD9D3',color:'#2A2A2A',borderRadius:'10px',fontSize:'0.9375rem',fontWeight:600,textAlign:'center'}}>
          Área do Cliente
        </a>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
          style={{padding:'0.875rem 1.25rem',background:'#E8390E',color:'white',borderRadius:'10px',fontSize:'0.9375rem',fontWeight:600,textAlign:'center'}}>
          Fale conosco
        </a>
      </div>

      <style>{`
        .cf-header {
          background: transparent;
          transition: background-color 200ms ease, box-shadow 200ms ease, backdrop-filter 200ms ease;
        }
        .cf-header[data-solido="true"] {
          background: rgba(245,243,240,0.88);
          -webkit-backdrop-filter: saturate(180%) blur(16px);
          backdrop-filter: saturate(180%) blur(16px);
          box-shadow: 0 1px 0 rgba(42,42,42,0.06), 0 8px 24px -16px rgba(42,42,42,0.25);
        }
        @media (hover: hover) and (pointer: fine) {
          .cf-nav-link:hover { color: #E8390E !important; }
        }
        @media (max-width: 860px) {
          .cf-desktop-nav { display: none !important; }
          .cf-mobile-btn { display: flex !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cf-mobile-menu { transform: none !important; transition: opacity 150ms linear !important; }
        }
        @media (prefers-reduced-transparency: reduce) {
          .cf-header[data-solido="true"] { background: #F5F3F0; backdrop-filter: none; }
        }
      `}</style>
    </header>
  )
}
