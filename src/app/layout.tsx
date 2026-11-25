import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

// Fontes da marca servidas pelo próprio site (next/font). O @import do Google
// no CSS era descartado no build e o site caía em Times/Helvetica.
const serif = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})
const sans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
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
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
