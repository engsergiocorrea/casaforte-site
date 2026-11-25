'use client'
import { useEffect, useRef, useState } from 'react'
import { projects } from '@/data/projects'

// Formulário de interesse: grava o contato e avisa o comercial no WhatsApp
// (POST /api/interesse). Os cards dos empreendimentos disparam o evento
// "cf-interesse" para pré-selecionar o empreendimento e rolar até aqui.

const WHATSAPP = 'https://wa.me/5582991017208'

function mascaraFone(v: string) {
  const d = v.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '').slice(0, 11)
  if (d.length <= 2) return d ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export default function FormInteresse() {
  const [f, setF] = useState({ nome: '', telefone: '', email: '', empreendimento: '', mensagem: '', site: '' })
  const [estado, setEstado] = useState<'livre' | 'enviando' | 'ok'>('livre')
  const [erro, setErro] = useState('')
  const inicio = useRef(Date.now())
  const nomeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const escolher = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail
      setF((x) => ({ ...x, empreendimento: slug }))
      setEstado('livre')
      setTimeout(() => nomeRef.current?.focus({ preventScroll: true }), 450)
    }
    window.addEventListener('cf-interesse', escolher)
    const q = new URLSearchParams(window.location.search).get('interesse')
    if (q && projects.some((p) => p.slug === q)) setF((x) => ({ ...x, empreendimento: q }))
    return () => window.removeEventListener('cf-interesse', escolher)
  }, [])

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    if (f.nome.trim().length < 2) return setErro('Informe seu nome.')
    if (f.telefone.replace(/\D/g, '').length < 10) return setErro('Informe seu WhatsApp com DDD.')
    setEstado('enviando')
    const q = new URLSearchParams(window.location.search)
    try {
      const r = await fetch('/api/interesse', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, t: Date.now() - inicio.current, pagina: window.location.pathname,
          utm_source: q.get('utm_source'), utm_medium: q.get('utm_medium'), utm_campaign: q.get('utm_campaign'), utm_content: q.get('utm_content') }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(j.erro ?? 'Não foi possível enviar agora.')
      setEstado('ok')
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível enviar agora.')
      setEstado('livre')
    }
  }

  if (estado === 'ok') {
    const p = projects.find((x) => x.slug === f.empreendimento)
    return (
      <div className="cf-form-ok" role="status">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></svg>
        <h3>Recebemos seu contato, {f.nome.trim().split(' ')[0]}!</h3>
        <p>Nossa equipe vai falar com você pelo WhatsApp {mascaraFone(f.telefone)}{p ? ` sobre o ${p.name}` : ''} em breve.</p>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="cf-link-cta">Prefere adiantar? Chame no WhatsApp <span className="cf-seta" aria-hidden="true">→</span></a>
      </div>
    )
  }

  return (
    <form className="cf-form" onSubmit={enviar} noValidate>
      <div className="cf-campos">
        <label>Nome<input ref={nomeRef} required autoComplete="name" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} placeholder="Seu nome" /></label>
        <label>WhatsApp<input required inputMode="tel" autoComplete="tel" value={f.telefone} onChange={(e) => setF({ ...f, telefone: mascaraFone(e.target.value) })} placeholder="(82) 99999-9999" /></label>
        <label><span>E-mail <span className="cf-opc">(opcional)</span></span><input type="email" inputMode="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="voce@email.com" /></label>
        <label>Empreendimento
          <select value={f.empreendimento} onChange={(e) => setF({ ...f, empreendimento: e.target.value })}>
            <option value="">Quero conhecer as opções</option>
            {projects.map((p) => <option key={p.slug} value={p.slug}>{p.name} — {p.phase}</option>)}
          </select>
        </label>
        <label className="cf-largo"><span>Mensagem <span className="cf-opc">(opcional)</span></span><textarea rows={3} value={f.mensagem} onChange={(e) => setF({ ...f, mensagem: e.target.value })} placeholder="Ex.: procuro casa de 2 quartos para investimento" /></label>
        {/* isca para robôs (escondida de pessoas e leitores de tela) */}
        <input className="cf-isca" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.site} onChange={(e) => setF({ ...f, site: e.target.value })} />
      </div>
      {erro && <p className="cf-erro" role="alert">{erro}</p>}
      <button type="submit" className="cf-btn cf-btn-primary cf-enviar" disabled={estado === 'enviando'}>{estado === 'enviando' ? 'Enviando…' : 'Quero receber contato'}</button>
      <p className="cf-lgpd">Seus dados são usados só para a Casa Forte falar com você sobre nossos empreendimentos. Não compartilhamos com terceiros.</p>
      <style>{`
        .cf-campos { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .cf-largo { grid-column: 1 / -1; }
        .cf-form label { display: flex; flex-direction: column; gap: 6px; font-size: 0.8125rem; font-weight: 600; color: #45433F; }
        .cf-opc { font-weight: 400; color: #8A8680; }
        .cf-form input, .cf-form select, .cf-form textarea {
          font: inherit; font-size: 16px; font-weight: 400; color: #2A2A2A; background: #FFFFFF;
          border: 1px solid #DDD9D3; border-radius: 10px; padding: 12px 14px; width: 100%;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }
        .cf-form textarea { resize: vertical; min-height: 84px; }
        .cf-form input:focus, .cf-form select:focus, .cf-form textarea:focus { outline: none; border-color: #E8390E; box-shadow: 0 0 0 3px rgba(232,57,14,0.15); }
        .cf-isca { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
        .cf-erro { color: #B8290A; font-size: 0.875rem; margin-top: 12px; }
        .cf-enviar { margin-top: 16px; width: 100%; padding: 0.9375rem 1.5rem; background: #E8390E; color: #fff; border: 0; border-radius: 10px; font-size: 0.9375rem; font-weight: 600; }
        .cf-enviar:disabled { opacity: 0.6; }
        .cf-lgpd { margin-top: 10px; font-size: 0.75rem; color: #8A8680; line-height: 1.5; }
        .cf-form-ok { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding: 8px 0; }
        .cf-form-ok h3 { font-family: var(--display); font-size: 1.375rem; letter-spacing: -0.02em; color: #2A2A2A; }
        .cf-form-ok p { color: #45433F; line-height: 1.6; }
        .cf-form-ok .cf-link-cta { color: #E8390E; font-weight: 600; font-size: 0.9375rem; display: inline-flex; gap: 6px; }
        @media (max-width: 560px) { .cf-campos { grid-template-columns: 1fr; } }
      `}</style>
    </form>
  )
}
