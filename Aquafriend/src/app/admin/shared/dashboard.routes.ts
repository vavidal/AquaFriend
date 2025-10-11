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
        path: 'anfibios',
        loadChildren: () =>
          import('../features/anfibios/anfibios.routes').then(m => m.anfibiosRoutes),
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
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
