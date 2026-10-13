import 'server-only'
import { cache } from 'react'
import { hojeISO } from './formato'
import { saldoDevedor, type Parcela } from './sienge'
import type { Conta } from './sessao'

export type ParcelaVista = Parcela & { situacao: 'vencida' | 'a_vencer' | 'paga' }

export type TituloVista = {
  billId: number
  empreendimento: string
  unidade: string | null
  contrato: string | null
  entregaPrevista: string | null
  saldo: number
  vencidas: ParcelaVista[]
  aVencer: ParcelaVista[]
  pagas: ParcelaVista[]
}

export type Financeiro = { titulos: TituloVista[]; saldoTotal: number; totalVencido: number; erro?: string }

// Títulos (contas a receber) dos contratos LIBERADOS da conta — nada fora deles.
function titulosLiberados(conta: Conta): Set<number> {
  return new Set(conta.acesso.contratos.map((c) => c.billId).filter((b): b is number => !!b))
}

export const financeiroDoCliente = cache(async (conta: Conta): Promise<Financeiro> => {
  try {
    const liberados = titulosLiberados(conta)
    const porBill = new Map(conta.acesso.contratos.filter((c) => c.billId).map((c) => [c.billId!, c]))
    const titulos = (await saldoDevedor(conta.cpf)).filter((t) => liberados.has(t.billReceivableId))

    const hoje = hojeISO()
    const vistas: TituloVista[] = titulos.map((t) => {
      const ct = porBill.get(t.billReceivableId)!
      const abertas = [...(t.dueInstallments ?? []), ...(t.payableInstallments ?? [])]
        .filter((p) => Number(p.currentBalance) > 0)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      return {
        billId: t.billReceivableId,
        empreendimento: ct.empreendimento,
        unidade: ct.unidade,
        contrato: ct.numero,
        entregaPrevista: ct.entregaPrevista,
        saldo: abertas.reduce((s, p) => s + Number(p.currentBalance), 0),
        vencidas: abertas.filter((p) => p.dueDate.slice(0, 10) < hoje).map((p) => ({ ...p, situacao: 'vencida' as const })),
        aVencer: abertas.filter((p) => p.dueDate.slice(0, 10) >= hoje).map((p) => ({ ...p, situacao: 'a_vencer' as const })),
        pagas: (t.paidInstallments ?? [])
          .sort((a, b) => b.dueDate.localeCompare(a.dueDate))
          .map((p) => ({ ...p, situacao: 'paga' as const })),
      }
    })
    return {
      titulos: vistas,
      saldoTotal: vistas.reduce((s, t) => s + t.saldo, 0),
      totalVencido: vistas.reduce((s, t) => s + t.vencidas.reduce((x, p) => x + Number(p.currentBalance), 0), 0),
    }
  } catch (e) {
    console.error('[area-cliente] financeiro', e)
    return { titulos: [], saldoTotal: 0, totalVencido: 0, erro: 'Não conseguimos consultar seus dados financeiros agora. Tente novamente em alguns minutos.' }
  }
})

export function tituloLiberado(conta: Conta, billId: number): boolean {
  return titulosLiberados(conta).has(billId)
}

// A parcela é de um título liberado da conta e está em aberto? (revalida no Sienge antes do boleto)
export async function parcelaEmAberto(conta: Conta, billId: number, installmentId: number): Promise<boolean> {
  if (!tituloLiberado(conta, billId)) return false
  const t = (await saldoDevedor(conta.cpf)).find((x) => x.billReceivableId === billId)
  if (!t) return false
  return [...(t.dueInstallments ?? []), ...(t.payableInstallments ?? [])].some(
    (p) => p.installmentId === installmentId && Number(p.currentBalance) > 0,
  )
}
