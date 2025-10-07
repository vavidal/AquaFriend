import {
  AfterViewInit, Component, ElementRef, Inject, PLATFORM_ID, ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements AfterViewInit {
  @ViewChild('navbar', { static: true }) navbar!: ElementRef<HTMLElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    // opcional: actualizar --nav-offset, etc.
  }

  /** Cierra el menú colapsado en móvil */
  closeNav() {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = document.getElementById('mainNav');
    // Usa la instancia de Bootstrap 5
    const bsCollapse = (window as any)?.bootstrap?.Collapse
      ?.getOrCreateInstance(el!, { toggle: false });
    bsCollapse?.hide();
  }
}
