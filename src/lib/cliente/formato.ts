// Helpers puros (usáveis no cliente e no servidor).

export function soDigitos(v: unknown): string {
  return String(v ?? '').replace(/\D/g, '')
}

export function cpfValido(cpf: string): boolean {
  const d = soDigitos(cpf)
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false
  const dv = (n: number) => {
    let soma = 0
    for (let i = 0; i < n; i++) soma += Number(d[i]) * (n + 1 - i)
    const r = (soma * 10) % 11
    return r === 10 ? 0 : r
  }
  return dv(9) === Number(d[9]) && dv(10) === Number(d[10])
}

export function cnpjValido(cnpj: string): boolean {
  const d = soDigitos(cnpj)
  if (d.length !== 14 || /^(\d)\1{13}$/.test(d)) return false
  const calc = (n: number) => {
    const pesos = n === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const soma = pesos.reduce((s, p, i) => s + Number(d[i]) * p, 0)
    const r = soma % 11
    return r < 2 ? 0 : 11 - r
  }
  return calc(12) === Number(d[12]) && calc(13) === Number(d[13])
}

export function documentoValido(v: string): boolean {
  const d = soDigitos(v)
  return d.length === 11 ? cpfValido(d) : cnpjValido(d)
}

export function formatarDocumento(v: string): string {
  const d = soDigitos(v)
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  return v
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
export function moeda(v: number | null | undefined): string {
  return brl.format(Number(v ?? 0))
}

// Datas do Sienge/Supabase vêm como "YYYY-MM-DD" (sem fuso) — formata sem
// passar por Date para não voltar um dia no fuso de Maceió.
export function data(v: string | null | undefined): string {
  if (!v) return '—'
  const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return `${m[3]}/${m[2]}/${m[1]}`
  return new Date(v).toLocaleDateString('pt-BR', { timeZone: 'America/Maceio' })
}

export function dataExtenso(v: string | null | undefined): string {
  const m = String(v ?? '').match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return '—'
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function hojeISO(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Maceio' })
}
