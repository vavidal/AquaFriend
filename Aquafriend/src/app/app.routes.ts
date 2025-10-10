import { Routes } from '@angular/router';
import { MainBody } from './components/main-body/main-body';
import { View360 } from './components/view360/view360';

export const routes: Routes = [
  { path: '', component: MainBody },
  { path: 'view360', component: View360 }
];


