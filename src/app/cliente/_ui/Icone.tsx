// Ícones de traço (24px) usados nos atalhos da área do cliente.
const caminhos = {
  obra: 'M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6',
  boleto: 'M4 5h16v14H4zM7 9v6M10 9v6M12 9v6M15 9v6M17 9v6',
  saldo: 'M4 19h16M6 16V10M10 16V6M14 16v-4M18 16V8',
  contato: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
  ouvidoria: 'M4 5h16v11H8l-4 4zM8 9h8M8 12h5',
  foto: 'M4 7h3l2-2h6l2 2h3v12H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  relatorio: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
} as const

export type NomeIcone = keyof typeof caminhos

export default function Icone({ nome }: { nome: NomeIcone }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={caminhos[nome]} />
    </svg>
  )
}
