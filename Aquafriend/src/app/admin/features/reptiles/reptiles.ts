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
  selector: 'app-reptiles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reptiles.html',
  styleUrls: ['./reptiles.scss'],
})
export class ReptilesComponent {
  q = signal('');
  private data = signal<Anfibio[]>([]);

  reptilesFiltrados = computed(() => {
    const term = this.q().toLowerCase().trim();
    return this.data().filter(a => {
      const t = `${a.especie || ''} ${a.alimentacion || ''} ${a.descripcion || ''}`;
      return !term || t.toLowerCase().includes(term);
    });
  });

  img(a: Anfibio) {
    return a.imagen_referencial || 'assets/placeholder.jpg';
  }

  onOpenFilters() {
    console.log('Abrir filtros reptiles');
  }

  onCreateAmphibian() {
    console.log('Crear anfibio');
  }
}
