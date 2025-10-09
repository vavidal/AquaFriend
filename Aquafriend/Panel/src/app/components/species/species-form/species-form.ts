import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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

  isEdit = !!this.route.snapshot.paramMap.get('id');
  submitting = signal(false);

  openA = signal(true);
  openB = signal(true);
  openC = signal(false);

  preview = signal<string | null>(null);

  form = this.fb.group({
    especie: ['', Validators.required],
    habitat: [''],
    alimentacion: [''],
    tamano_promedio: [''],
    descripcion: [''],
    imagen_principal: [''],
  });

  pageTitle = () => this.route.snapshot.data['title'] || (this.isEdit ? 'Editar' : 'Crear');

  toggle(which: 'A'|'B'|'C') {
    if (which === 'A') this.openA.set(!this.openA());
    if (which === 'B') this.openB.set(!this.openB());
    if (which === 'C') this.openC.set(!this.openC());
  }

  onPick(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    this.preview.set(url);
  }

  goBack() { this.router.navigate(['../'], { relativeTo: this.route }); }

  submit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    setTimeout(() => {
      this.submitting.set(false);
      this.goBack();
    }, 800);
  }
}
