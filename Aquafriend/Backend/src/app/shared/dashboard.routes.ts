import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Home } from './home/home';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home, title: 'Home' },

      {
        path: 'peces',
        loadChildren: () =>
          import('../components/peces/peces.routes').then(m => m.pecesRoutes),
      },
      {
        path: 'animales',
        loadChildren: () =>
          import('../components/animales/animales.routes').then(m => m.animalesRoutes),
      },
      {
        path: 'anfibios',
        loadChildren: () =>
          import('../components/anfibios/anfibios.routes').then(m => m.anfibiosRoutes),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../components/settings/settings.routes').then(m => m.settingsRoutes),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('../components/admin/admin.routes').then(m => m.adminRoutes),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('../components/user/user.routes').then(m => m.userRoutes),
      },
      {
        path: 'article',
        loadChildren: () =>
          import('../components/article/article.routes').then(m => m.articleRoutes),
      },
      {
        path: 'drawer',
        loadChildren: () =>
          import('../components/drawer/drawer.routes').then(m => m.drawerRoutes),
      },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
