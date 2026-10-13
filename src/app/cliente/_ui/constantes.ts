export const LOGO_URL =
  'https://idjzhzqvfhtfycvmfoen.supabase.co/storage/v1/object/public/empreendimentos/logosemfundo%20casa%20forte.png'

export const WHATSAPP_NUMERO = '5582991017208'
export const WHATSAPP_EXIBICAO = '(82) 99101-7208'
export const whatsappLink = (texto?: string) =>
  `https://wa.me/${WHATSAPP_NUMERO}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`

export const CATEGORIAS_OUVIDORIA = [
  { valor: 'reclamacao', rotulo: 'Reclamação' },
  { valor: 'sugestao', rotulo: 'Sugestão' },
  { valor: 'elogio', rotulo: 'Elogio' },
  { valor: 'denuncia', rotulo: 'Denúncia' },
] as const

export const ASSUNTOS_CONTATO = [
  'Andamento da obra',
  'Financeiro e boletos',
  'Contrato e documentação',
  'Assistência técnica',
  'Personalização / alterações',
  'Outro assunto',
] as const

export const STATUS_SOLICITACAO: Record<string, string> = {
  aberta: 'Recebida',
  em_andamento: 'Em andamento',
  respondida: 'Respondida',
  encerrada: 'Encerrada',
}
