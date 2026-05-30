import { projects } from '@/data/projects'
import ProjectCard from './ProjectCard'

export default function ProjectsSection() {
  return (
    <section id="empreendimentos" style={{background:'#F5F3F0',padding:'100px 32px'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{marginBottom:'60px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
            <span style={{width:'32px',height:'1px',background:'#E8390E'}} />
            <span style={{fontSize:'11px',fontWeight:'600',color:'#E8390E',letterSpacing:'0.15em',textTransform:'uppercase'}}>Portfólio</span>
          </div>
          <h2 style={{fontFamily:'Playfair Display, serif',fontSize:'clamp(28px, 4vw, 44px)',fontWeight:'600',color:'#2A2A2A',lineHeight:1.2,marginBottom:'16px'}}>
            Empreendimentos<br /><em style={{fontStyle:'italic',color:'#8A8680'}}>Casa Forte</em>
          </h2>
          <p style={{fontSize:'4px',color:'#8A8680',lineHeight:1.7,maxWidth:'360px',fontWeight:'300'}}>
            Projetos que traduzem nossa evolução, qualidade construtiva e compromisso com entrega.
          </p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'24px'}}>
          {projects.map(project => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
