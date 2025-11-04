import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from './users.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private auth = inject(AuthService);

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  cargando = false;

  mostrarModalEditar = false;
  usuarioEditando: Usuario | null = null;

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.usuarioService.obtenerTodos().subscribe({
      next: (list: Usuario[]) => {
        this.usuarios = list ?? [];
        this.usuariosFiltrados = [...this.usuarios];
        this.cargando = false;
      },
      error: () => (this.cargando = false)
    });
  }

  trackById = (_: number, u: Usuario) => u.id_usuario ?? -1;

  nuevoUsuario(): void {
    this.router.navigate(['/dashboard/user/crear']);
  }

  changeEstado(usuario: Usuario, checked: boolean): void {
    if (!usuario.id_usuario) return;
    const previo = usuario.activo;
    usuario.activo = checked ? 1 : 0;
    this.usuarioService.actualizar(usuario.id_usuario, { activo: usuario.activo }).subscribe({
      next: (resp) => {
        if (!resp?.success) usuario.activo = previo;
      },
      error: () => {
        usuario.activo = previo;
      }
    });
  }

  editarUsuario(usuario: Usuario): void {
    if (!usuario.id_usuario) return;
    this.router.navigate(['/dashboard/user', usuario.id_usuario, 'editar']);
  }

  eliminarUsuario(usuario: Usuario): void {
    if (!usuario.id_usuario) return;
    if (!confirm('¿Eliminar este usuario?')) return;
    this.cargando = true;
    this.usuarioService.eliminar(usuario.id_usuario).subscribe({
      next: () => {
        this.cargarUsuarios();
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.usuarioEditando = null;
  }

  guardarEdicion(): void {
    if (!this.usuarioEditando?.id_usuario) return;
    const id = this.usuarioEditando.id_usuario;
    const data: Partial<Usuario> = {
      nombre: this.usuarioEditando.nombre,
      apellido: this.usuarioEditando.apellido,
      email: this.usuarioEditando.email,
      role: this.usuarioEditando.role,
      role_id: this.usuarioEditando.role_id,
      activo: this.usuarioEditando.activo
    };
    this.cargando = true;
    this.usuarioService.actualizar(id, data).subscribe({
      next: (resp) => {
        if (resp?.success && resp.data) {
          const idx = this.usuarios.findIndex(x => x.id_usuario === id);
          if (idx > -1) this.usuarios[idx] = { ...this.usuarios[idx], ...resp.data };
          this.usuariosFiltrados = [...this.usuarios];
          const curr = this.auth.currentUserValue;
          if (curr && curr.id === resp.data.id_usuario) {
            this.auth.updateCurrentUserPartial({
              nombre: resp.data.nombre,
              apellido: resp.data.apellido,
              email: resp.data.email,
              role: resp.data.role as any
            });
          }
        }
        this.cerrarModalEditar();
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  filtrar(term: string): void {
    const t = (term ?? '').toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(u =>
      [u.nombre, u.apellido, u.email, u.role].some(v => (v ?? '').toLowerCase().includes(t))
    );
  }
}
