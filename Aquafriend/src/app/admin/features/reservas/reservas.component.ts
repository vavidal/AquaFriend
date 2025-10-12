import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService, Reserva } from '../../../services/reserva.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  private reservaSvc = inject(ReservaService);

  reservas: Reserva[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit() {
    this.cargarReservas();
  }

  cargarReservas() {
    this.loading = true;
    this.error = null;

    this.reservaSvc.obtenerReservas().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.reservas = response.data;
        } else {
          this.error = response.message || 'Error al cargar reservas';
        }
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.loading = false;
        this.error = 'No se pudieron cargar las reservas. Verifica que el servidor esté corriendo.';
      }
    });
  }

  getEstadoClass(estado: string): string {
    const estadoLower = estado.toLowerCase();
    if (estadoLower === 'pendiente') return 'badge bg-warning text-dark';
    if (estadoLower === 'confirmada') return 'badge bg-success';
    if (estadoLower === 'cancelada') return 'badge bg-danger';
    if (estadoLower === 'completada') return 'badge bg-secondary';
    return 'badge bg-info';
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatMoneda(monto: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(monto);
  }

  // Getters para estadísticas
  get totalReservas(): number {
    return this.reservas.length;
  }

  get reservasPendientes(): number {
    return this.reservas.filter(r => r.estado.toLowerCase() === 'pendiente').length;
  }

  get reservasConfirmadas(): number {
    return this.reservas.filter(r => r.estado.toLowerCase() === 'confirmada').length;
  }

  get totalEstudiantes(): number {
    return this.reservas.reduce((sum, r) => sum + r.cantidad_estudiantes, 0);
  }
}
