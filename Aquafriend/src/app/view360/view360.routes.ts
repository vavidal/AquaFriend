import { Routes } from '@angular/router';

export const VIEW360_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./view360').then(m => m.View360Component)
  }
];
