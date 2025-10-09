import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './peces.html',
  styleUrls: ['./peces.scss'],
})
export class Peces {
  private router = inject(Router);

  q = signal('');
  habitatFiltro = signal<string>('');
  habitats = signal<string[]>(['Todos', 'Lago', 'Río', 'Mar']);

  private data = signal<Pez[]>([]);

  pecesFiltrados = computed(() => {
    const term = this.q().toLowerCase().trim();
    const hab = this.habitatFiltro();
    return this.data().filter((p) => {
      const t = `${p.especie || ''} ${p.alimentacion || ''} ${p.descripcion || ''}`;
      const okText = !term || t.toLowerCase().includes(term);
      const okHab = !hab || (p.habitat || '').toLowerCase() === hab.toLowerCase();
      return okText && okHab;
    });
  });

  img(p: Pez) {
    return p.imagen_referencial || 'assets/placeholder.jpg';
  }

  setHabitat(h: string) {
    this.habitatFiltro.set(h);
  }

  clear() {
    this.q.set('');
    this.habitatFiltro.set('');
  }

  onOpenFilters() {}

  goCreate() {
    this.router.navigate(['/dashboard/peces/crear']);
  }
}
