import type { Metadata } from 'next'
import { exigirConta } from '@/lib/cliente/sessao'
import { SolicitacaoForm } from '../../_ui/Formularios'
import Protocolos from '../../_ui/Protocolos'

export const metadata: Metadata = { title: 'Ouvidoria' }

export default async function OuvidoriaPage() {
  const conta = await exigirConta()
  return (
    <>
      <div className="ac-head">
        <div className="ac-kicker">Ouvidoria</div>
        <h1 className="ac-h1">Sua voz chega à diretoria</h1>
        <p className="ac-sub">
          Use a ouvidoria para reclamações, sugestões, elogios ou denúncias — especialmente quando o atendimento comum
          não resolveu. Toda manifestação recebe protocolo e é tratada diretamente pela diretoria.
        </p>
      </div>
      <div className="ac-grid ac-grid-2" style={{ alignItems: 'start' }}>
        <section>
          <h2 className="ac-h2">Registrar manifestação</h2>
          <div className="ac-card"><SolicitacaoForm tipo="ouvidoria" /></div>
        </section>
        <section>
          <h2 className="ac-h2">Meus protocolos</h2>
          <Protocolos contaId={conta.id} tipo="ouvidoria" />
        </section>
      </div>
    </>
  )
}
