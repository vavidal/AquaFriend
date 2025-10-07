import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Anfibio = {
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
  selector: 'app-anfibios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './anfibios.html',
  styleUrl: './anfibios.scss',
})
export class Anfibios {
  q = signal('');
  private data = signal<Anfibio[]>([]);

  anfibiosFiltrados = computed(() => {
    const term = this.q().toLowerCase().trim();
    return this.data().filter((a) => {
      const t =
        (a.especie || '') + ' ' +
        (a.alimentacion || '') + ' ' +
        (a.descripcion || '');
      return !term || t.toLowerCase().includes(term);
    });
  });

  img(a: Anfibio) {
    return a.imagen_referencial || 'assets/placeholder.jpg';
  }

  onOpenFilters() {
    console.log('Abrir filtros anfibios');
  }

  onCreateAmphibian() {
    console.log('Crear anfibio');
  }
}
