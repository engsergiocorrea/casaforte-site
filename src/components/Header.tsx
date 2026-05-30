'use client'
import { useState, useEffect } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'História', href: '#historia' },
    { label: 'Empreendimentos', href: '#empreendimentos' },
    { label: 'Contato', href: '#contato' },
  ]

  return (
    <header style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:scrolled||menuOpen?'rgba(245,243,240,0.98)':'transparent',backdropFilter:scrolled?'blur(12px)':'none',borderBottom:scrolled?'1px solid #DDD9D3':'1px solid transparent',transition:'all 0.35s ease'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 24px',height:'64px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <a href="#inicio" style={{display:'flex',alignItems:'center'}}>
          <img
            src="https://idjzhzqvfhtfycvmfoen.supabase.co/storage/v1/object/public/empreendimentos/logosemfundo%20casa%20forte.png"
            alt="Casa Forte"
            style={{height:'40px',width:'auto',objectFit:'contain'}}
          />
        </a>

        {/* Nav desktop */}
        <nav style={{display:'flex',alignItems:'center',gap:'32px'}} className="cf-desktop-nav">
          {navLinks.map(link => (
            <a key={link.href} href={link.href}
              style={{fontSize:'13px',fontWeight:'500',color:'#4A4845',transition:'color 0.2s'}}
              onMouseEnter={e => (e.currentTarget.style.color = '#E8390E')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4A4845')}>
              {link.label}
            </a>
          ))}
          <a href="https://wa.me/5582991017208" target="_blank" rel="noopener noreferrer"
            style={{padding:'9px 20px',background:'#E8390E',color:'white',borderRadius:'8px',fontSize:'13px',fontWeight:'500'}}>
            Fale conosco
          </a>
        </nav>

        {/* Hamburguer mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{display:'none',background:'none',border:'none',padding:'8px',flexDirection:'column',gap:'5px',cursor:'pointer'}}
          className="cf-mobile-btn"
          aria-label="Menu"
        >
          <span style={{width:'22px',height:'2px',background:'#2A2A2A',display:'block',transition:'all 0.3s',transform:menuOpen?'rotate(45deg) translateY(7px)':'none'}} />
          <span style={{width:'22px',height:'2px',background:'#2A2A2A',display:'block',transition:'all 0.3s',opacity:menuOpen?0:1}} />
          <span style={{width:'22px',height:'2px',background:'#2A2A2A',display:'block',transition:'all 0.3s',transform:menuOpen?'rotate(-45deg) translateY(-7px)':'none'}} />
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div style={{background:'rgba(245,243,240,0.98)',borderTop:'1px solid #DDD9D3',padding:'20px 24px 28px',display:'flex',flexDirection:'column',gap:'20px'}}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              style={{fontSize:'16px',fontWeight:'500',color:'#2A2A2A'}}>
              {link.label}
            </a>
          ))}
          <a href="https://wa.me/5582991017208" target="_blank" rel="noopener noreferrer"
            style={{padding:'12px 20px',background:'#E8390E',color:'white',borderRadius:'8px',fontSize:'14px',fontWeight:'600',textAlign:'center'}}>
            Fale conosco
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .cf-desktop-nav { display: none !important; }
          .cf-mobile-btn { display: flex !important; }
        }
      `}</style>
    </header>
  )
}