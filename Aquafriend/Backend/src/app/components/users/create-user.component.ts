import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-user.component.html'
})
export class CreateUserComponent {
  private fb = inject(FormBuilder);
  f = this.fb.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    rol: ['Editor', Validators.required],
    telefono: [''],
    direccion: [''],
    avatarUrl: ['']
  });

  submit() { if (this.f.invalid) return; }
}
