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
    <header style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:scrolled?'rgba(245,243,240,0.96)':'transparent',backdropFilter:scrolled?'blur(12px)':'none',borderBottom:scrolled?'1px solid #DDD9D3':'1px solid transparent',transition:'all 0.35s ease'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 32px',height:'68px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <a href="#inicio" style={{display:'flex',alignItems:'center'}}>
          <img
            src="/images/logosemfundo_casa_forte.png"
            alt="Casa Forte"
            style={{height:'44px',width:'auto',objectFit:'contain'}}
          />
        </a>
        <nav style={{display:'flex',alignItems:'center',gap:'36px'}}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href}
              style={{fontSize:'13px',fontWeight:'500',color:'#4A4845',letterSpacing:'0.02em',transition:'color 0.2s'}}
              onMouseEnter={e => (e.currentTarget.style.color = '#E8390E')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4A4845')}>
              {link.label}
            </a>
          ))}
          <a href="https://wa.me/5582991017208" target="_blank" rel="noopener noreferrer"
            style={{padding:'9px 20px',background:'#E8390E',color:'white',borderRadius:'8px',fontSize:'13px',fontWeight:'500',transition:'background 0.2s'}}
            onMouseEnter={e => (e.currentTarget.style.background = '#B8290A')}
            onMouseLeave={e => (e.currentTarget.style.background = '#E8390E')}>
            Fale conosco
          </a>
        </nav>
      </div>
    </header>
  )
}