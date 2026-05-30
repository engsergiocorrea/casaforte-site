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
    <div
      style={{background:'#FFFFFF',border:'1px solid #ECEAE6',borderRadius:'12px',overflow:'hidden',transition:'transform 0.25s ease'}}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.10)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{position:'relative',height:'220px',overflow:'hidden',background:'#F5F3F0'}}>
        <img
          src={project.image}
          alt={project.name}
          style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}}
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
        <div style={{position:'absolute',top:'14px',left:'14px',padding:'4px 12px',borderRadius:'20px',background:phase.bg,color:phase.color,fontSize:'11px',fontWeight:'700'}}>
          {project.phase}
        </div>
      </div>
      <div style={{padding:'24px'}}>
        <div style={{fontSize:'11px',color:'#8A8680',marginBottom:'6px'}}>{project.location}</div>
        <h3 style={{fontFamily:'Playfair Display, serif',fontSize:'20px',fontWeight:'600',color:'#2A2A2A',marginBottom:'10px'}}>{project.name}</h3>
        <p style={{fontSize:'13px',color:'#4A4845',lineHeight:1.7,marginBottom:'20px',fontWeight:'300'}}>{project.description}</p>
        <a href="https://wa.me/5582991017208" target="_blank" rel="noopener noreferrer" style={{fontSize:'12px',fontWeight:'600',color:'#E8390E'}}>Fale conosco</a>
      </div>
    </div>
  )
}