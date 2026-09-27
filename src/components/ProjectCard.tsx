'use client'
import type { Project } from '@/data/projects'

const phaseConfig: Record<string, { bg: string; color: string }> = {
  'Entregue': { bg: '#dcfce7', color: '#15803d' },
  'Em obra': { bg: '#fef3c7', color: '#92400e' },
  'Lançamento': { bg: '#fee2e2', color: '#E8390E' },
}

export default function ProjectCard({ project }: { project: Project }) {
  const phase = phaseConfig[project.phase] ?? { bg: '#f3f4f6', color: '#6b7280' }
  return (
    <div className="cf-project-card" style={{background:'#FFFFFF',border:'1px solid #ECEAE6',borderRadius:'12px',overflow:'hidden'}}>
      <div style={{position:'relative',height:'220px',overflow:'hidden',background:'#F5F3F0'}}>
        <img
          src={project.image}
          alt={project.name}
          style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}}
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
        <div style={{position:'absolute',top:'14px',left:'14px',padding:'0.25rem 0.75rem',borderRadius:'20px',background:phase.bg,color:phase.color,fontSize:'0.6875rem',fontWeight:'700'}}>
          {project.phase}
        </div>
      </div>
      <div style={{padding:'1.5rem'}}>
        <div style={{fontSize:'0.6875rem',color:'#8A8680',marginBottom:'0.375rem'}}>{project.location}</div>
        <h3 style={{fontFamily:'Playfair Display, serif',fontSize:'1.25rem',fontWeight:'600',color:'#2A2A2A',marginBottom:'0.625rem'}}>{project.name}</h3>
        <p style={{fontSize:'0.8125rem',color:'#4A4845',lineHeight:1.7,marginBottom:'1.25rem',fontWeight:'300'}}>{project.description}</p>
        <a href="https://wa.me/5582991017208" target="_blank" rel="noopener noreferrer" style={{fontSize:'0.75rem',fontWeight:'600',color:'#E8390E'}}>Fale conosco</a>
      </div>
      <style>{`
        .cf-project-card { transition: transform 200ms ease, box-shadow 200ms ease; }
        .cf-project-card:hover, .cf-project-card:active {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.10);
        }
        @media (prefers-reduced-motion: reduce) {
          .cf-project-card:hover, .cf-project-card:active { transform: none; }
        }
      `}</style>
    </div>
  )
}