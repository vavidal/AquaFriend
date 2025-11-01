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
      error: () => {
        this.loading = false;
        this.error = 'No se pudieron cargar las reservas. Verifica que el servidor esté corriendo.';
      }
    });
  }

  verReserva(reserva: Reserva): void {
    console.log('ver', reserva);
  }

  trackById(_: number, r: Reserva) {
    return r?.id_reserva ?? _;
  }

  getEstadoClass(estado: string): string {
    const e = estado?.toLowerCase();
    if (e === 'pendiente') return 'badge bg-warning text-dark';
    if (e === 'confirmada') return 'badge bg-success';
    if (e === 'cancelada') return 'badge bg-danger';
    return 'badge bg-info';
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatMoneda(monto: number): string {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(monto);
  }

  get totalReservas(): number {
    return this.reservas.length;
  }

  get reservasPendientes(): number {
    return this.reservas.filter(r => r.estado?.toLowerCase() === 'pendiente').length;
  }

  get reservasConfirmadas(): number {
    return this.reservas.filter(r => r.estado?.toLowerCase() === 'confirmada').length;
  }

  get totalEstudiantes(): number {
    return this.reservas.reduce((sum, r) => sum + (r.cantidad_estudiantes || 0), 0);
  }
}
