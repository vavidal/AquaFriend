import { Routes } from '@angular/router';
import { MainBody } from './components/main-body/main-body';

export const routes: Routes = [
  { path: '', component: MainBody },
  // Redirección temporal tras eliminar el componente View360
  { path: 'view360', redirectTo: '', pathMatch: 'full' },
  // Ruta para el dashboard admin con sidebar
  {
    path: 'dashboard',
    loadChildren: () => import('./admin/shared/dashboard.routes').then(m => m.dashboardRoutes)
  },
  // Ruta legacy para admin (login)
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  }
];


