import { Routes } from '@angular/router';
import { Users } from './users/users';

export const userRoutes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users').then((m) => m.Users),
    title: 'Users',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'users',
  },
];
