import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type Usuario = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol?: string;
  telefono?: string;
  direccion?: string;
  avatar?: string;
};

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  templateUrl: './admins.html',
  styleUrls: ['./admins.scss'],
})
export class Admins {
  private router = inject(Router);

  q = signal('');

  private data = signal<Usuario[]>([
    {
      id: 1,
      nombre: 'Admin',
      apellido: 'Principal',
      email: 'cardenas.nayxreth@gmail.com',
      rol: 'Administrador',
      telefono: '1234567890',
      direccion: 'Calle 123',
      avatar: '',
    },
    {
      id: 2,
      nombre: 'Admin',
      apellido: 'Secundario',
      email: 'admin123@gmail.com',
      rol: 'Editor',
      telefono: '987654321',
      direccion: 'Av. 456',
      avatar: '',
    },
  ]);

  usuarios = computed(() => {
    const term = this.q().toLowerCase().trim();
    if (!term) return this.data();
    return this.data().filter(u =>
      `${u.nombre} ${u.apellido} ${u.email} ${u.rol ?? ''}`.toLowerCase().includes(term)
    );
  });

  trackById(_: number, u: Usuario) { return u.id; }

  abrirFiltros() {}

  crearUsuario() {}

  avatarDe(u: Usuario) {
    return u.avatar && u.avatar.trim() ? u.avatar : 'assets/avatar-placeholder.png';
  }
}
