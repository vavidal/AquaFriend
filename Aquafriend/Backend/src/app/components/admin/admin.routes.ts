import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admins/admins').then(m => m.Admins),
    title: 'Administración',
  },
];
