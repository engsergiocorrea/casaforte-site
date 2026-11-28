import 'server-only'
import { soDigitos } from './formato'
import { canalWhatsApp, enviarPelaCentral, type EnvioCentral } from './central-whatsapp'

// Evolution API — mesmo canal do resto do ecossistema (Obras, Compras, Cobrança).
// Texto: POST {URL}/message/sendText/{instance} body {number, text}, header apikey.

export function normalizarTelefone(tel: string | null | undefined): string | null {
  const d = soDigitos(tel)
  if (d.length < 10) return null
  return d.startsWith('55') && d.length >= 12 ? d : `55${d}`
}

type Opcoes = { modelo?: EnvioCentral['modelo']; origem?: string; nome?: string }

// Envia pela Evolution (como antes) ou, quando a diretoria trocar o canal para a
// Meta, pela central de WhatsApp — com o modelo aprovado para fora da janela de 24h.
export async function enviarWhatsApp(numero: string, texto: string, opcoes: Opcoes = {}): Promise<boolean> {
  if ((await canalWhatsApp()) === 'meta') {
    const r = await enviarPelaCentral({ para: numero, texto, modelo: opcoes.modelo, origem: opcoes.origem ?? 'site', nome: opcoes.nome })
    if (!r.ok) console.error('[site] central WhatsApp', r.erro)
    return r.ok
  }
  return enviarEvolution(numero, texto)
}

/** Código de acesso da Área do Cliente (modelo de autenticação da Meta). */
export async function enviarCodigoAcesso(numero: string, codigo: string, nome?: string | null): Promise<boolean> {
  const r = await enviarPelaCentral({ para: numero, codigo, origem: 'site:area-cliente', nome: nome ?? undefined })
  if (!r.ok) console.error('[area-cliente] código', r.erro)
  return r.ok
}

async function enviarEvolution(numero: string, texto: string): Promise<boolean> {
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
  const plano = texto.replace(/\*/g, '')
  const [primeira, ...resto] = plano.split('\n')
  await Promise.allSettled(numeros.map((n) => enviarWhatsApp(n, texto, {
    origem: 'site:area-cliente',
    modelo: { nome: 'aviso_interno', campos: { assunto: primeira.replace(/^\W+/, '').trim() || 'Área do Cliente', texto: resto.join(' ').trim().slice(0, 900) || plano.slice(0, 900), quem: 'Área do Cliente' } },
  })))
}
