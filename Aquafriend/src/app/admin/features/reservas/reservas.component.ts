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
  selected: Reserva | null = null;
  saving = false;

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
    this.selected = reserva;
  }

  cerrarDetalle(): void {
    this.selected = null;
  }

  actualizarEstado(estado: 'pendiente' | 'confirmada' | 'cancelada') {
    if (!this.selected) return;
    this.saving = true;
    this.reservaSvc.actualizarEstado(this.selected.id_reserva, estado).subscribe({
      next: (res) => {
        this.saving = false;
        if (res?.success) {
          // Actualizar en memoria y recargar métricas
          this.selected!.estado = estado.charAt(0).toUpperCase() + estado.slice(1);
        } else {
          this.error = res?.message || 'No se pudo actualizar el estado';
        }
      },
      error: () => {
        this.saving = false;
        this.error = 'Error al actualizar el estado.';
      }
    });
  }

  eliminarSeleccionada() {
    if (!this.selected) return;
    const id = this.selected.id_reserva;
    this.saving = true;
    this.reservaSvc.eliminarReserva(id).subscribe({
      next: (res) => {
        this.saving = false;
        if (res?.success) {
          this.reservas = this.reservas.filter(r => r.id_reserva !== id);
          this.cerrarDetalle();
        } else {
          this.error = res?.message || 'No se pudo eliminar la reserva';
        }
      },
      error: () => {
        this.saving = false;
        this.error = 'Error al eliminar la reserva.';
      }
    });
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

  descargarExcel() {
    if (!this.reservas.length) {
      alert('No hay reservas para exportar.');
      return;
    }

    const escapeCell = (value?: string | number | null) =>
      value === undefined || value === null
        ? ''
        : String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const header = [
      'ID',
      'Escuela',
      'Programa',
      'Fecha',
      'Estudiantes',
      'Total',
      'Estado',
      'Profesor',
      'Teléfono'
    ];

    const thead = `<tr>${header.map(h => `<th>${h}</th>`).join('')}</tr>`;
    const tbody = this.reservas.map(r => {
      const fecha = r.fecha_reserva ? new Date(r.fecha_reserva).toLocaleDateString('es-CL') : '';
      const profesor = [r.profesor_nombre, r.profesor_apellido].filter(Boolean).join(' ').trim();
      return `<tr>
        <td>${escapeCell(r.id_reserva)}</td>
        <td>${escapeCell(r.escuela)}</td>
        <td>${escapeCell(r.programa)}</td>
        <td>${escapeCell(fecha)}</td>
        <td>${escapeCell(r.cantidad_estudiantes)}</td>
        <td>${escapeCell(this.formatMoneda(r.total_pagar))}</td>
        <td>${escapeCell(r.estado)}</td>
        <td>${escapeCell(profesor)}</td>
        <td>${escapeCell(r.profesor_telefono)}</td>
      </tr>`;
    }).join('');

    const table = `<table><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
    const blob = new Blob(['\ufeff' + table], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reservas_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
