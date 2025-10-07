import { Routes } from '@angular/router';

export const articleRoutes: Routes = [
  {
    path: '',
    redirectTo: 'articles',
    pathMatch: 'full',
  },
  {
    path: 'articles',
    loadComponent: () => import('./articles/articles').then((m) => m.Articles),
    title: 'Articles',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'articles',
  },
];
