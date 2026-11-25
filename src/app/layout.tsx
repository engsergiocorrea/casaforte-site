import type { Metadata } from 'next'
import { Inter, Inter_Tight } from 'next/font/google'
import './globals.css'

// Fontes da marca servidas pelo próprio site (next/font): Inter Tight nos
// títulos e Inter no texto — linha moderna, alinhada ao padrão dos sistemas.
const display = Inter_Tight({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})
const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const descricao = 'Há 13 anos construindo com solidez, qualidade e compromisso em Alagoas. Empreendimentos na Rota Ecológica dos Milagres.'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.casaforteinc.com.br'),
  title: 'Casa Forte Construtora e Incorporadora',
  description: descricao,
  icons: { icon: '/icon.png', apple: '/apple-icon.png' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'Casa Forte',
    title: 'Casa Forte Construtora e Incorporadora',
    description: descricao,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Casa Forte — empreendimentos na Rota Ecológica dos Milagres' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.jpg'] },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
