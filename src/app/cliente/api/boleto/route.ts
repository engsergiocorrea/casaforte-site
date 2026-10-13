import { NextResponse, type NextRequest } from 'next/server'
import { contaAtual } from '@/lib/cliente/sessao'
import { parcelaEmAberto } from '@/lib/cliente/financeiro'
import { SiengeErro, segundaViaBoleto } from '@/lib/cliente/sienge'

// 2ª via do boleto de UMA parcela do cliente logado. Revalida no Sienge que o
// título é dele e que a parcela está em aberto antes de pedir a 2ª via.
export async function GET(req: NextRequest) {
  const conta = await contaAtual().catch(() => null)
  if (!conta) return NextResponse.json({ erro: 'Sessão expirada. Entre novamente.' }, { status: 401 })

  const bill = Number(req.nextUrl.searchParams.get('titulo'))
  const parcela = Number(req.nextUrl.searchParams.get('parcela'))
  if (!Number.isInteger(bill) || !Number.isInteger(parcela) || bill <= 0 || parcela <= 0) {
    return NextResponse.json({ erro: 'Parcela inválida.' }, { status: 400 })
  }

  try {
    if (!(await parcelaEmAberto(conta, bill, parcela))) {
      return NextResponse.json({ erro: 'Esta parcela não está em aberto.' }, { status: 404 })
    }
    const boleto = await segundaViaBoleto(bill, parcela)
    if (!boleto.url && !boleto.linha) {
      return NextResponse.json({ erro: 'Boleto ainda não disponível para esta parcela. Fale com o financeiro.' }, { status: 404 })
    }
    return NextResponse.json(boleto, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) {
    if (e instanceof SiengeErro && e.status === 422) {
      return NextResponse.json({ erro: 'Boleto ainda não disponível para esta parcela. Fale com o financeiro.' }, { status: 404 })
    }
    console.error('[area-cliente] boleto', e)
    return NextResponse.json({ erro: 'Não foi possível emitir o boleto agora. Tente novamente.' }, { status: 502 })
  }
}
