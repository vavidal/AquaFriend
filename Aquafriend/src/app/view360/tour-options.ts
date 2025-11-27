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
    title: 'Interior del Acuario',
    description: 'Vista del ingreso principal del acuario, con detalles de la recepción y elementos representativos del Acuario.',
    category: 'Interior',
    image: '/assets/img/_DSC5200.JPG',
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
    image: '/assets/img/17.jpg',
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
    title: 'Vista Exterior del Acuario',
    description: 'Vista del acceso principal del acuario junto con elementos de señalética y ambientación exterior del parque.',
    category: 'Exterior',
    image: '/assets/img/5.jpg',
    duration: '2 min recomendados',
    highlights: ['Ingreso', 'Entorno', 'Arquitectura'],
    route: '/tour/entrada_acuario',
    type: 'tour',
  },
  {
    id: 'exterior_granja',
    title: 'Exterior de la Granja',
    description: 'Áreas verdes y circuitos educativos al aire libre.',
    category: 'Granja',
    image: '/assets/img/_DSC7319.JPG',
    duration: '3 min recomendados',
    highlights: ['Senderos', 'Vegetación', 'Educación'],
    route: '/tour/exterior_granja',
    type: 'tour',
  },
  {
    id: 'vista_exterior',
    title: 'Vista Exterior 2',
    description: 'Una segunda perspectiva del entorno con énfasis en señalética.',
    category: 'Exterior',
    image: '/assets/img/6.jpg',
    duration: '2 min recomendados',
    highlights: ['Detalles', 'Señalética', 'Recorridos'],
    route: '/tour/vista_exterior',
    type: 'tour',
  },
  {
    id: 'catalogo',
    title: 'Catálogo multimedia',
    description: 'Consulta fichas de especies, audios y recursos descargables.',
    category: 'Recursos',
    image: '/assets/img/_DSC8338.JPG',
    duration: 'Explora a tu ritmo',
    highlights: ['Fichas', 'Audio', 'Descargas'],
    route: '/catalogo',
    type: 'catalog',
  },
];
