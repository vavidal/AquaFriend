import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet, RouterLink, NavigationEnd } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <router-outlet *ngIf="isLoginRoute(); else adminShell"></router-outlet>
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
export class AdminLayout implements OnInit {
  protected readonly isLoginRoute = signal(false);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.isLoginRoute.set(this.router.url.startsWith('/admin/login'));
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        const isLogin = e.urlAfterRedirects.startsWith('/admin/login');
        this.isLoginRoute.set(isLogin);
        if (!isLogin && isPlatformBrowser(this.platformId) && this.auth.isLoggedIn()) {
          this.auth.refreshCurrentUser().subscribe();
        }
      });

    if (isPlatformBrowser(this.platformId) && this.auth.isLoggedIn()) {
      this.auth.refreshCurrentUser().subscribe();
    }
  }
}
