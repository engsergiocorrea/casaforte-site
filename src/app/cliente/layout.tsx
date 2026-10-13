import type { Metadata } from 'next'
import './cliente.css'

export const metadata: Metadata = {
  title: { default: 'Área do Cliente · Casa Forte', template: '%s · Área do Cliente Casa Forte' },
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
}

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return <div className="ac">{children}</div>
}
