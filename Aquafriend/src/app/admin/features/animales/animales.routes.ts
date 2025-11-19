import { Routes } from '@angular/router';
import { Animales } from './animales';

export const animalesRoutes: Routes = [
  { path: '', component: Animales, title: 'Animales' },
  {
    path: 'crear',
    loadComponent: () =>
      import('../species/species-form/species-form').then(m => m.SpeciesForm),
    data: { category: 'animal', title: 'Crear animal' },
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('../species/species-form/species-form').then(m => m.SpeciesForm),
    data: { category: 'animal', title: 'Editar animal' },
  },
];
