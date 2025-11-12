import { Component, AfterViewInit, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements AfterViewInit {
  menuOpen = false;
  private readonly router = inject(Router);
  private readonly isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

  constructor() {
    this.router.events.subscribe(() => (this.menuOpen = false));
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeNav(): void {
    this.menuOpen = false;
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.updateNavOffset();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateNavOffset();
  }

  private updateNavOffset(): void {
    if (!this.isBrowser) return;
    const navbar = document.querySelector('.navbar') as HTMLElement | null;
    if (navbar) {
      const height = navbar.offsetHeight;
      document.documentElement.style.setProperty('--nav-offset', `${height}px`);
    }
  }
}
