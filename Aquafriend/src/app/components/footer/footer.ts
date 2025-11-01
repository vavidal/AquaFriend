import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService, ContactoFooterRequest } from '../../services/contact.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  private contactService = inject(ContactService);

  // Modelo del formulario
  contacto: ContactoFooterRequest = {
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  };

  // Estados
  enviando = false;
  mensajeExito = '';
  mensajeError = '';

  onSubmit() {
    // Limpiar mensajes previos
    this.mensajeExito = '';
    this.mensajeError = '';

    // Validación básica
    if (!this.contacto.nombre || !this.contacto.email) {
      this.mensajeError = 'Por favor completa todos los campos obligatorios';
      return;
    }

    this.enviando = true;

    this.contactService.enviarContactoFooter(this.contacto).subscribe({
      next: (response) => {
        this.enviando = false;
        if (response.success) {
          this.mensajeExito = response.message || '¡Gracias por contactarnos! Te responderemos pronto.';
          // Limpiar formulario
          this.contacto = {
            nombre: '',
            email: '',
            telefono: '',
            mensaje: ''
          };
        } else {
          this.mensajeError = response.message || 'Error al enviar el mensaje';
        }
      },
      error: (err) => {
        console.error('Error al enviar contacto:', err);
        this.enviando = false;
        this.mensajeError = 'Error de conexión. Verifica que el servidor esté corriendo.';
      }
    });
  }
}
