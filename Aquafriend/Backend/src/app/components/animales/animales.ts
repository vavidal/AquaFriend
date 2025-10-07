import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Animal = {
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
  selector: 'app-animales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './animales.html',
  styleUrl: './animales.scss',
})
export class Animales {
  q = signal('');
  habitatFiltro = signal<string>('');
  habitats = signal<string[]>(['Todos', 'Granja', 'Bosque', 'Humedal']);

  private data = signal<Animal[]>([]);

  animalesFiltrados = computed(() => {
    const term = this.q().toLowerCase().trim();
    const hab = this.habitatFiltro();
    return this.data().filter((a) => {
      const t =
        (a.especie || '') +
        ' ' +
        (a.alimentacion || '') +
        ' ' +
        (a.descripcion || '');
      const okText = !term || t.toLowerCase().includes(term);
      const okHab = !hab || (a.habitat || '').toLowerCase() === hab.toLowerCase();
      return okText && okHab;
    });
  });

  img(a: Animal) {
    return a.imagen_referencial || 'assets/placeholder.jpg';
  }

  setHabitat(h: string) {
    this.habitatFiltro.set(h);
  }

  clear() {
    this.q.set('');
    this.habitatFiltro.set('');
  }

  onOpenFilters() {
    console.log('Abrir filtros animales');
  }

  onCreateAnimal() {
    console.log('Crear animal');
  }
}
