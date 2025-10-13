import { Routes } from '@angular/router';

export const contactosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./contactos.component').then(m => m.ContactosComponent)
  }
];
