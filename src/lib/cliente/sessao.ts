import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { assinar, verificar } from './crypto'
import { db } from './supabase'
import { acessoPorDocumento, type Acesso } from './acesso'

const COOKIE = 'cf_cliente'
const DURACAO_S = 60 * 60 * 24 * 7

type Payload = { c: string; v: number; exp: number }

export type Conta = {
  id: string
  cpf: string
  nome: string | null
  sienge_customer_id: number | null
  telefone: string | null
  acesso: Acesso
}

export async function criarSessao(contaId: string, versao: number) {
  const exp = Math.floor(Date.now() / 1000) + DURACAO_S
  ;(await cookies()).set(COOKIE, assinar({ c: contaId, v: versao, exp } satisfies Payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DURACAO_S,
  })
}

export async function encerrarSessao() {
  ;(await cookies()).delete(COOKIE)
}

// DAL: confere assinatura, validade, conta ativa e versão (troca de senha derruba sessões).
export const contaAtual = cache(async (): Promise<Conta | null> => {
  const p = verificar<Payload>((await cookies()).get(COOKIE)?.value)
  if (!p || p.exp < Date.now() / 1000) return null
  const { data } = await db()
    .from('cliente_contas')
    .select('id, cpf, nome, sienge_customer_id, telefone, ativo, sessao_versao, senha_hash')
    .eq('id', p.c)
    .maybeSingle()
  if (!data || !data.ativo || !data.senha_hash || data.sessao_versao !== p.v) return null
  // Acesso revalidado no Sienge (cache de 5 min): contrato cancelado, empreendimento
  // desligado ou testador removido derrubam a sessão. Erro do Sienge sobe (página de erro).
  const acesso = await acessoPorDocumento(data.cpf)
  if (!acesso) return null
  return { id: data.id, cpf: data.cpf, nome: data.nome, sienge_customer_id: acesso.cliente.id, telefone: data.telefone, acesso }
})

export async function exigirConta(): Promise<Conta> {
  const c = await contaAtual()
  if (!c) redirect('/cliente/login')
  return c
}
