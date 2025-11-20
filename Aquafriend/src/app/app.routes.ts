import { Routes } from '@angular/router';
import { MainBody } from './components/main-body/main-body';
// 1. IMPORTACIÓN NECESARIA: Componente para el visor 360
import { VisorMarzipanoComponent } from './visor-marzipano/visor-marzipano';

export const routes: Routes = [
  {
    path: '',
    component: MainBody,
    data: { title: 'Inicio | Acuario Puyehue' }
  },
  {
    path: 'view360',
    loadChildren: () =>
      import('../app/view360/view360.routes').then(m => m.VIEW360_ROUTES),
    data: { title: 'Recorrido 360° | Acuario Puyehue' }
  },
  // 2. RUTA PARAMÉTRICA FALTANTE: Carga el Visor 360
  {
    path: 'tour/:tourName',
    component: VisorMarzipanoComponent,
    data: { title: 'Visor 360° | Acuario Puyehue'}
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('../app/catalogo/catalogo').then(m => m.CatalogoComponent),
    data: { title: 'Catálogo | Acuario Puyehue' }
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./admin/shared/dashboard.routes').then(m => m.dashboardRoutes),
    data: { title: 'Panel Administrativo | Acuario Puyehue' }
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
    data: { title: 'Administración | Acuario Puyehue' }
  },
  {
    path: 'us',
    loadChildren: () =>
      import('./components/us/us.routes').then(m => m.usRoutes),
    data: { title: 'Nosotros | Acuario Puyehue' }
  },
  {
    path: 'reservas',
    loadChildren: () =>
      import('./components/pedagogical-reservations/pedagogical-reservations.routes')
        .then(m => m.pedagogicalReservationsRoutes),
    data: { title: 'Reservas Educativas | Acuario Puyehue' }
  },
  {
    path: '**',
    redirectTo: ''
  }
];