import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { filter } from 'rxjs/operators';

type Pez = {
  id: number;
  especie: string;
  habitat?: string;
  alimentacion?: string;
  tamano_promedio?: string;
  descripcion?: string;
  imagen_referencial?: string;
  fecha_registro?: string | Date;
};

@Component({
  selector: 'app-peces',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './peces.html',
  styleUrls: ['./peces.scss'],
})
export class Peces {
  private router = inject(Router);
  private http = inject(HttpClient);

  cargando = signal(false);
  peces = signal<Pez[]>([]);

  constructor() {
    this.cargar();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => this.cargar());
  }

  cargar() {
    this.cargando.set(true);
    this.http.get<Pez[]>('http://localhost:3000/api/peces').subscribe({
      next: rows => { this.peces.set(rows); this.cargando.set(false); },
      error: () => { this.peces.set([]); this.cargando.set(false); }
    });
  }

  img(p: Pez) {
    return p.imagen_referencial || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><rect width="100%" height="100%" fill="%23e5edf4"/></svg>';
  }

  onOpenFilters() {}
  goCreate() { this.router.navigate(['/dashboard/peces/crear']); }
  goEdit(id: number) { this.router.navigate(['/dashboard/peces/editar', id]); }

  onDelete(p: Pez) {
    const ok = confirm(`¿Eliminar "${p.especie}"? Esta acción no se puede deshacer.`);
    if (!ok) return;
    this.http.delete(`http://localhost:3000/api/peces/${p.id}`, { observe: 'response' }).subscribe({
      next: () => this.cargar(),
      error: (err) => {
        const status = err?.status;
        const msg = err?.error?.message || err?.message || 'Error desconocido';
        console.error('Error al eliminar pez', status, msg, err);
        alert(`No se pudo eliminar el pez. [${status}] ${msg}`);
      }
    });
  }
}
