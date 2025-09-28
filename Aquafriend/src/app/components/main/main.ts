import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type GalleryItem = { src: string; title: string; text?: string };

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.html',
  styleUrls: ['./main.css'],
})
export class MainComponent {

  // Solo números de archivos que EXISTEN
  private readonly nums = [
    1, 2, 3, 4, 5, 10, 13, 15, 16, 17, 19, 20, 21
  ];

  // Si quieres títulos personalizados, ponlos aquí (opcional)
  private readonly titles: Record<number, string> = {
    1: 'Vista del barco del acuario',
    2: 'Puesto',
    3: 'Senderos',
    4: 'Bosque nativo',
    5: 'Aula abierta',
    6: 'Alevines',
    // ...agrega más si quieres
  };

  images: GalleryItem[] = this.nums.map((n) => ({
    src: `assets/img/${n}.jpg`,
    title: this.titles[n] || `Imagen ${n}`,
    // text: 'Descripción breve opcional',
  }));
}
