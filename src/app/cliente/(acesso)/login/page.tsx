import type { Metadata } from 'next'
import { LoginForm } from '../../_ui/Formularios'

export const metadata: Metadata = { title: 'Entrar' }

export default function LoginPage() {
  return (
    <>
      <h1>Área do Cliente</h1>
      <p className="ac-acesso-sub">Acompanhe sua obra, emita boletos e fale com a Casa Forte.</p>
      <LoginForm />
      <div className="ac-acesso-links">
        <a href="/cliente/primeiro-acesso">Primeiro acesso</a>
        <a href="/cliente/primeiro-acesso">Esqueci minha senha</a>
      </div>
    </>
  )
}
