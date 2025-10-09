import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  { path: '', redirectTo: 'crear', pathMatch: 'full' },
  {
    path: 'crear',
    loadComponent: () =>
      import('./create-user.component').then(m => m.CreateAccountComponent), 
    title: 'Crear usuario'
  }
];

export default userRoutes;
