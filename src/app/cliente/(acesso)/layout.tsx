import Link from 'next/link'
import { redirect } from 'next/navigation'
import { contaAtual } from '@/lib/cliente/sessao'
import { LOGO_URL, WHATSAPP_EXIBICAO, whatsappLink } from '../_ui/constantes'

export default async function AcessoLayout({ children }: { children: React.ReactNode }) {
  if (await contaAtual().catch(() => null)) redirect('/cliente')
  return (
    <main className="ac-acesso">
      <div className="ac-acesso-card">
        <Link href="/" aria-label="Voltar ao site da Casa Forte">
          <img src={LOGO_URL} alt="Casa Forte" className="ac-acesso-logo" />
        </Link>
        {children}
        <p className="ac-acesso-rodape">
          Dúvidas? <a href={whatsappLink('Olá! Preciso de ajuda com a Área do Cliente.')} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)' }}>WhatsApp {WHATSAPP_EXIBICAO}</a>
        </p>
      </div>
    </main>
  )
}
