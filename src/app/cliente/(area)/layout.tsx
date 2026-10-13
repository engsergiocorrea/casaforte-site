import Link from 'next/link'
import { exigirConta } from '@/lib/cliente/sessao'
import { sair } from '../actions'
import { LOGO_URL } from '../_ui/constantes'
import Nav from '../_ui/Nav'

export default async function AreaLayout({ children }: { children: React.ReactNode }) {
  const conta = await exigirConta()
  const nome = (conta.nome ?? '').toLowerCase().replace(/(^|\s)\S/g, (l) => l.toUpperCase())
  return (
    <>
      <header className="ac-top">
        <div className="ac-top-in">
          <Link href="/cliente" aria-label="Início da área do cliente">
            <img src={LOGO_URL} alt="Casa Forte" className="ac-logo" />
          </Link>
          <div className="ac-user">
            {conta.acesso.teste && <span className="ac-tag ac-tag-red" title="Acesso liberado apenas para testadores">Modo teste</span>}
            <span className="ac-user-nome">{nome || 'Cliente'}</span>
            <form action={sair}>
              <button className="ac-sair">Sair</button>
            </form>
          </div>
        </div>
        <Nav />
      </header>
      <main className="ac-main">{children}</main>
    </>
  )
}
