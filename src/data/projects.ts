export type Phase = 'Entregue' | 'Em obra' | 'Lancamento'

export interface Project {
  name: string
  phase: Phase
  description: string
  image: string
  slug: string
  location: string
}

export const projects: Project[] = [
  {
    name: 'Villa Natur',
    phase: 'Entregue',
    description: 'Empreendimento entregue pela Casa Forte, reforçando nosso compromisso com qualidade e responsabilidade na execução.',
    image: '/images/Villa_Natur.jpg',
    slug: 'villa-natur',
    location: 'Alagoas',
  },
  {
    name: 'Villa Maui',
    phase: 'Entregue',
    description: 'Projeto entregue, representando mais uma etapa da trajetória da Casa Forte no mercado imobiliário alagoano.',
    image: '/images/Villa_Maui.jpg',
    slug: 'villa-maui',
    location: 'Alagoas',
  },
  {
    name: 'Java',
    phase: 'Em obra',
    description: 'Empreendimento em obra, desenvolvido com foco em qualidade construtiva, gestão técnica e valorização.',
    image: '/images/Java.jpg',
    slug: 'java',
    location: 'Alagoas',
  },
  {
    name: 'Casas Santorini',
    phase: 'Em obra',
    description: 'Projeto em obra na Praia do Patacho, em uma das regiões mais desejadas da Rota Ecológica dos Milagres.',
    image: '/images/Casas_Santorini.jpeg',
    slug: 'casas-santorini',
    location: 'Praia do Patacho, Porto de Pedras - AL',
  },
  {
    name: 'UMA Milagres',
    phase: 'Lancamento',
    description: 'Lancamento Casa Forte em Sao Miguel dos Milagres, pensado para unir localizacao, sofisticacao e potencial de valorizacao.',
    image: '/images/Uma__Milagres.png',
    slug: 'uma-milagres',
    location: 'Sao Miguel dos Milagres - AL',
  },
]