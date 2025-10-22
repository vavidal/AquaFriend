import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from './usuario.service';

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
  busqueda = '';
  usuarioEditando: Usuario | null = null;
  mostrarModalEditar = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.obtenerTodos().subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.success && response.data) {
          this.usuarios = response.data;
          this.usuariosFiltrados = this.usuarios;
        }
      },
      error: () => {
        this.cargando = false;
        alert('Error al cargar usuarios');
      }
    });
  }

  filtrarUsuarios() {
    const termino = this.busqueda.toLowerCase().trim();
    if (termino === '') {
      this.usuariosFiltrados = this.usuarios;
    } else {
      this.usuariosFiltrados = this.usuarios.filter(usuario =>
        `${usuario.nombre} ${usuario.apellido}`.toLowerCase().includes(termino) ||
        usuario.email.toLowerCase().includes(termino) ||
        usuario.role.toLowerCase().includes(termino)
      );
    }
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
    const datosActualizar: any = {
      nombre: this.usuarioEditando.nombre,
      apellido: this.usuarioEditando.apellido,
      email: this.usuarioEditando.email,
      role_id: this.usuarioEditando.role_id,
      activo: this.usuarioEditando.activo
    };
    this.usuarioService.actualizar(this.usuarioEditando.id_usuario, datosActualizar).subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.success && response.data) {
          const index = this.usuarios.findIndex(u => u.id_usuario === response.data!.id_usuario);
          if (index !== -1) {
            this.usuarios[index] = response.data;
            this.filtrarUsuarios();
          }
          alert('Usuario actualizado exitosamente');
          this.cerrarModalEditar();
        } else {
          alert(response.message || 'Error al actualizar usuario');
        }
      },
      error: (error) => {
        this.cargando = false;
        alert(error.error?.message || 'Error al actualizar usuario');
      }
    });
  }

  refrescarLista() {
    this.busqueda = '';
    this.cargarUsuarios();
  }

  eliminarUsuario(usuario: Usuario) {
    if (!usuario.id_usuario) return;
    const confirmacion = confirm(
      `¿Está seguro de que desea eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`
    );
    if (!confirmacion) return;
    this.cargando = true;
    this.usuarioService.eliminar(usuario.id_usuario).subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.success) {
          alert('Usuario eliminado exitosamente');
          this.cargarUsuarios();
        } else {
          alert(response.message || 'Error al eliminar usuario');
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
