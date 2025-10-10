import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type UserForm = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: string;
  avatarFile: File | null;
  avatarUrl: string;
  avatarLabel: string;
};

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateAccountComponent {
  constructor(private router: Router) {}

  model: UserForm = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rol: 'Administrador',
    avatarFile: null,
    avatarUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Ccircle cx="100" cy="100" r="100" fill="%23ddd"/%3E%3Ccircle cx="100" cy="80" r="35" fill="%23999"/%3E%3Cpath d="M100 120 Q50 140 40 200 L160 200 Q150 140 100 120 Z" fill="%23999"/%3E%3C/svg%3E',
    avatarLabel: '',
  };

  onAvatarChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0] ? input.files[0] : null;
    if (!file) return;
    this.model.avatarFile = file;
    this.model.avatarLabel = file.name;
    const reader = new FileReader();
    reader.onload = () => (this.model.avatarUrl = String(reader.result || this.model.avatarUrl));
    reader.readAsDataURL(file);
  }

  avatarPreview() {
    return this.model.avatarUrl;
  }

  avatarName() {
    return this.model.avatarLabel;
  }

  formValido() {
    return (
      this.model.nombre.trim().length > 0 &&
      this.model.apellido.trim().length > 0 &&
      /\S+@\S+\.\S+/.test(this.model.email) &&
      this.model.telefono.trim().length > 0 &&
      this.model.rol.trim().length > 0
    );
  }

  cancelar() {
    this.router.navigate(['/dashboard/user']);
  }

  crear() {
    if (!this.formValido()) return;
    console.log('Crear usuario:', this.model);
    this.router.navigate(['/dashboard/user']);
  }
}
