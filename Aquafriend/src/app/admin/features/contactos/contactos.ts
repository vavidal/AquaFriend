import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Contacto {
  id_contacto: number;
  nombre: string;
  email: string;
  telefono?: string;
  mensaje?: string;
  fecha_contacto: string; // ISO string
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
      error: (err) => {
        this.loading = false;
        this.error = 'Error al cargar los contactos. Verifica que el servidor esté corriendo.';
        console.error('Error al cargar contactos:', err);
      },
    });
  }

  marcarComoLeido(id: number): void {
    this.http.patch(`${this.apiUrl}/${id}/leido`, {}).subscribe({
      next: () => {
        const c = this.contactos.find((x) => x.id_contacto === id);
        if (c) c.leido = true;
      },
      error: (err) => {
        console.error('Error al marcar como leído:', err);
        this.error = 'Error al marcar el contacto como leído.';
      },
    });
  }

  cambiarFiltro(filtro: 'todos' | 'leidos' | 'no-leidos'): void {
    this.filtro = filtro;
  }

  get contactosFiltrados(): Contacto[] {
    switch (this.filtro) {
      case 'leidos':
        return this.contactos.filter((c) => c.leido);
      case 'no-leidos':
        return this.contactos.filter((c) => !c.leido);
      default:
        return this.contactos;
    }
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
}
