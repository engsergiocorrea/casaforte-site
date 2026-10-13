import { db } from '@/lib/cliente/supabase'
import { CATEGORIAS_OUVIDORIA, STATUS_SOLICITACAO } from './constantes'

export default async function Protocolos({ contaId, tipo }: { contaId: string; tipo: 'contato' | 'ouvidoria' }) {
  const { data } = await db()
    .from('cliente_solicitacoes')
    .select('id, protocolo, categoria, assunto, mensagem, status, resposta, respondido_em, created_at')
    .eq('conta_id', contaId)
    .eq('tipo', tipo)
    .order('created_at', { ascending: false })
    .limit(30)

  if (!data?.length) return <div className="ac-card ac-vazio">Nenhuma mensagem enviada ainda.</div>

  return (
    <div className="ac-stack">
      {data.map((s) => (
        <div key={s.id} className="ac-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', marginBottom: 6 }}>
            <strong style={{ fontSize: '0.875rem' }}>{s.protocolo}</strong>
            <span className={`ac-tag ${s.status === 'respondida' || s.status === 'encerrada' ? 'ac-tag-ok' : ''}`}>
              {STATUS_SOLICITACAO[s.status] ?? s.status}
            </span>
          </div>
          <p className="ac-mute">
            {new Date(s.created_at).toLocaleDateString('pt-BR', { timeZone: 'America/Maceio' })}
            {' · '}
            {CATEGORIAS_OUVIDORIA.find((c) => c.valor === s.categoria)?.rotulo ?? s.assunto ?? s.categoria}
          </p>
          <p className="ac-body" style={{ marginTop: 8, fontSize: '0.875rem' }}>{s.mensagem}</p>
          {s.resposta && (
            <div className="ac-alerta ac-alerta-info" style={{ marginTop: 10 }}>
              <strong style={{ display: 'block', marginBottom: 4 }}>Resposta da Casa Forte</strong>
              <span style={{ whiteSpace: 'pre-line' }}>{s.resposta}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
