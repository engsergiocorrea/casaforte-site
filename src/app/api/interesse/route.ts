import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { db } from '@/lib/cliente/supabase'
import { enviarWhatsApp, normalizarTelefone } from '@/lib/cliente/whatsapp'
import { projects } from '@/data/projects'

// Formulário de interesse do site → grava em site_leads (idjzh) e avisa o
// comercial no WhatsApp (CF_LEADS_WHATSAPP; sem ela, CF_ATENDIMENTO_WHATSAPP).
// Anti-spam: campo isca ("site"), tempo mínimo de preenchimento, limite por IP
// e não repete o aviso do mesmo telefone em 30 minutos.
export const dynamic = 'force-dynamic'

const txt = (v: unknown, max: number) => { const s = String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max); return s || null }
const ok = () => NextResponse.json({ ok: true })

export async function POST(req: Request) {
  let b: Record<string, unknown>
  try { b = await req.json() } catch { return NextResponse.json({ erro: 'Dados inválidos.' }, { status: 400 }) }

  // Robôs: preenchem a isca ou enviam rápido demais → responde ok e descarta.
  if (txt(b.site, 200) || (Number(b.t) > 0 && Number(b.t) < 2500)) return ok()

  const nome = txt(b.nome, 120)
  const telefone = normalizarTelefone(String(b.telefone ?? ''))
  if (!nome || nome.length < 2) return NextResponse.json({ erro: 'Informe seu nome.' }, { status: 400 })
  if (!telefone || telefone.length < 12 || telefone.length > 13) return NextResponse.json({ erro: 'Informe um WhatsApp com DDD.' }, { status: 400 })
  const email = txt(b.email, 160)
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ erro: 'E-mail inválido.' }, { status: 400 })
  const slug = txt(b.empreendimento, 60)
  const projeto = projects.find((p) => p.slug === slug)

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim()
  const ipHash = ip ? crypto.createHash('sha256').update(`cf-site:${ip}`).digest('hex').slice(0, 32) : null
  const sb = db()
  if (ipHash) {
    const umaHora = new Date(Date.now() - 3600_000).toISOString()
    const { count } = await sb.from('site_leads').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', umaHora)
    if ((count ?? 0) >= 6) return NextResponse.json({ erro: 'Muitos envios. Tente mais tarde ou chame no WhatsApp.' }, { status: 429 })
  }

  const meiaHora = new Date(Date.now() - 1800_000).toISOString()
  const { data: recente } = await sb.from('site_leads').select('id').eq('telefone', telefone).gte('created_at', meiaHora).limit(1)

  const { data: lead, error } = await sb.from('site_leads').insert({
    nome, telefone, email, empreendimento: projeto?.slug ?? null, mensagem: txt(b.mensagem, 1000),
    pagina: txt(b.pagina, 200), utm_source: txt(b.utm_source, 100), utm_medium: txt(b.utm_medium, 100),
    utm_campaign: txt(b.utm_campaign, 150), utm_content: txt(b.utm_content, 150), ip_hash: ipHash,
  }).select('id').single()
  if (error || !lead) { console.error('[interesse] gravar', error); return NextResponse.json({ erro: 'Não foi possível enviar agora. Chame no WhatsApp.' }, { status: 500 }) }

  if (!recente?.length) {
    const numeros = (process.env.CF_LEADS_WHATSAPP || process.env.CF_ATENDIMENTO_WHATSAPP || '').split(',').map((n) => normalizarTelefone(n)).filter((n): n is string => !!n)
    const fone = telefone.replace(/^55(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3')
    const origem = [txt(b.utm_source, 100), txt(b.utm_campaign, 150)].filter(Boolean).join(' / ')
    const texto = `🏡 *Novo interessado pelo site*\n\n*${nome}*\nWhatsApp: ${fone}\nhttps://wa.me/${telefone}${email ? `\nE-mail: ${email}` : ''}\nInteresse: ${projeto?.name ?? 'geral'}${txt(b.mensagem, 1000) ? `\nMensagem: ${txt(b.mensagem, 1000)}` : ''}${origem ? `\nOrigem: ${origem}` : ''}\n\nResponda o quanto antes 🙂`
    const r = await Promise.allSettled(numeros.map((n) => enviarWhatsApp(n, texto)))
    if (r.some((x) => x.status === 'fulfilled' && x.value)) await sb.from('site_leads').update({ avisado_em: new Date().toISOString() }).eq('id', lead.id)
  }
  return ok()
}
