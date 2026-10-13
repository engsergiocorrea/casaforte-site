'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const itens = [
  { href: '/cliente', rotulo: 'Início', exato: true },
  { href: '/cliente/obras', rotulo: 'Minha obra', extra: '/cliente/rdos' },
  { href: '/cliente/financeiro', rotulo: 'Financeiro' },
  { href: '/cliente/contato', rotulo: 'Contato' },
  { href: '/cliente/ouvidoria', rotulo: 'Ouvidoria' },
]

export default function Nav() {
  const p = usePathname()
  return (
    <nav className="ac-nav" aria-label="Área do cliente">
      {itens.map((i) => {
        const ativo = i.exato ? p === i.href : p.startsWith(i.href) || (!!i.extra && p.startsWith(i.extra))
        return (
          <Link key={i.href} href={i.href} aria-current={ativo ? 'page' : undefined}>
            {i.rotulo}
          </Link>
        )
      })}
    </nav>
  )
}
