import type { Metadata } from 'next'
import { DefinirSenhaForm } from '../../_ui/Formularios'

export const metadata: Metadata = { title: 'Definir senha' }

export default async function DefinirSenhaPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams
  if (!t) {
    return (
      <>
        <h1>Link inválido</h1>
        <p className="ac-acesso-sub">Abra o link recebido no WhatsApp ou peça um novo.</p>
        <a className="ac-btn ac-btn-full" href="/cliente/primeiro-acesso">Pedir novo link</a>
      </>
    )
  }
  return (
    <>
      <h1>Crie sua senha</h1>
      <p className="ac-acesso-sub">Você usará seu CPF/CNPJ e esta senha para entrar.</p>
      <DefinirSenhaForm token={t} />
    </>
  )
}
