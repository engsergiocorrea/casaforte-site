import type { Metadata } from 'next'
import { PrimeiroAcessoForm } from '../../_ui/Formularios'

export const metadata: Metadata = { title: 'Primeiro acesso' }

export default function PrimeiroAcessoPage() {
  return (
    <>
      <h1>Criar ou redefinir senha</h1>
      <p className="ac-acesso-sub">
        Informe o CPF ou CNPJ usado na compra. Enviaremos um link seguro para o WhatsApp cadastrado na Casa Forte.
      </p>
      <PrimeiroAcessoForm />
      <div className="ac-acesso-links">
        <a href="/cliente/login">← Voltar para o login</a>
      </div>
    </>
  )
}
