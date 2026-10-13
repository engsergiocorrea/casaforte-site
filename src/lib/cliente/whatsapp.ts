import 'server-only'
import { soDigitos } from './formato'

// Evolution API — mesmo canal do resto do ecossistema (Obras, Compras, Cobrança).
// Texto: POST {URL}/message/sendText/{instance} body {number, text}, header apikey.

export function normalizarTelefone(tel: string | null | undefined): string | null {
  const d = soDigitos(tel)
  if (d.length < 10) return null
  return d.startsWith('55') && d.length >= 12 ? d : `55${d}`
}

export async function enviarWhatsApp(numero: string, texto: string): Promise<boolean> {
  const url = process.env.EVOLUTION_API_URL
  const key = process.env.EVOLUTION_API_KEY
  const instance = process.env.EVOLUTION_INSTANCE || 'casaforte'
  if (!url || !key) {
    console.error('[area-cliente] Evolution não configurada (EVOLUTION_API_URL/EVOLUTION_API_KEY)')
    return false
  }
  try {
    const r = await fetch(`${url.replace(/\/$/, '')}/message/sendText/${encodeURIComponent(instance)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: key },
      body: JSON.stringify({ number: numero, text: texto }),
      signal: AbortSignal.timeout(15_000),
    })
    if (!r.ok) console.error('[area-cliente] Evolution', r.status, (await r.text()).slice(0, 300))
    return r.ok
  } catch (e) {
    console.error('[area-cliente] Evolution falhou', e)
    return false
  }
}

// Avisa a equipe (contato/ouvidoria). CF_ATENDIMENTO_WHATSAPP = números separados por vírgula.
export async function avisarEquipe(texto: string): Promise<void> {
  const numeros = (process.env.CF_ATENDIMENTO_WHATSAPP || '')
    .split(',')
    .map((n) => normalizarTelefone(n))
    .filter((n): n is string => !!n)
  await Promise.allSettled(numeros.map((n) => enviarWhatsApp(n, texto)))
}
