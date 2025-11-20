import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SpeciesService, Category } from './species.service';

type PlaceholderSet = {
  especie: string;
  habitat: string;
  alimentacion: string;
  tamano_promedio: string;
  descripcion: string;
};

const PLACEHOLDERS: Record<Category, PlaceholderSet> = {
  pez: {
    especie: 'Ej. Trucha arcoíris',
    habitat: 'Lago, río templado, estuario',
    alimentacion: 'Omnívora, zooplanctívora...',
    tamano_promedio: '25-35 cm',
    descripcion: 'Breve descripción del pez...',
  },
  animal: {
    especie: 'Ej. Nutria de río',
    habitat: 'Bosque templado, humedales, ribera',
    alimentacion: 'Carnívora, insectívora...',
    tamano_promedio: '45-60 cm',
    descripcion: 'Rasgos del animal y conducta...',
  },
  reptil: {
    especie: 'Ej. Lagarto chileno',
    habitat: 'Rocas soleadas, matorrales áridos',
    alimentacion: 'Insectívora, carnívora...',
    tamano_promedio: '30-40 cm',
    descripcion: 'Comportamiento del reptil...',
  },
  anfibio: {
    especie: 'Ej. Sapo de Atacama',
    habitat: 'Humedales altoandinos, lagunas',
    alimentacion: 'Insectívora, carnívora...',
    tamano_promedio: '7-9 cm',
    descripcion: 'Características del anfibio...',
  },
};

@Component({
  selector: 'species-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './species-form.html',
  styleUrls: ['./species-form.scss'],
})
export class SpeciesForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(SpeciesService);

  category = this.route.snapshot.data['category'] as Category;
  placeholders = this.resolvePlaceholders();
  idParam = this.route.snapshot.paramMap.get('id');
  isEdit = !!this.idParam;

  submitting = signal(false);
  preview = signal<string | null>(null);

  form = this.fb.group({
    especie: ['', Validators.required],
    habitat: [''],
    alimentacion: [''],
    tamano_promedio: [''],
    descripcion: [''],
    imagen_referencial: ['']
  });

  constructor() {
    if (this.isEdit && this.idParam) {
      const id = Number(this.idParam);
      this.api.getOne(this.category, id).subscribe(d => {
        this.form.patchValue({
          especie: d.especie ?? '',
          habitat: d.habitat ?? '',
          alimentacion: d.alimentacion ?? '',
          tamano_promedio: d.tamano_promedio ?? '',
          descripcion: d.descripcion ?? '',
          imagen_referencial: d.imagen_referencial ?? ''
        });
        if (d.imagen_referencial) this.preview.set(d.imagen_referencial);
      });
    }
  }

  onPick(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.preview.set(dataUrl);
      // guardar en el form para enviar al backend
      this.form.patchValue({ imagen_referencial: dataUrl });
    };
    reader.readAsDataURL(file);
  }

  goBack() {
    this.router.navigate(this.resolveListRoute());
  }

  private resolveListRoute(): string[] {
    switch (this.category) {
      case 'animal': return ['/dashboard/animales'];
      case 'reptil': return ['/dashboard/reptiles'];
      case 'pez': return ['/dashboard/peces'];
      default: return ['/dashboard'];
    }
  }

  private resolvePlaceholders(): PlaceholderSet {
    return PLACEHOLDERS[this.category] ?? PLACEHOLDERS['pez'];
  }

  submit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const payload = { ...this.form.value } as any;
    // si tiene preview pero el control quedó vacío, usamos el preview
    if (!payload.imagen_referencial && this.preview()) {
      payload.imagen_referencial = this.preview();
    }
    const obs = this.isEdit && this.idParam
      ? this.api.update(this.category, Number(this.idParam), payload)
      : this.api.create(this.category, payload);
    obs.subscribe({
      next: () => this.goBack(),
      error: (err) => {
        console.error('Error al guardar pez', err);
        this.submitting.set(false);
        try {
          const msg = err?.error?.message || err?.message || 'Error desconocido';
          alert('No se pudo guardar el pez: ' + msg);
        } catch { /* noop */ }
      }
    });
  }
}
