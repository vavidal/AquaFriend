import { Component, signal, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App {
  protected readonly title = signal('AquaFriend');
  protected readonly isAdminRoute = signal(false);
  private readonly isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

  private readonly router = inject(Router);

  constructor() {
    // Estado inicial
    this.isAdminRoute.set(this.router.url.startsWith('/admin'));
    // Toggle clase en body para padding del header
    this.updateBodyClass();
    // Actualiza cuando cambia la ruta
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.isAdminRoute.set(e.urlAfterRedirects.startsWith('/admin'));
        this.updateBodyClass();
      });
  }

  private updateBodyClass() {
    if (!this.isBrowser) return;
    const hasHeader = !this.isAdminRoute();
    const body = document.body;
    if (hasHeader) {
      body.classList.add('with-nav');
    } else {
      body.classList.remove('with-nav');
    }
  }
}
