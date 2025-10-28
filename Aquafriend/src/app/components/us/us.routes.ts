import { Routes } from '@angular/router';

export const usRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./us.component').then(m => m.UsComponent),
    title: 'Nosotros | Acuario Puyehue'
  }
];

export default usRoutes;
