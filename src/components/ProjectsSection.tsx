import { projects } from '@/data/projects'
import ProjectCard from './ProjectCard'

export default function ProjectsSection() {
  return (
    <section id="empreendimentos" style={{background:'#F5F3F0',padding:'80px 24px'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{marginBottom:'48px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
            <span style={{width:'32px',height:'1px',background:'#E8390E'}} />
            <span style={{fontSize:'11px',fontWeight:'600',color:'#E8390E',letterSpacing:'0.15em',textTransform:'uppercase'}}>Portfólio</span>
          </div>
          <h2 style={{fontFamily:'Playfair Display, serif',fontSize:'clamp(26px, 6vw, 44px)',fontWeight:'600',color:'#2A2A2A',lineHeight:1.2,marginBottom:'16px'}}>
            Empreendimentos na Rota Ecológica dos Milagres
          </h2>
          <p style={{fontSize:'14px',color:'#8A8680',lineHeight:1.8,maxWidth:'560px',fontWeight:'300'}}>
            Depois de uma trajetória consolidada na construção civil, a Casa Forte iniciou sua expansão para a Rota Ecológica dos Milagres, desenvolvendo empreendimentos que unem localização, qualidade construtiva e potencial de valorização imobiliária.
          </p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'20px'}} className="cf-projects-grid">
          {projects.map(project => (
            <ProjectCard key={project.slug} project={project} />
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