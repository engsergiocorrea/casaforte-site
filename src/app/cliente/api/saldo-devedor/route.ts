import { NextResponse, type NextRequest } from 'next/server'
import { contaAtual } from '@/lib/cliente/sessao'
import { tituloLiberado } from '@/lib/cliente/financeiro'
import { saldoDevedorPdf } from '@/lib/cliente/sienge'

// Extrato oficial de saldo devedor de UM contrato liberado (PDF gerado pelo Sienge;
// o link expira em 5 min, por isso é pedido na hora do clique e redirecionado).
export async function GET(req: NextRequest) {
  const conta = await contaAtual().catch(() => null)
  if (!conta) return NextResponse.redirect(new URL('/cliente/login', process.env.CLIENTE_SITE_URL ?? 'https://www.casaforteinc.com.br'))
  const bill = Number(req.nextUrl.searchParams.get('titulo'))
  if (!Number.isInteger(bill) || !tituloLiberado(conta, bill)) {
    return new NextResponse('Contrato não encontrado.', { status: 404 })
  }
  try {
    const url = await saldoDevedorPdf(conta.acesso.cliente.id, bill)
    if (!url) return new NextResponse('Extrato indisponível no momento. Fale com o financeiro da Casa Forte.', { status: 404 })
    return NextResponse.redirect(url, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) {
    console.error('[area-cliente] saldo-devedor pdf', e)
    return new NextResponse('Não foi possível gerar o extrato agora. Tente novamente em instantes.', { status: 502 })
  }
}
