import { Component, signal, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { filter, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App {
  protected readonly title = signal('AquaFriend');
  protected readonly isAdminRoute = signal(false);
  private readonly isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);

  constructor() {
    if (this.isBrowser) {
      const currentPath = window.location.pathname;
      this.isAdminRoute.set(this.isAdminOrDashboard(currentPath));
    }
    this.updateBodyClass();
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        this.isAdminRoute.set(this.isAdminOrDashboard(e.urlAfterRedirects));
        this.updateBodyClass();
      });

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map(() => this.router.routerState.root),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot.data?.['title'] ?? 'AquaFriend';
        })
      )
      .subscribe(pageTitle => this.titleService.setTitle(pageTitle));
  }

  private isAdminOrDashboard(url: string): boolean {
    return url.startsWith('/admin') || url.startsWith('/dashboard') || url.startsWith('/tour');
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
