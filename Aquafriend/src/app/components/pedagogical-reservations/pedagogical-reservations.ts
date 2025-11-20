import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReservaService, ReservaRequest, ReservaResponse } from '../../services/reserva.service';
import { ReservaCalendarComponent } from '../reserva-calendar/reserva-calendar';

@Component({
  selector: 'app-pedagogical-reservations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReservaCalendarComponent],
  templateUrl: './pedagogical-reservations.html',
  styleUrls: ['./pedagogical-reservations.scss']
})
export class PedagogicalReservationsComponent implements OnInit {
  reservaForm: FormGroup;
  enviandoReserva = false;
  successReserva = '';
  errorReserva = '';
  regiones: string[] = [
    'Arica y Parinacota',
    'Tarapacá',
    'Antofagasta',
    'Atacama',
    'Coquimbo',
    'Valparaíso',
    'Metropolitana de Santiago',
    "O'Higgins",
    'Maule',
    'Ñuble',
    'Biobío',
    'La Araucanía',
    'Los Ríos',
    'Los Lagos',
    'Aysén',
    'Magallanes y de la Antártica Chilena'
  ];

  private readonly reservaSvc = inject(ReservaService);
  fechasOcupadas: string[] = [];

  constructor(private fb: FormBuilder) {
    this.reservaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(60)]],
      apellido: ['', [Validators.required, Validators.maxLength(60)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{8,15}$/)]],
      institucion: ['', [Validators.required, Validators.maxLength(120)]],
      direccion: ['', [Validators.required, Validators.maxLength(140)]],
      region: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      programa: ['', Validators.required],
      fecha: ['', Validators.required],
      personas: [null, [Validators.required, Validators.min(1)]],
      comentarios: ['']
    });
  }

  ngOnInit(): void {
    this.reservaSvc.obtenerFechasOcupadas().subscribe({
      next: resp => {
        this.fechasOcupadas = resp?.data ?? [];
      },
      error: err => {
        console.warn('No se pudieron obtener las fechas ocupadas', err);
      }
    });
  }

  onReservaSubmit(): void {
    this.successReserva = '';
    this.errorReserva = '';

    if (this.reservaForm.invalid) {
      this.errorReserva = 'Completa los campos requeridos.';
      return;
    }

    const payload: ReservaRequest = {
      nombre: this.reservaForm.value.nombre,
      apellido: this.reservaForm.value.apellido,
      telefono: this.reservaForm.value.telefono,
      institucion: this.reservaForm.value.institucion,
      correo: this.reservaForm.value.correo,
      programa: this.reservaForm.value.programa,
      fecha: this.reservaForm.value.fecha,
      personas: this.reservaForm.value.personas,
      comentarios: this.reservaForm.value.comentarios || ''
    } as ReservaRequest;

    this.enviandoReserva = true;

    this.reservaSvc.crearReserva(payload).subscribe({
      next: (res: ReservaResponse) => {
        this.enviandoReserva = false;
        if (res?.success) {
          this.successReserva = 'Solicitud enviada correctamente. Te contactaremos por correo para coordinar tu visita.';
          this.reservaForm.reset();
        } else {
          this.errorReserva = res?.message || 'No fue posible crear la reserva.';
        }
      },
      error: (err) => {
        console.error('Error al crear reserva', err);
        this.enviandoReserva = false;
        this.errorReserva = 'Error de conexión. Verifica que el servidor esté corriendo.';
      }
    });
  }
}
