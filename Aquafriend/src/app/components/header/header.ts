import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements AfterViewInit {
  private readonly isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  
  closeNav(): void {
    // Cerrar navbar en móvil después de hacer clic
    if (!this.isBrowser) return;
    const navbarToggler = document.querySelector('.navbar-toggler') as HTMLElement;
    const navbarCollapse = document.querySelector('.navbar-collapse') as HTMLElement;
    
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarToggler?.click();
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.updateNavOffset();
  }

  private updateNavOffset(): void {
    // Actualizar variable CSS con altura del navbar
    if (!this.isBrowser) return;
    const navbar = document.querySelector('.navbar') as HTMLElement;
    if (navbar) {
      const height = navbar.offsetHeight;
      document.documentElement.style.setProperty('--nav-offset', `${height}px`);
    }
  }
}