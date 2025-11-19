import { Routes } from '@angular/router';
import { ReptilesComponent } from './reptiles';

const routes: Routes = [
  { path: '', component: ReptilesComponent, title: 'Reptiles' },
  {
    path: 'crear',
    loadComponent: () =>
      import('../species/species-form/species-form').then(m => m.SpeciesForm),
    data: { category: 'reptil', title: 'Crear reptil' },
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('../species/species-form/species-form').then(m => m.SpeciesForm),
    data: { category: 'reptil', title: 'Editar reptil' },
  },
];

export default routes;
