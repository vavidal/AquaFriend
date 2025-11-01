import { Routes } from '@angular/router';

export const pedagogicalReservationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pedagogical-reservations').then(m => m.PedagogicalReservationsComponent),
    title: 'Reservas Educativas'
  }
];

export default pedagogicalReservationsRoutes;
