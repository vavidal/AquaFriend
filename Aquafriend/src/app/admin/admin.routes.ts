import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin.layout').then(m => m.AdminLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      {
        path: 'home',
        loadComponent: () => import('./shared/home/home').then(m => m.AdminHome)
      },
      {
        path: 'animales',
        loadChildren: () => import('./features/animales/animales.routes').then(m => m.animalesRoutes)
      },
      {
        path: 'anfibios',
        loadChildren: () => import('./features/anfibios/anfibios.routes').then(m => m.anfibiosRoutes)
      },
      {
        path: 'peces',
        loadChildren: () => import('./features/peces/peces.routes').then(m => m.pecesRoutes)
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/user.routes').then(m => m.userRoutes)
      },
      {
        path: 'drawer',
        loadChildren: () => import('./features/drawer/drawer.routes').then(m => m.drawerRoutes)
      },
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then(m => m.AdminLogin)
      }
    ]
  }
];


