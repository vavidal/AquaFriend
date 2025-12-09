import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

interface Contacto {
  id_contacto: number;
  nombre: string;
  email: string;
  telefono?: string;
  mensaje?: string;
  fecha_contacto: string;
  leido: boolean;
}

interface ContactosResponse {
  success: boolean;
  data: Contacto[];
}

@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './contactos.html',
  styleUrls: ['./contactos.css'],
})
export class ContactosComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/contactos';

  contactos: Contacto[] = [];
  loading = false;
  error = '';
  filtro: 'todos' | 'leidos' | 'no-leidos' = 'todos';
  selected: Contacto | null = null;
  detalleAbierto = false;

  ngOnInit(): void {
    this.cargarContactos();
  }

  cargarContactos(): void {
    this.loading = true;
    this.error = '';
    this.http.get<ContactosResponse>(this.apiUrl).subscribe({
      next: (response) => {
        this.loading = false;
        if (response?.success && Array.isArray(response.data)) {
          this.contactos = response.data;
        } else {
          this.error = 'Respuesta inesperada del servidor.';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar los contactos. Verifica que el servidor esta corriendo.';
      },
    });
  }

  marcarComoLeido(id: number): void {
    this.http.patch(`${this.apiUrl}/${id}/leido`, {}).subscribe({
      next: () => {
        const c = this.contactos.find((x) => x.id_contacto === id);
        if (c) c.leido = true;
        if (this.selected?.id_contacto === id) {
          this.selected = { ...this.selected, leido: true };
        }
      },
      error: () => {
        this.error = 'Error al marcar el contacto como leido.';
      },
    });
  }

  verDetalle(c: Contacto): void {
    this.selected = c;
    this.detalleAbierto = true;
  }

  cerrarDetalle(): void {
    this.detalleAbierto = false;
    this.selected = null;
  }

  eliminar(c: Contacto): void {
    const id = c.id_contacto;
    this.error = '';
    this.eliminarContactoRequest(id).subscribe({
      next: () => {
        this.contactos = this.contactos.filter((x) => x.id_contacto !== id);
        if (this.selected?.id_contacto === id) this.cerrarDetalle();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al eliminar el contacto.';
      },
    });
  }

  cambiarFiltro(f: 'todos' | 'leidos' | 'no-leidos'): void {
    this.filtro = f;
  }

  get contactosFiltrados(): Contacto[] {
    if (this.filtro === 'leidos') return this.contactos.filter((c) => c.leido);
    if (this.filtro === 'no-leidos') return this.contactos.filter((c) => !c.leido);
    return this.contactos;
  }

  get contactosLeidos(): Contacto[] {
    return this.contactos.filter((c) => c.leido);
  }

  get contactosNoLeidos(): Contacto[] {
    return this.contactos.filter((c) => !c.leido);
  }

  onRefresh(): void {
    this.cargarContactos();
  }

  trackById(_: number, c: Contacto): number {
    return c.id_contacto;
  }

  private eliminarContactoRequest(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        if (error?.status === 404 || error?.status === 405) {
          return this.http.post(`${this.apiUrl}/${id}/eliminar`, {}).pipe(
            catchError((fallbackError) => {
              if (fallbackError?.status === 404 || fallbackError?.status === 405) {
                return this.http.post(`${this.apiUrl}/eliminar`, {
                  id_contacto: id,
                  id,
                });
              }
              return throwError(() => fallbackError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
