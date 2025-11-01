import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Home } from './home/home';
import { authGuard } from '../guards/auth.guard';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home, title: 'Home' },
      {
        path: 'peces',
        loadChildren: () =>
          import('../features/peces/peces.routes').then(m => m.pecesRoutes),
      },
      {
        path: 'animales',
        loadChildren: () =>
          import('../features/animales/animales.routes').then(m => m.animalesRoutes),
      },
      {
        path: 'reptiles',
        loadChildren: () =>
          import('../features/reptiles/reptiles.routes').then(m => m.default),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('../features/users/user.routes').then(m => m.userRoutes),
      },
      {
        path: 'drawer',
        loadChildren: () =>
          import('../features/drawer/drawer.routes').then(m => m.drawerRoutes),
      },
      {
        path: 'reservas',
        loadChildren: () =>
          import('../features/reservas/reservas.routes').then(m => m.reservasRoutes),
      },
      {
        path: 'contactos',
        loadChildren: () =>
          import('../features/contactos/contactos.routes').then(m => m.contactosRoutes),
      },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
