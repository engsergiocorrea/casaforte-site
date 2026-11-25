import { projects } from '@/data/projects'
import ProjectCard from './ProjectCard'
import Reveal from './Reveal'

export default function ProjectsSection() {
  return (
    <section id="empreendimentos" style={{background:'#F5F3F0',padding:'6rem 1.5rem'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <Reveal style={{marginBottom:'3rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1.25rem'}}>
            <span style={{width:'32px',height:'1px',background:'#E8390E'}} />
            <span style={{fontSize:'0.75rem',fontWeight:600,color:'#E8390E',letterSpacing:'0.16em',textTransform:'uppercase'}}>Portfólio</span>
          </div>
          <h2 style={{fontFamily:'var(--display)',fontSize:'clamp(1.875rem, 6vw, 2.875rem)',fontWeight:600,color:'#2A2A2A',lineHeight:1.15,letterSpacing:'-0.03em',marginBottom:'1rem',maxWidth:'40rem'}}>
            Empreendimentos na Rota Ecológica dos Milagres
          </h2>
          <p style={{fontSize:'1rem',color:'#5A5753',lineHeight:1.75,maxWidth:'37rem',fontWeight:400}}>
            Depois de uma trajetória consolidada na construção civil, a Casa Forte iniciou sua expansão para a Rota Ecológica dos Milagres, desenvolvendo empreendimentos que unem localização, qualidade construtiva e potencial de valorização imobiliária.
          </p>
        </Reveal>
        <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'1.25rem'}} className="cf-projects-grid">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 3) * 60} style={{height:'100%'}}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`
        @media (min-width: 640px) {
          .cf-projects-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .cf-projects-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
