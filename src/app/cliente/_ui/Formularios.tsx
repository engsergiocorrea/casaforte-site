'use client'

import { useActionState, useState } from 'react'
import { definirSenha, entrar, enviarSolicitacao, solicitarAcesso } from '../actions'
import { ASSUNTOS_CONTATO, CATEGORIAS_OUVIDORIA } from './constantes'

function mascaraDocumento(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 14)
  if (d.length <= 11) {
    return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return d.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

function CampoDocumento() {
  const [v, setV] = useState('')
  return (
    <label className="ac-label">
      CPF ou CNPJ
      <input
        className="ac-input" name="cpf" inputMode="numeric" autoComplete="username" required
        placeholder="000.000.000-00" value={v} onChange={(e) => setV(mascaraDocumento(e.target.value))}
      />
    </label>
  )
}

function Alerta({ estado }: { estado: { erro?: string; ok?: string } | undefined }) {
  if (estado?.erro) return <div className="ac-alerta ac-alerta-erro" role="alert">{estado.erro}</div>
  if (estado?.ok) return <div className="ac-alerta ac-alerta-ok" role="status">{estado.ok}</div>
  return null
}

export function LoginForm() {
  const [estado, acao, pendente] = useActionState(entrar, undefined)
  return (
    <form action={acao} className="ac-form">
      <CampoDocumento />
      <label className="ac-label">
        Senha
        <input className="ac-input" name="senha" type="password" autoComplete="current-password" required />
      </label>
      <Alerta estado={estado} />
      <button className="ac-btn ac-btn-full" disabled={pendente}>{pendente ? 'Entrando…' : 'Entrar'}</button>
    </form>
  )
}

export function PrimeiroAcessoForm() {
  const [estado, acao, pendente] = useActionState(solicitarAcesso, undefined)
  if (estado?.ok) return <Alerta estado={estado} />
  return (
    <form action={acao} className="ac-form">
      <CampoDocumento />
      <Alerta estado={estado} />
      <button className="ac-btn ac-btn-full" disabled={pendente}>{pendente ? 'Enviando…' : 'Receber link no WhatsApp'}</button>
    </form>
  )
}

export function DefinirSenhaForm({ token }: { token: string }) {
  const [estado, acao, pendente] = useActionState(definirSenha, undefined)
  return (
    <form action={acao} className="ac-form">
      <input type="hidden" name="t" value={token} />
      <label className="ac-label">
        Nova senha
        <input className="ac-input" name="senha" type="password" autoComplete="new-password" minLength={8} required />
      </label>
      <label className="ac-label">
        Confirme a senha
        <input className="ac-input" name="confirma" type="password" autoComplete="new-password" minLength={8} required />
      </label>
      <p className="ac-mute">Mínimo de 8 caracteres, com letras e números.</p>
      <Alerta estado={estado} />
      <button className="ac-btn ac-btn-full" disabled={pendente}>{pendente ? 'Salvando…' : 'Salvar senha e entrar'}</button>
    </form>
  )
}

export function SolicitacaoForm({ tipo }: { tipo: 'contato' | 'ouvidoria' }) {
  const [estado, acao, pendente] = useActionState(enviarSolicitacao, undefined)
  const [chave, setChave] = useState(0)
  if (estado?.ok && chave === 0) {
    return (
      <div className="ac-stack">
        <Alerta estado={estado} />
        <button type="button" className="ac-btn ac-btn-sec" onClick={() => setChave(1)}>Enviar outra mensagem</button>
      </div>
    )
  }
  return (
    <form action={(f) => { setChave(0); acao(f) }} className="ac-form" key={chave}>
      <input type="hidden" name="tipo" value={tipo} />
      {tipo === 'ouvidoria' ? (
        <label className="ac-label">
          Tipo de manifestação
          <select className="ac-select" name="categoria" required defaultValue="">
            <option value="" disabled>Selecione…</option>
            {CATEGORIAS_OUVIDORIA.map((c) => <option key={c.valor} value={c.valor}>{c.rotulo}</option>)}
          </select>
        </label>
      ) : (
        <label className="ac-label">
          Assunto
          <select className="ac-select" name="assunto" required defaultValue="">
            <option value="" disabled>Selecione…</option>
            {ASSUNTOS_CONTATO.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
      )}
      {tipo === 'ouvidoria' && (
        <label className="ac-label">
          Resumo (opcional)
          <input className="ac-input" name="assunto" maxLength={140} placeholder="Em poucas palavras" />
        </label>
      )}
      <label className="ac-label">
        Mensagem
        <textarea className="ac-textarea" name="mensagem" required minLength={10} maxLength={5000}
          placeholder={tipo === 'ouvidoria' ? 'Conte o que aconteceu, com datas e detalhes, se possível.' : 'Como podemos ajudar?'} />
      </label>
      {tipo === 'ouvidoria' && (
        <label className="ac-check">
          <input type="checkbox" name="sigiloso" />
          <span>Manter minha identidade em sigilo no encaminhamento interno. Você continua acompanhando o protocolo por aqui.</span>
        </label>
      )}
      <Alerta estado={estado} />
      <button className="ac-btn" disabled={pendente}>{pendente ? 'Enviando…' : tipo === 'ouvidoria' ? 'Registrar manifestação' : 'Enviar mensagem'}</button>
    </form>
  )
}
