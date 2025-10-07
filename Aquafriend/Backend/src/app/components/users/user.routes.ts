import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: 'usuarios',
    children: [
      {
        path: 'crear',
        loadComponent: () =>
          import('../users/create-user.component').then(m => m.CreateUserComponent)
      }
    ]
  }
];

export default userRoutes;
