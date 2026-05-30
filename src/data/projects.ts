export type Phase = 'Entregue' | 'Em obra' | 'Lançamento'

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
    location: 'Rota Ecológica dos Milagres — AL',
  },
  {
    name: 'Villa Maui',
    phase: 'Entregue',
    description: 'Projeto entregue, representando mais uma etapa da trajetória da Casa Forte no mercado imobiliário alagoano.',
    image: '/images/Villa_Maui.jpg',
    slug: 'villa-maui',
    location: 'Rota Ecológica dos Milagres — AL',
  },
  {
    name: 'Java',
    phase: 'Em obra',
    description: 'Empreendimento em obra, desenvolvido com foco em qualidade construtiva, gestão técnica e valorização.',
    image: '/images/Java.jpg',
    slug: 'java',
    location: 'Rota Ecológica dos Milagres — AL',
  },
  {
    name: 'Casas Santorini',
    phase: 'Em obra',
    description: 'Projeto em obra na Praia do Patacho, em uma das regiões mais desejadas da Rota Ecológica dos Milagres.',
    image: '/images/Casas_Santorini.jpeg',
    slug: 'casas-santorini',
    location: 'Praia do Patacho, Porto de Pedras — AL',
  },
  {
    name: 'UMÁ Milagres',
    phase: 'Lançamento',
    description: 'Lançamento Casa Forte em São Miguel dos Milagres, pensado para unir localização, sofisticação e potencial de valorização.',
    image: '/images/Uma__Milagres.png',
    slug: 'uma-milagres',
    location: 'São Miguel dos Milagres — AL',
  },
]