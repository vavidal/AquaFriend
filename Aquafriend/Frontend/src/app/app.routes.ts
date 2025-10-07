import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main';
import { View360Component } from './components/view360/view360';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'view360', component: View360Component }
];

