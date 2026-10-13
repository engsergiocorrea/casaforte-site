import 'server-only'
import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>

export async function hashSenha(senha: string): Promise<string> {
  const salt = randomBytes(16)
  const hash = await scryptAsync(senha, salt, 64)
  return `${salt.toString('base64')}$${hash.toString('base64')}`
}

export async function conferirSenha(senha: string, armazenado: string | null): Promise<boolean> {
  if (!armazenado) return false
  const [saltB64, hashB64] = armazenado.split('$')
  if (!saltB64 || !hashB64) return false
  const esperado = Buffer.from(hashB64, 'base64')
  const obtido = await scryptAsync(senha, Buffer.from(saltB64, 'base64'), esperado.length)
  return timingSafeEqual(esperado, obtido)
}

export function novoToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString('base64url')
  return { token, hash: sha256(token) }
}

export function sha256(v: string): string {
  return createHash('sha256').update(v).digest('hex')
}

function segredo(): string {
  const s = process.env.CLIENTE_SESSION_SECRET
  if (!s || s.length < 32) throw new Error('CLIENTE_SESSION_SECRET ausente ou curto (mín. 32 caracteres)')
  return s
}

export function assinar(payload: object): string {
  const corpo = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const mac = createHmac('sha256', segredo()).update(corpo).digest('base64url')
  return `${corpo}.${mac}`
}

export function verificar<T>(valor: string | undefined): T | null {
  if (!valor) return null
  const [corpo, mac] = valor.split('.')
  if (!corpo || !mac) return null
  const esperado = createHmac('sha256', segredo()).update(corpo).digest()
  const recebido = Buffer.from(mac, 'base64url')
  if (recebido.length !== esperado.length || !timingSafeEqual(recebido, esperado)) return null
  try {
    return JSON.parse(Buffer.from(corpo, 'base64url').toString()) as T
  } catch {
    return null
  }
}
