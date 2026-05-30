import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Casa Forte Construtora e Incorporadora',
  description: 'Há 13 anos construindo com solidez, qualidade e compromisso em Alagoas.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
