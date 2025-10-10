import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, NgIf, RouterOutlet, RouterLink],
  template: `
    <!-- Vista de login: ocupa toda la pantalla, sin navegación -->
    <router-outlet *ngIf="isLoginRoute(); else adminShell"></router-outlet>

    <!-- Shell del panel con navegación -->
    <ng-template #adminShell>
      <div class="container py-3">
        <nav class="mb-3 d-flex gap-3 align-items-center">
          <a routerLink="/" class="text-decoration-none">← Volver</a>
          <a routerLink="/admin/home" class="text-decoration-none">Dashboard</a>
          <span class="mx-2">·</span>
          <a routerLink="/admin/users" class="text-decoration-none">Usuarios</a>
          <a routerLink="/admin/animales" class="text-decoration-none">Animales</a>
          <a routerLink="/admin/peces" class="text-decoration-none">Peces</a>
        </nav>
        <router-outlet></router-outlet>
      </div>
    </ng-template>
  `
})
export class AdminLayout {
  protected readonly isLoginRoute = signal(false);
  private readonly router = inject(Router);

  constructor() {
    // Estado inicial
    this.isLoginRoute.set(this.router.url.startsWith('/admin/login'));
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.isLoginRoute.set(e.urlAfterRedirects.startsWith('/admin/login')));
  }
}


