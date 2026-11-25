'use client'
import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'

// Faz o conteúdo surgir suavemente (opacidade + leve subida) quando entra na
// tela, uma única vez. Sem JS ou com "reduzir movimento", o conteúdo aparece.
export default function Reveal({ children, delay = 0, style, className = '' }: {
  children: ReactNode; delay?: number; style?: CSSProperties; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { el.classList.add('cf-visivel'); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('cf-visivel'); io.disconnect() }
    }, { rootMargin: '0px 0px -10% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`cf-reveal ${className}`} style={{ ['--cf-delay' as string]: `${delay}ms`, ...style }}>
      {children}
    </div>
  )
}
