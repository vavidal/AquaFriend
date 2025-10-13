import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">📬 Contactos</h2>
          <p class="text-muted mb-0">Mensajes recibidos desde el formulario de contacto</p>
        </div>
        <button class="btn btn-primary" (click)="cargarContactos()">
          <i class="bi bi-arrow-clockwise"></i> Actualizar
        </button>
      </div>

      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="btn-group" role="group">
            <button
              type="button"
              class="btn"
              [class.btn-primary]="filtro === 'todos'"
              [class.btn-outline-primary]="filtro !== 'todos'"
              (click)="cambiarFiltro('todos')">
              Todos ({{ contactos.length }})
            </button>
            <button
              type="button"
              class="btn"
              [class.btn-warning]="filtro === 'no-leidos'"
              [class.btn-outline-warning]="filtro !== 'no-leidos'"
              (click)="cambiarFiltro('no-leidos')">
              No leídos ({{ contactosNoLeidos.length }})
            </button>
            <button
              type="button"
              class="btn"
              [class.btn-success]="filtro === 'leidos'"
              [class.btn-outline-success]="filtro !== 'leidos'"
              (click)="cambiarFiltro('leidos')">
              Leídos ({{ contactosLeidos.length }})
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Lista de contactos -->
      <div *ngIf="!loading && contactosFiltrados.length > 0" class="row g-3">
        <div *ngFor="let contacto of contactosFiltrados" class="col-12 col-lg-6">
          <div class="card h-100" [class.border-warning]="!contacto.leido">
            <div class="card-body">
              <!-- Header del contacto -->
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="card-title mb-1">
                    {{ contacto.nombre }}
                    <span *ngIf="!contacto.leido" class="badge bg-warning ms-2">Nuevo</span>
                  </h5>
                  <p class="text-muted small mb-0">
                    <i class="bi bi-calendar"></i> {{ contacto.fecha_contacto | date:'dd/MM/yyyy HH:mm' }}
                  </p>
                </div>
                <button
                  *ngIf="!contacto.leido"
                  class="btn btn-sm btn-outline-success"
                  (click)="marcarComoLeido(contacto.id_contacto)">
                  <i class="bi bi-check-circle"></i> Marcar leído
                </button>
              </div>

              <!-- Información de contacto -->
              <div class="mb-3">
                <div class="mb-2">
                  <i class="bi bi-envelope text-primary"></i>
                  <a [href]="'mailto:' + contacto.email" class="ms-2">{{ contacto.email }}</a>
                </div>
                <div *ngIf="contacto.telefono" class="mb-2">
                  <i class="bi bi-telephone text-success"></i>
                  <a [href]="'tel:' + contacto.telefono" class="ms-2">{{ contacto.telefono }}</a>
                </div>
              </div>

              <!-- Mensaje -->
              <div *ngIf="contacto.mensaje" class="alert alert-light mb-0">
                <strong>Mensaje:</strong><br>
                {{ contacto.mensaje }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sin contactos -->
      <div *ngIf="!loading && contactosFiltrados.length === 0" class="text-center py-5">
        <i class="bi bi-inbox display-1 text-muted"></i>
        <p class="text-muted mt-3">No hay contactos {{ filtro === 'no-leidos' ? 'pendientes' : filtro === 'leidos' ? 'leídos' : '' }}</p>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .border-warning {
      border-left: 4px solid #ffc107 !important;
    }

    .alert-light {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
    }
  `]
})
export class ContactosComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/contactos';

  contactos: Contacto[] = [];
  loading = false;
  error = '';
  filtro: 'todos' | 'leidos' | 'no-leidos' = 'todos';

  ngOnInit() {
    this.cargarContactos();
  }

  cargarContactos() {
    this.loading = true;
    this.error = '';

    this.http.get<ContactosResponse>(this.apiUrl).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.contactos = response.data;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al cargar los contactos. Verifica que el servidor esté corriendo.';
        console.error('Error al cargar contactos:', err);
      }
    });
  }

  marcarComoLeido(id: number) {
    this.http.patch(`${this.apiUrl}/${id}/leido`, {}).subscribe({
      next: () => {
        // Actualizar el contacto en la lista local
        const contacto = this.contactos.find(c => c.id_contacto === id);
        if (contacto) {
          contacto.leido = true;
        }
      },
      error: (err) => {
        console.error('Error al marcar como leído:', err);
        this.error = 'Error al marcar el contacto como leído';
      }
    });
  }

  cambiarFiltro(filtro: 'todos' | 'leidos' | 'no-leidos') {
    this.filtro = filtro;
  }

  get contactosFiltrados(): Contacto[] {
    if (this.filtro === 'leidos') {
      return this.contactos.filter(c => c.leido);
    } else if (this.filtro === 'no-leidos') {
      return this.contactos.filter(c => !c.leido);
    }
    return this.contactos;
  }

  get contactosLeidos(): Contacto[] {
    return this.contactos.filter(c => c.leido);
  }

  get contactosNoLeidos(): Contacto[] {
    return this.contactos.filter(c => !c.leido);
  }
}
