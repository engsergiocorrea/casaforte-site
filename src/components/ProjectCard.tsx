import Image from 'next/image'
import type { Project } from '@/data/projects'

const phaseConfig: Record<string, { bg: string; color: string }> = {
  'Entregue': { bg: 'rgba(255,255,255,0.92)', color: '#15803d' },
  'Em obra': { bg: 'rgba(255,255,255,0.92)', color: '#92400e' },
  'Lançamento': { bg: '#E8390E', color: '#FFFFFF' },
}

export default function ProjectCard({ project }: { project: Project }) {
  const phase = phaseConfig[project.phase] ?? { bg: 'rgba(255,255,255,0.92)', color: '#45433F' }
  const whatsapp = `https://wa.me/5582991017208?text=${encodeURIComponent(`Olá! Quero saber mais sobre o ${project.name}.`)}`
  return (
    <article className="cf-project-card" style={{background:'#FFFFFF',borderRadius:'16px',overflow:'hidden',height:'100%',display:'flex',flexDirection:'column',boxShadow:'0 1px 2px rgba(42,42,42,0.04), 0 0 0 1px rgba(42,42,42,0.05)'}}>
      <div style={{position:'relative',aspectRatio:'16 / 10',overflow:'hidden',background:'#ECEAE6'}}>
        <Image
          src={project.image}
          alt={`${project.name} — ${project.location}`}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="cf-project-img"
          style={{objectFit:'cover',objectPosition:'center'}}
        />
        <div style={{position:'absolute',top:'14px',left:'14px',padding:'0.3125rem 0.75rem',borderRadius:'999px',background:phase.bg,color:phase.color,fontSize:'0.75rem',fontWeight:600,letterSpacing:'0.01em',backdropFilter:'blur(8px)'}}>
          {project.phase}
        </div>
      </div>
      <div style={{padding:'1.5rem',display:'flex',flexDirection:'column',flex:1}}>
        <div style={{fontSize:'0.75rem',color:'#6F6B66',marginBottom:'0.375rem',fontWeight:500}}>{project.location}</div>
        <h3 style={{fontFamily:'var(--display)',fontSize:'1.375rem',fontWeight:600,color:'#2A2A2A',marginBottom:'0.625rem',letterSpacing:'-0.01em'}}>{project.name}</h3>
        <p style={{fontSize:'0.9375rem',color:'#45433F',lineHeight:1.65,marginBottom:'1.25rem',fontWeight:400,flex:1}}>{project.description}</p>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="cf-link-cta"
          style={{fontSize:'0.875rem',fontWeight:600,color:'#E8390E',display:'inline-flex',alignItems:'center',gap:'0.375rem',alignSelf:'flex-start',padding:'0.25rem 0'}}>
          Quero saber mais <span className="cf-seta" aria-hidden="true">→</span>
        </a>
      </div>
      <style>{`
        .cf-project-card { transition: transform 250ms var(--ease-out), box-shadow 250ms var(--ease-out); }
        .cf-project-img { transition: transform 600ms var(--ease-out); }
        @media (hover: hover) and (pointer: fine) {
          .cf-project-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 2px 4px rgba(42,42,42,0.04), 0 16px 40px -12px rgba(42,42,42,0.18);
          }
          .cf-project-card:hover .cf-project-img { transform: scale(1.03); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cf-project-card:hover, .cf-project-card:hover .cf-project-img { transform: none; }
        }
      `}</style>
    </article>
  )
}
