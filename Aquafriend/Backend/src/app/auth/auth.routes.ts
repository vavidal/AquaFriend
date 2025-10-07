import { Routes } from '@angular/router';
import { Login } from './login/login';

export const authRoutes: Routes = [
  { path: 'login', component: Login, title: 'Login' },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
