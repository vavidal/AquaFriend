export interface TourOption {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  duration: string;
  highlights: string[];
  route: string;
  type: 'tour' | 'catalog';
}

export const TOUR_OPTIONS: TourOption[] = [
  {
    id: 'interior_acuario',
    title: 'Recepcion Acuario',
    description: 'Vista del ingreso principal del acuario, con detalles de la recepción y elementos representativos del Acuario.',
    category: 'Interior',
    image: '/assets/img/5.jpg',
    duration: '4 min recomendados',
    highlights: ['Recepción', 'Museografía', 'Intro'],
    route: '/tour/interior_acuario',
    type: 'tour',
  },
  {
    id: 'mirador_tres_volcanes',
    title: 'Mirador de los Tres Volcanes',
    description: 'Vista panorámica del mirador con una perspectiva privilegiada hacia la cordillera y sus volcanes.',
    category: 'Exterior',
    image: '/assets/img/mirador_tres_volcanes.png',
    duration: '3 min recomendados',
    highlights: ['Paisaje', 'Volcanes', 'Mirador'],
    route: '/tour/mirador_tres_volcanes',
    type: 'tour',
  },
  {
    id: 'granja',
    title: 'Granja Educativa',
    description: 'Vista de la zona de granja donde se aprecia parte de la fauna que forma parte del parque.',
    category: 'Granja',
    image: '/assets/img/_DSC8311.JPG',
    duration: '4 min recomendados',
    highlights: ['Animales', 'Aprendizaje', 'Familias'],
    route: '/tour/granja',
    type: 'tour',
  },
  {
    id: 'entrada_acuario',
    title: 'Entrada al Acuario',
    description: 'Vista del acceso principal hacia el acuario ',
    category: 'Exterior',
    image: '/assets/img/entrada_acuario.jpg',
    duration: '2 min recomendados',
    highlights: ['Ingreso', 'Entorno', 'Arquitectura'],
    route: '/tour/entrada_acuario',
    type: 'tour',
  },
  {
    id: 'exterior_granja',
    title: 'Exterior de la Granja',
    description: 'Áreas verdes y centro de eventos del acuario',
    category: 'Granja',
    image: '/assets/img/vista_exterior_granja.png',
    duration: '3 min recomendados',
    highlights: ['Senderos', 'Vegetación', 'Educación'],
    route: '/tour/exterior_granja',
    type: 'tour',
  },

  
  {
    id: 'catalogo',
    title: 'Catálogo multimedia',
    description: 'Visualiza ficha educativas de nuestros aniamales,peces y aves.',
    category: 'Recursos',
    image: '/assets/img/_DSC8338.JPG',
    duration: 'Explora a tu ritmo',
    highlights: ['Fichas'],
    route: '/catalogo',
    type: 'catalog',
  },
];
