import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then((m) => m.Profile),
    title: 'Profile',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'profile',
  },
];
