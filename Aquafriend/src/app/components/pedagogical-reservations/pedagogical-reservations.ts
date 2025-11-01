import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pedagogical-reservations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  ngOnInit(): void {}

  onReservaSubmit(): void {
    if (this.reservaForm.invalid) {
      this.errorReserva = 'Completa los campos requeridos.';
      this.successReserva = '';
      return;
    }
    this.enviandoReserva = true;
    this.errorReserva = '';
    setTimeout(() => {
      this.enviandoReserva = false;
      this.successReserva = 'Solicitud enviada. Te contactaremos por correo.';
      this.reservaForm.reset();
    }, 1000);
  }
}
