import type { Metadata } from 'next'
import { exigirConta } from '@/lib/cliente/sessao'
import { SolicitacaoForm } from '../../_ui/Formularios'
import Protocolos from '../../_ui/Protocolos'
import Icone from '../../_ui/Icone'
import { WHATSAPP_EXIBICAO, whatsappLink } from '../../_ui/constantes'

export const metadata: Metadata = { title: 'Contato' }

export default async function ContatoPage() {
  const conta = await exigirConta()
  const email = process.env.CF_CONTATO_EMAIL

  return (
    <>
      <div className="ac-head">
        <div className="ac-kicker">Atendimento</div>
        <h1 className="ac-h1">Fale com a Casa Forte</h1>
        <p className="ac-sub">Escolha o canal que preferir. Mensagens enviadas por aqui geram um protocolo para você acompanhar.</p>
      </div>

      <div className="ac-grid ac-grid-2">
        <a href={whatsappLink('Olá! Sou cliente Casa Forte e gostaria de atendimento.')} target="_blank" rel="noopener noreferrer" className="ac-card ac-card-link ac-atalho">
          <span className="ac-ico"><Icone nome="contato" /></span>
          <span><strong>WhatsApp</strong><span>{WHATSAPP_EXIBICAO} · resposta em horário comercial</span></span>
        </a>
        {email ? (
          <a href={`mailto:${email}`} className="ac-card ac-card-link ac-atalho">
            <span className="ac-ico"><Icone nome="relatorio" /></span>
            <span><strong>E-mail</strong><span>{email}</span></span>
          </a>
        ) : (
          <a href="/cliente/ouvidoria" className="ac-card ac-card-link ac-atalho">
            <span className="ac-ico"><Icone nome="ouvidoria" /></span>
            <span><strong>Ouvidoria</strong><span>Não resolveu pelo atendimento? Fale com a ouvidoria</span></span>
          </a>
        )}
      </div>

      <div className="ac-grid ac-grid-2 ac-sec" style={{ alignItems: 'start' }}>
        <section>
          <h2 className="ac-h2">Enviar mensagem</h2>
          <div className="ac-card"><SolicitacaoForm tipo="contato" /></div>
        </section>
        <section>
          <h2 className="ac-h2">Minhas mensagens</h2>
          <Protocolos contaId={conta.id} tipo="contato" />
        </section>
      </div>
    </>
  )
}
