import { Routes } from '@angular/router';
import { Peces } from './peces';

export const pecesRoutes: Routes = [
  { path: '', component: Peces, title: 'Peces' },
  {
    path: 'crear',
    loadComponent: () =>
      import('../species/species-form/species-form').then(m => m.SpeciesForm),
    data: { category: 'pez', title: 'Crear pez' },
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('../species/species-form/species-form').then(m => m.SpeciesForm),
    data: { category: 'pez', title: 'Editar pez' },
  },
];
