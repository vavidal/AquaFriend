import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin.layout').then(m => m.AdminLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      {
        path: 'home',
        loadComponent: () => import('./shared/home/home').then(m => m.Home),
        canActivate: [authGuard]
      },
      {
        path: 'animales',
        loadChildren: () => import('./features/animales/animales.routes').then(m => m.animalesRoutes),
        canActivate: [authGuard]
      },
      {
        path: 'reptiles',
        loadChildren: () => import('./features/reptiles/reptiles.routes').then(m => m.default),
        canActivate: [authGuard]
      },
      {
        path: 'peces',
        loadChildren: () => import('./features/peces/peces.routes').then(m => m.pecesRoutes),
        canActivate: [authGuard]
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/user.routes').then(m => m.userRoutes),
        canActivate: [authGuard]
      },
      {
        path: 'drawer',
        loadChildren: () => import('./features/drawer/drawer.routes').then(m => m.drawerRoutes),
        canActivate: [authGuard]
      },
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then(m => m.AdminLogin)
      }
    ]
  }
];
