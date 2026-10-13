import 'server-only'
import { soDigitos } from './formato'

// Sienge = fonte da verdade financeira. Só LEITURA aqui.
// Schemas confirmados com respostas reais (13/10/2026):
//   /current-debit-balance?cpf=  → results[] {billReceivableId, documentId, paidInstallments[], dueInstallments[], payableInstallments[]}
//   /current-debit-balance/pdf?customerId= → results[] {urlReport} (link expira em 5 min)
//   /payment-slip-notification?billReceivableId&installmentId → results[] {urlReport, digitableNumber}
//   /sales-contracts?customerId= → results[] {id, enterpriseName, receivableBillId, number, situation, salesContractUnits[]...}

function base(): string {
  const sub = process.env.SIENGE_SUBDOMAIN
  if (!sub) throw new Error('SIENGE_SUBDOMAIN não configurado')
  return `https://api.sienge.com.br/${encodeURIComponent(sub)}/public/api/v1`
}

function auth(): string {
  return `Basic ${Buffer.from(`${process.env.SIENGE_USERNAME}:${process.env.SIENGE_PASSWORD}`).toString('base64')}`
}

export class SiengeErro extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function get<T>(path: string): Promise<T> {
  const r = await fetch(`${base()}${path}`, {
    headers: { Accept: 'application/json', Authorization: auth() },
    signal: AbortSignal.timeout(20_000),
    cache: 'no-store',
  })
  if (!r.ok) {
    const corpo = await r.text()
    let msg = corpo.slice(0, 300)
    try { msg = JSON.parse(corpo)?.clientMessage || msg } catch { /* corpo não-JSON */ }
    throw new SiengeErro(r.status, msg)
  }
  return (await r.json()) as T
}

function lista<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[]
  const r = raw as { results?: T[]; data?: T[] } | null
  return r?.results ?? r?.data ?? []
}

export type SiengeTelefone = { number?: string; ddd?: string | null; idd?: string; main?: boolean; whatsapp?: boolean }
export type SiengeCliente = { id: number; name: string; cpf?: string; cnpj?: string; email?: string; phones?: SiengeTelefone[] }

export async function clientePorDocumento(doc: string): Promise<SiengeCliente | null> {
  const d = soDigitos(doc)
  if (!d) return null
  const campo = d.length === 14 ? 'cnpj' : 'cpf'
  const rows = lista<SiengeCliente>(await get(`/customers?${campo}=${d}`))
  // Se a API ignorar o filtro, ainda assim só casa o documento exato.
  return rows.find((r) => soDigitos(r.cpf ?? r.cnpj) === d) ?? null
}

export async function clientePorId(id: number): Promise<SiengeCliente> {
  return get<SiengeCliente>(`/customers/${id}`)
}

// Celular preferencial: marcado WhatsApp > principal > primeiro. Junta DDD quando vem separado.
export function telefoneWhatsApp(c: SiengeCliente | null): string | null {
  const fones = c?.phones ?? []
  const f = fones.find((p) => p.whatsapp) ?? fones.find((p) => p.main) ?? fones[0]
  if (!f?.number) return null
  const idd = soDigitos(f.idd) || '55'
  return `${idd}${soDigitos(f.ddd)}${soDigitos(f.number)}`
}

export type Parcela = {
  installmentId: number
  installmentNumber?: string
  dueDate: string
  currentBalance: number
  originalValue?: number
  adjustedValue?: number
  generatedBoleto?: boolean
  conditionType?: string
}
export type Titulo = {
  billReceivableId: number
  documentId?: string
  paidInstallments?: Parcela[]
  dueInstallments?: Parcela[]
  payableInstallments?: Parcela[]
}

export async function saldoDevedor(doc: string): Promise<Titulo[]> {
  const d = soDigitos(doc)
  const campo = d.length === 14 ? 'cnpj' : 'cpf'
  try {
    return lista<Titulo>(await get(`/current-debit-balance?${campo}=${d}`))
  } catch (e) {
    // 404 = sem títulos; 422 = "Não foi encontrado cliente com o CPF/CNPJ" (só cliente de obra, sem contrato no Sienge)
    if (e instanceof SiengeErro && (e.status === 404 || e.status === 422)) return []
    throw e
  }
}

// numberTitle restringe o extrato a UM título (contrato) — evita mostrar contratos não liberados.
export async function saldoDevedorPdf(customerId: number, billId: number): Promise<string | null> {
  const r = lista<{ urlReport?: string }>(await get(`/current-debit-balance/pdf?customerId=${customerId}&numberTitle=${billId}`))
  return r[0]?.urlReport ?? null
}

export async function segundaViaBoleto(billId: number, installmentId: number): Promise<{ url: string | null; linha: string | null }> {
  const r = lista<{ urlReport?: string; digitableNumber?: string }>(
    await get(`/payment-slip-notification?billReceivableId=${billId}&installmentId=${installmentId}`),
  )
  return { url: r[0]?.urlReport ?? null, linha: r[0]?.digitableNumber ?? null }
}

export type Contrato = {
  id: number
  number?: string
  situation?: string
  enterpriseId?: number
  enterpriseName?: string
  receivableBillId?: number
  contractDate?: string
  expectedDeliveryDate?: string
  salesContractUnits?: { id: number; name: string; main?: boolean }[]
  salesContractCustomers?: { id: number; name?: string; main?: boolean; spouse?: boolean }[]
}

export async function contratosDoCliente(customerId: number): Promise<Contrato[]> {
  const rows = lista<Contrato>(await get(`/sales-contracts?customerId=${customerId}&limit=100`))
  return rows.filter((c) => c.situation !== 'Cancelado')
}
