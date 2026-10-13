import Link from 'next/link'
import { exigirConta } from '@/lib/cliente/sessao'
import { obrasDoCliente, rdosDasObras } from '@/lib/cliente/obras'
import { financeiroDoCliente } from '@/lib/cliente/financeiro'
import { data, dataExtenso, moeda } from '@/lib/cliente/formato'
import Icone, { type NomeIcone } from '../_ui/Icone'

export default async function PainelPage() {
  const conta = await exigirConta()
  const obras = await obrasDoCliente(conta)
  const [rdos, fin] = await Promise.all([rdosDasObras(obras.map((o) => o.id), 1), financeiroDoCliente(conta)])
  const ultimo = rdos[0]
  const obraUltimo = obras.find((o) => o.id === ultimo?.obra_id)
  const proxima = fin.titulos.flatMap((t) => t.aVencer).sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]
  const qtdVencidas = fin.titulos.reduce((s, t) => s + t.vencidas.length, 0)
  const primeiroNome = (conta.nome ?? '').split(' ')[0]
  const nome = primeiroNome ? primeiroNome[0] + primeiroNome.slice(1).toLowerCase() : ''

  const atalhos: { href: string; icone: NomeIcone; titulo: string; texto: string }[] = [
    { href: '/cliente/obras', icone: 'relatorio', titulo: 'Relatórios da obra', texto: 'RDOs e fotos do andamento' },
    { href: '/cliente/financeiro', icone: 'boleto', titulo: '2ª via de boleto', texto: 'Parcelas em aberto' },
    { href: '/cliente/financeiro', icone: 'saldo', titulo: 'Saldo devedor', texto: 'Extrato atualizado' },
    { href: '/cliente/contato', icone: 'contato', titulo: 'Fale conosco', texto: 'WhatsApp e mensagens' },
    { href: '/cliente/ouvidoria', icone: 'ouvidoria', titulo: 'Ouvidoria', texto: 'Reclamações e sugestões' },
  ]

  return (
    <>
      <div className="ac-head">
        <div className="ac-kicker">Área do Cliente</div>
        <h1 className="ac-h1">{nome ? `Olá, ${nome}` : 'Olá'}</h1>
        <p className="ac-sub">
          {conta.acesso.contratos.map((c) => `${c.empreendimento}${c.unidade ? ` · ${c.unidade}` : ''}`).join('  |  ')}
        </p>
      </div>

      {qtdVencidas > 0 && (
        <div className="ac-alerta ac-alerta-erro" style={{ marginBottom: '1rem' }}>
          Você tem {qtdVencidas} {qtdVencidas === 1 ? 'parcela vencida' : 'parcelas vencidas'} ({moeda(fin.totalVencido)}).{' '}
          <Link href="/cliente/financeiro" style={{ fontWeight: 600, textDecoration: 'underline' }}>Emitir boleto</Link>
        </div>
      )}

      <div className="ac-grid ac-grid-2">
        <Link href={ultimo ? `/cliente/rdos/${ultimo.id}` : '/cliente/obras'} className="ac-card ac-card-link">
          <div className="ac-card-titulo">Último relatório da obra</div>
          {ultimo ? (
            <div className="ac-grid" style={{ gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
              <div className="ac-capa" style={{ aspectRatio: '1' }}>
                {ultimo.capa ? <img src={ultimo.capa} alt="" /> : <div className="ac-capa-vazia" style={{ height: '100%' }}>Sem foto</div>}
              </div>
              <div>
                <strong style={{ fontSize: '1rem' }}>{obraUltimo?.nome}</strong>
                <p className="ac-mute" style={{ marginTop: 4 }}>{dataExtenso(ultimo.data_relatorio)} · {ultimo.qtd_fotos} fotos</p>
                <p className="ac-mute" style={{ marginTop: 8, color: 'var(--red)', fontWeight: 500 }}>Ver relatório →</p>
              </div>
            </div>
          ) : (
            <p className="ac-mute">
              {obras.length
                ? 'Os relatórios aparecerão aqui assim que forem publicados.'
                : `O acompanhamento da obra${conta.acesso.contratos[0] ? ` do ${conta.acesso.contratos[0].empreendimento}` : ''} estará disponível aqui em breve.`}
            </p>
          )}
        </Link>

        <Link href="/cliente/financeiro" className="ac-card ac-card-link">
          <div className="ac-card-titulo">Financeiro</div>
          {fin.erro ? (
            <p className="ac-mute">{fin.erro}</p>
          ) : fin.titulos.length ? (
            <div className="ac-grid ac-grid-2">
              <div>
                <div className="ac-mute">Saldo devedor atualizado</div>
                <div className="ac-num">{moeda(fin.saldoTotal)}</div>
              </div>
              <div>
                <div className="ac-mute">Próxima parcela</div>
                {proxima ? (
                  <>
                    <div className="ac-num" style={{ fontSize: '1.25rem' }}>{moeda(proxima.currentBalance)}</div>
                    <div className="ac-mute">vence em {data(proxima.dueDate)}</div>
                  </>
                ) : <div className="ac-mute">Nenhuma em aberto</div>}
              </div>
            </div>
          ) : (
            <p className="ac-mute">Nenhum contrato com parcelas em aberto.</p>
          )}
        </Link>
      </div>

      <section className="ac-sec">
        <h2 className="ac-h2">Atalhos</h2>
        <div className="ac-grid ac-grid-3">
          {atalhos.map((a) => (
            <Link key={a.titulo} href={a.href} className="ac-card ac-card-link ac-atalho">
              <span className="ac-ico"><Icone nome={a.icone} /></span>
              <span><strong>{a.titulo}</strong><span>{a.texto}</span></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
