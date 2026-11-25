import Reveal from './Reveal'

const stats = [
  { value: '13', label: 'Anos de atuação no mercado da construção civil' },
  { value: '500+', label: 'Casas populares construídas ao longo da trajetória' },
  { value: '5', label: 'Empreendimentos na Rota Ecológica dos Milagres' },
]

const paragrafo = { fontSize:'1rem', color:'#45433F', lineHeight:1.75, fontWeight:400 } as const

export default function AboutSection() {
  return (
    <section id="historia" style={{background:'#FFFFFF',padding:'6rem 1.5rem'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <Reveal>
          <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1.25rem'}}>
            <span style={{width:'32px',height:'1px',background:'#E8390E'}} />
            <span style={{fontSize:'0.75rem',fontWeight:600,color:'#E8390E',letterSpacing:'0.16em',textTransform:'uppercase'}}>Nossa história</span>
          </div>
        </Reveal>
        <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'3rem'}} className="cf-about-grid">
          <Reveal>
            <h2 style={{fontFamily:'var(--display)',fontSize:'clamp(1.875rem, 5vw, 2.875rem)',fontWeight:600,color:'#2A2A2A',lineHeight:1.15,letterSpacing:'-0.03em',marginBottom:'1.5rem'}}>
              Uma trajetória construída com solidez
            </h2>
            <p style={{...paragrafo,marginBottom:'1rem'}}>
              A Casa Forte atua há 13 anos no mercado da construção civil, com uma trajetória marcada por responsabilidade técnica, qualidade construtiva e compromisso com a entrega.
            </p>
            <p style={{...paragrafo,marginBottom:'1rem'}}>
              Antes de expandir sua atuação para a Rota Ecológica dos Milagres, a empresa construiu mais de 500 casas populares, consolidando experiência prática em execução, gestão de obra e cumprimento de prazos.
            </p>
            <p style={paragrafo}>
              Com essa base sólida, a Casa Forte evoluiu para o desenvolvimento de empreendimentos imobiliários em uma das regiões mais valorizadas do litoral alagoano, mantendo o mesmo compromisso: executar bem, entregar no prazo e gerar valor para clientes, parceiros e investidores.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
              {stats.map((stat, i) => (
                <div key={i} style={{padding:'1.75rem 1.375rem',background:'#F5F3F0',borderRadius:'14px'}}>
                  <div style={{fontFamily:'var(--display)',fontSize:'clamp(2.25rem, 6vw, 2.75rem)',fontWeight:700,color:'#2A2A2A',lineHeight:1,letterSpacing:'-0.03em',marginBottom:'0.625rem',fontVariantNumeric:'lining-nums'}}>{stat.value}</div>
                  <div style={{fontSize:'0.8125rem',color:'#6F6B66',fontWeight:500,lineHeight:1.5}}>{stat.label}</div>
                </div>
              ))}
              {/* Compromisso: em vez de um número, a promessa da empresa. */}
              <div style={{padding:'1.75rem 1.375rem',background:'#2A2A2A',borderRadius:'14px',display:'flex',flexDirection:'column',justifyContent:'space-between',gap:'0.75rem'}}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8390E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" /><path d="M8.5 12l2.5 2.5 4.5-5" />
                </svg>
                <div>
                  <div style={{fontFamily:'var(--display)',fontSize:'1.25rem',fontWeight:600,color:'#FFFFFF',lineHeight:1.2,marginBottom:'0.5rem'}}>Qualidade e prazo</div>
                  <div style={{fontSize:'0.8125rem',color:'rgba(255,255,255,0.72)',fontWeight:400,lineHeight:1.5}}>Nosso compromisso total em cada obra, do projeto à entrega das chaves.</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (min-width: 900px) {
          .cf-about-grid { grid-template-columns: 1.1fr 1fr !important; gap: 5rem !important; align-items: center; }
        }
      `}</style>
    </section>
  )
}
