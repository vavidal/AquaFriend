import { Component, AfterViewInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements AfterViewInit {
  private readonly isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

  closeNav(): void {
    if (!this.isBrowser) return;
    const navbarToggler = document.querySelector('.navbar-toggler') as HTMLElement | null;
    const navbarCollapse = document.querySelector('.navbar-collapse') as HTMLElement | null;
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarToggler?.dispatchEvent(new Event('click'));
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
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
