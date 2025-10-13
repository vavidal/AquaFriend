import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, Role } from './usuario.service';

type UserForm = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  rol: string;
  role_id: number;
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
export class CreateAccountComponent implements OnInit {
  roles: Role[] = [];
  cargando = false;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  model: UserForm = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    rol: 'Administrador',
    role_id: 1,
    avatarFile: null,
    avatarUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Ccircle cx="100" cy="100" r="100" fill="%23ddd"/%3E%3Ccircle cx="100" cy="80" r="35" fill="%23999"/%3E%3Cpath d="M100 120 Q50 140 40 200 L160 200 Q150 140 100 120 Z" fill="%23999"/%3E%3C/svg%3E',
    avatarLabel: '',
  };

  ngOnInit() {
    this.cargarRoles();
  }

  cargarRoles() {
    this.usuarioService.obtenerRoles().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.roles = response.data;
          if (this.roles.length > 0) {
            this.model.role_id = this.roles[0].id_role;
            this.model.rol = this.roles[0].nombre;
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        alert('Error al cargar los roles disponibles');
      }
    });
  }

  onRoleChange() {
    const roleSeleccionado = this.roles.find(r => r.id_role === this.model.role_id);
    if (roleSeleccionado) {
      this.model.rol = roleSeleccionado.nombre;
    }
  }

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
      this.model.password.trim().length >= 6 &&
      this.model.role_id > 0
    );
  }

  cancelar() {
    this.router.navigate(['/dashboard/user']);
  }

  crear() {
    if (!this.formValido() || this.cargando) return;

    this.cargando = true;

    const nuevoUsuario = {
      nombre: this.model.nombre,
      apellido: this.model.apellido,
      email: this.model.email,
      password: this.model.password,
      role_id: this.model.role_id,
      role: this.model.rol
    };

    this.usuarioService.crear(nuevoUsuario).subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.success) {
          alert('Usuario creado exitosamente');
          this.router.navigate(['/dashboard/user']);
        } else {
          alert(response.message || 'Error al crear usuario');
        }
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error al crear usuario:', error);
        alert(error.error?.message || 'Error al crear usuario. Por favor, intente nuevamente.');
      }
    });
  }
}
