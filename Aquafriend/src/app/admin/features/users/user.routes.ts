import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  {
    path: 'lista',
    loadComponent: () =>
      import('./users-list.component').then(m => m.UsersListComponent),
    title: 'Gestión de Usuarios'
  },
  {
    path: 'crear',
    loadComponent: () =>
      import('./create-user.component').then(m => m.CreateAccountComponent),
    title: 'Crear usuario'
  }
];

export default userRoutes;
