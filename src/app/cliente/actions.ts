'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { refresh } from 'next/cache'
import { db } from '@/lib/cliente/supabase'
import { conferirSenha, hashSenha, novoToken, sha256 } from '@/lib/cliente/crypto'
import { documentoValido, formatarDocumento, soDigitos } from '@/lib/cliente/formato'
import { acessoPorDocumento } from '@/lib/cliente/acesso'
import { avisarEquipe, enviarWhatsApp, normalizarTelefone } from '@/lib/cliente/whatsapp'
import { criarSessao, encerrarSessao, exigirConta } from '@/lib/cliente/sessao'

export type Estado = { erro?: string; ok?: string } | undefined

const MAX_FALHAS = 5
const BLOQUEIO_MIN = 15
const TOKEN_VALIDADE_MIN = 30
const REENVIO_MIN_S = 90

// ---------------------------------------------------------------- login

export async function entrar(_: Estado, form: FormData): Promise<Estado> {
  const doc = soDigitos(form.get('cpf'))
  const senha = String(form.get('senha') ?? '')
  const generico = { erro: 'CPF ou senha incorretos.' }
  if (!documentoValido(doc) || !senha) return generico

  const { data: conta } = await db()
    .from('cliente_contas')
    .select('id, senha_hash, ativo, falhas_login, bloqueado_ate, sessao_versao')
    .eq('cpf', doc)
    .maybeSingle()

  if (!conta || !conta.ativo) return generico
  if (!conta.senha_hash) return { erro: 'Você ainda não criou sua senha. Use "Primeiro acesso".' }
  if (conta.bloqueado_ate && new Date(conta.bloqueado_ate) > new Date()) {
    return { erro: `Muitas tentativas. Tente novamente em ${BLOQUEIO_MIN} minutos ou redefina sua senha.` }
  }

  if (!(await conferirSenha(senha, conta.senha_hash))) {
    const falhas = (conta.falhas_login ?? 0) + 1
    await db()
      .from('cliente_contas')
      .update({
        falhas_login: falhas >= MAX_FALHAS ? 0 : falhas,
        bloqueado_ate: falhas >= MAX_FALHAS ? new Date(Date.now() + BLOQUEIO_MIN * 60_000).toISOString() : null,
      })
      .eq('id', conta.id)
    return generico
  }

  const acesso = await acessoPorDocumento(doc, { semCache: true }).catch((e) => {
    console.error('[area-cliente] Sienge indisponível no login', e)
    return undefined
  })
  if (acesso === undefined) return { erro: 'Não conseguimos validar seu cadastro agora. Tente novamente em alguns minutos.' }
  if (!acesso) return { erro: 'Seu acesso à Área do Cliente ainda não está disponível. Fale com a Casa Forte.' }

  await db()
    .from('cliente_contas')
    .update({ falhas_login: 0, bloqueado_ate: null, ultimo_login_em: new Date().toISOString() })
    .eq('id', conta.id)
  await criarSessao(conta.id, conta.sessao_versao)
  redirect('/cliente')
}

export async function sair() {
  await encerrarSessao()
  redirect('/cliente/login')
}

// ------------------------------------------------- primeiro acesso / esqueci a senha
// O cliente informa o CPF; se ele for titular de contrato em empreendimento habilitado
// no Sienge (ver acesso.ts), um link de uso único vai para o WhatsApp do Sienge (ou o
// número do testador). A resposta é sempre a mesma, para não revelar quem é cliente.

export async function solicitarAcesso(_: Estado, form: FormData): Promise<Estado> {
  const doc = soDigitos(form.get('cpf'))
  if (!documentoValido(doc)) return { erro: 'Informe um CPF ou CNPJ válido.' }
  const resposta = {
    ok: 'Se o documento estiver cadastrado, você receberá em instantes um link no WhatsApp registrado na Casa Forte. O link vale por 30 minutos.',
  }

  try {
    const { data: existente } = await db()
      .from('cliente_contas')
      .select('id, ativo, telefone, nome, sienge_customer_id, token_enviado_em')
      .eq('cpf', doc)
      .maybeSingle()

    if (existente && !existente.ativo) return resposta
    if (existente?.token_enviado_em && Date.now() - new Date(existente.token_enviado_em).getTime() < REENVIO_MIN_S * 1000) {
      return resposta
    }

    // Só quem tem contrato em empreendimento habilitado no Sienge recebe link.
    const acesso = await acessoPorDocumento(doc, { semCache: true })
    if (!acesso) return resposta

    const telefone = normalizarTelefone(acesso.telefone)
    if (!telefone) {
      console.warn('[area-cliente] titular sem WhatsApp no Sienge para primeiro acesso')
      return resposta
    }

    const nome = acesso.cliente.name ?? existente?.nome ?? null
    const { token, hash } = novoToken()
    const campos = {
      nome,
      telefone,
      sienge_customer_id: acesso.cliente.id,
      token_hash: hash,
      token_expira_em: new Date(Date.now() + TOKEN_VALIDADE_MIN * 60_000).toISOString(),
      token_enviado_em: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const { error } = existente
      ? await db().from('cliente_contas').update(campos).eq('id', existente.id)
      : await db().from('cliente_contas').insert({ cpf: doc, ...campos })
    if (error) throw error

    const link = `${await origem()}/cliente/definir-senha?t=${token}`
    const primeiroNome = (nome ?? '').split(' ')[0]
    await enviarWhatsApp(
      telefone,
      `🏠 *Casa Forte — Área do Cliente*\n\n${primeiroNome ? `${primeiroNome}, ` : ''}recebemos um pedido para criar ou redefinir sua senha.\n\nToque no link para continuar (válido por ${TOKEN_VALIDADE_MIN} minutos):\n${link}\n\nSe não foi você, ignore esta mensagem.\n\n#aquiécasaforte`,
    )
  } catch (e) {
    console.error('[area-cliente] solicitarAcesso', e)
  }
  return resposta
}

export async function definirSenha(_: Estado, form: FormData): Promise<Estado> {
  const token = String(form.get('t') ?? '')
  const senha = String(form.get('senha') ?? '')
  const confirma = String(form.get('confirma') ?? '')
  if (senha.length < 8 || !/[a-zA-Z]/.test(senha) || !/\d/.test(senha)) {
    return { erro: 'A senha precisa ter pelo menos 8 caracteres, com letras e números.' }
  }
  if (senha !== confirma) return { erro: 'As senhas não conferem.' }

  const { data: conta } = await db()
    .from('cliente_contas')
    .select('id, cpf, ativo, token_expira_em, sessao_versao')
    .eq('token_hash', sha256(token))
    .maybeSingle()
  if (!conta || !conta.ativo || !conta.token_expira_em || new Date(conta.token_expira_em) < new Date()) {
    return { erro: 'Este link expirou ou já foi usado. Peça um novo em "Primeiro acesso".' }
  }

  const acesso = await acessoPorDocumento(conta.cpf, { semCache: true }).catch(() => null)
  if (!acesso) return { erro: 'Seu acesso à Área do Cliente não está disponível. Fale com a Casa Forte.' }

  const versao = (conta.sessao_versao ?? 1) + 1
  const { error } = await db()
    .from('cliente_contas')
    .update({
      senha_hash: await hashSenha(senha),
      senha_definida_em: new Date().toISOString(),
      sessao_versao: versao,
      token_hash: null,
      token_expira_em: null,
      falhas_login: 0,
      bloqueado_ate: null,
      ultimo_login_em: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', conta.id)
  if (error) return { erro: 'Não foi possível salvar a senha. Tente novamente.' }

  await criarSessao(conta.id, versao)
  redirect('/cliente')
}

// ---------------------------------------------------------- atendimento

export async function enviarSolicitacao(_: Estado, form: FormData): Promise<Estado> {
  const conta = await exigirConta()
  const tipo = form.get('tipo') === 'ouvidoria' ? 'ouvidoria' : 'contato'
  const categoria = String(form.get('categoria') ?? '').slice(0, 40) || null
  const assunto = String(form.get('assunto') ?? '').trim().slice(0, 140) || null
  const mensagem = String(form.get('mensagem') ?? '').trim().slice(0, 5000)
  const sigiloso = tipo === 'ouvidoria' && form.get('sigiloso') === 'on'
  if (mensagem.length < 10) return { erro: 'Escreva sua mensagem com um pouco mais de detalhe.' }

  // Limite simples contra abuso: 10 solicitações por dia por conta.
  const desde = new Date(Date.now() - 24 * 3600_000).toISOString()
  const { count } = await db()
    .from('cliente_solicitacoes')
    .select('id', { count: 'exact', head: true })
    .eq('conta_id', conta.id)
    .gte('created_at', desde)
  if ((count ?? 0) >= 10) return { erro: 'Você atingiu o limite de mensagens por hoje. Fale conosco pelo WhatsApp.' }

  const protocolo = `${tipo === 'ouvidoria' ? 'OUV' : 'ATD'}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
  const { error } = await db().from('cliente_solicitacoes').insert({
    protocolo, conta_id: conta.id, tipo, categoria, assunto, mensagem, sigiloso,
  })
  if (error) return { erro: 'Não foi possível registrar agora. Tente novamente em instantes.' }

  const imoveis = conta.acesso.contratos.map((c) => `${c.empreendimento}${c.unidade ? ` ${c.unidade}` : ''}`).join(', ')
  const quem = sigiloso ? `Cliente (sigiloso) — ${imoveis}` : `${conta.nome ?? 'Cliente'} — ${formatarDocumento(conta.cpf)} — ${imoveis}`
  await avisarEquipe(
    `📨 *Área do Cliente — ${tipo === 'ouvidoria' ? 'OUVIDORIA' : 'Contato'}*\nProtocolo: ${protocolo}\n${categoria ? `Categoria: ${categoria}\n` : ''}${assunto ? `Assunto: ${assunto}\n` : ''}De: ${quem}\n\n${mensagem.slice(0, 1200)}`,
  )
  refresh()
  return { ok: `Recebemos sua mensagem. Protocolo ${protocolo}. Acompanhe o andamento aqui na área do cliente.` }
}

async function origem(): Promise<string> {
  if (process.env.CLIENTE_SITE_URL) return process.env.CLIENTE_SITE_URL.replace(/\/$/, '')
  // Em produção nunca monta o link de senha a partir do Host da requisição.
  if (process.env.NODE_ENV === 'production') return 'https://www.casaforteinc.com.br'
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'casaforteinc.com.br'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}
