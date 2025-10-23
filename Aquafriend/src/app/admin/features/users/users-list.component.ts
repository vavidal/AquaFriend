import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from './usuario.service';

type ApiResponse<T> = { success: boolean; data?: T; message?: string };

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  cargando = false;
  usuarioEditando: Usuario | null = null;
  mostrarModalEditar = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  private isApiResponseArray(payload: unknown): payload is ApiResponse<Usuario[]> {
    return typeof payload === 'object' && payload !== null && 'success' in payload;
  }

  private isApiResponseOne(payload: unknown): payload is ApiResponse<Usuario> {
    return typeof payload === 'object' && payload !== null && 'success' in payload;
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.obtenerTodos().subscribe({
      next: (resp: unknown) => {
        this.cargando = false;
        if (Array.isArray(resp)) {
          this.usuarios = resp;
          this.usuariosFiltrados = resp;
          return;
        }
        if (this.isApiResponseArray(resp) && resp.success && Array.isArray(resp.data)) {
          this.usuarios = resp.data;
          this.usuariosFiltrados = resp.data;
          return;
        }
        this.usuarios = [];
        this.usuariosFiltrados = [];
      },
      error: () => {
        this.cargando = false;
        alert('Error al cargar usuarios');
      }
    });
  }

  nuevoUsuario() {
    this.router.navigate(['/dashboard/user/crear']);
  }

  editarUsuario(usuario: Usuario) {
    this.usuarioEditando = { ...usuario };
    this.mostrarModalEditar = true;
  }

  guardarEdicion() {
    if (!this.usuarioEditando || !this.usuarioEditando.id_usuario) return;
    this.cargando = true;
    const datosActualizar: Partial<Usuario> = {
      nombre: this.usuarioEditando.nombre,
      apellido: this.usuarioEditando.apellido,
      email: this.usuarioEditando.email,
      role_id: this.usuarioEditando.role_id,
      activo: this.usuarioEditando.activo
    };
    this.usuarioService.actualizar(this.usuarioEditando.id_usuario, datosActualizar).subscribe({
      next: (resp: unknown) => {
        this.cargando = false;
        if (this.isApiResponseOne(resp) && resp.success && resp.data) {
          const idx = this.usuarios.findIndex(u => u.id_usuario === resp.data!.id_usuario);
          if (idx !== -1) this.usuarios[idx] = resp.data!;
          this.usuariosFiltrados = [...this.usuarios];
          alert('Usuario actualizado exitosamente');
          this.cerrarModalEditar();
          return;
        }
        alert((this.isApiResponseOne(resp) && resp.message) || 'Error al actualizar usuario');
      },
      error: (error) => {
        this.cargando = false;
        alert(error?.error?.message || 'Error al actualizar usuario');
      }
    });
  }

  changeEstado(usuario: Usuario, activo: boolean) {
    if (!usuario.id_usuario) return;
    const previo = usuario.activo;
    usuario.activo = activo ? 1 : 0;
    this.usuarioService.actualizar(usuario.id_usuario, { activo: usuario.activo } as Partial<Usuario>).subscribe({
      next: (resp: unknown) => {
        if (this.isApiResponseOne(resp) && resp.success && resp.data) {
          const idx = this.usuarios.findIndex(u => u.id_usuario === resp.data!.id_usuario);
          if (idx !== -1) this.usuarios[idx] = resp.data!;
          this.usuariosFiltrados = [...this.usuarios];
        } else {
          usuario.activo = previo;
          alert((this.isApiResponseOne(resp) && resp.message) || 'No se pudo cambiar el estado');
        }
      },
      error: () => {
        usuario.activo = previo;
        alert('Error al cambiar el estado');
      }
    });
  }

  eliminarUsuario(usuario: Usuario) {
    if (!usuario.id_usuario) return;
    const ok = confirm(`¿Está seguro de eliminar a ${usuario.nombre} ${usuario.apellido}?`);
    if (!ok) return;
    this.cargando = true;
    this.usuarioService.eliminar(usuario.id_usuario).subscribe({
      next: (resp: unknown) => {
        this.cargando = false;
        if ((this.isApiResponseOne(resp) && resp.success) || (typeof resp === 'object' && resp !== null && (resp as any).success)) {
          this.usuarios = this.usuarios.filter(u => u.id_usuario !== usuario.id_usuario);
          this.usuariosFiltrados = [...this.usuarios];
          alert('Usuario eliminado exitosamente');
        } else {
          alert((this.isApiResponseOne(resp) && resp.message) || 'Error al eliminar usuario');
        }
      },
      error: () => {
        this.cargando = false;
        alert('Error al eliminar usuario');
      }
    });
  }

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
    this.usuarioEditando = null;
  }

  getEstadoBadge(activo: number | undefined): string {
    return activo ? 'activo' : 'inactivo';
  }

  getEstadoTexto(activo: number | undefined): string {
    return activo ? 'Activo' : 'Inactivo';
  }
}
