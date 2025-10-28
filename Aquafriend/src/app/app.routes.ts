import { Routes } from '@angular/router';
import { MainBody } from './components/main-body/main-body';

export const routes: Routes = [
  { path: '', component: MainBody },
  {
    path: 'view360',
    loadChildren: () =>
      import('./view360/view360.routes').then(m => m.VIEW360_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./admin/shared/dashboard.routes').then(m => m.dashboardRoutes)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'us',
    loadChildren: () =>
      import('./components/us/us.routes').then(m => m.usRoutes)
  },
  { path: '**', redirectTo: '' }
];
