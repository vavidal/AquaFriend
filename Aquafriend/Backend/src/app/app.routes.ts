import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./shared/dashboard.routes').then(m => m.dashboardRoutes),
  },
  {
    path: 'admin/usuarios/crear',
    loadComponent: () =>
      import('./components/users/create-user.component').then(m => m.CreateAccountComponent),
    title: 'Crear usuario',
  },
  { path: '**', redirectTo: 'auth/login' },
];
