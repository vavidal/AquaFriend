import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./shared/dashboard.routes').then((m) => m.dashboardRoutes),
  },
  { path: '**', redirectTo: 'auth/login' },
];
