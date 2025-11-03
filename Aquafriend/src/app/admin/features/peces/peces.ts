import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  // Filtros
  q = signal('');
  habitatFiltro = signal<string>('');
  habitats = signal<string[]>(['Todos', 'Lago', 'Río', 'Mar']);

  // Datos base
  private data = signal<Pez[]>([]);
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);

  // Computed: aplica filtro por texto y hábitat
  pecesFiltrados = computed(() => {
    const term = this.q().toLowerCase().trim();
    const hab = this.habitatFiltro();

    return this.data().filter((p) => {
      const texto = `${p.especie || ''} ${p.alimentacion || ''} ${p.descripcion || ''}`;
      const coincideTexto = !term || texto.toLowerCase().includes(term);
      const coincideHabitat =
        !hab || hab === 'Todos' || (p.habitat || '').toLowerCase() === hab.toLowerCase();

      return coincideTexto && coincideHabitat;
    });
  });

  constructor() {
    this.cargarPeces();
  }

  // 🐠 Cargar peces desde el backend
  cargarPeces() {
    this.cargando.set(true);
    this.error.set(null);

    this.http.get<Pez[]>('http://localhost:3000/api/peces').subscribe({
      next: (res) => {
        this.data.set(res);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al obtener peces:', err);
        this.error.set('No se pudo cargar la lista de peces.');
        this.cargando.set(false);
      },
    });
  }

  // Funciones auxiliares
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
