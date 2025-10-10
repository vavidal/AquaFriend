import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContactService, ContactRequest } from '../../services/contact.service';

declare const bootstrap: any; // API JS de Bootstrap 5

type GalleryItem = { src: string; title: string; text?: string };

@Component({
  selector: 'app-main-body',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './main-body.html',
  styleUrl: './main-body.css'
})
export class MainBody {
  // ===== GALERÍA =====
  private readonly nums = [1, 2, 3, 4, 5, 10, 13, 15, 16, 17, 19, 20, 21];

  private readonly titles: Record<number, string> = {
    1: 'Vista Barco del Acuario',
    2: 'Puesto de Comida',
    3: 'Entrada al Acuario',
    4: 'Vista al Lago',
    5: 'Estación Meteorológica',
    10:'Molino de Agua',
    13:'Vista Barco del Acuario',
    15:'Camping',
    16:'Lago Artificial (Coto de Pesca)',
    17:'Criadero de Peces',
  };

  images: GalleryItem[] = this.nums.map((n) => ({
    src: `assets/img/${n}.jpg`,
    title: this.titles[n] || `Imagen ${n}`,
  }));

  selectedIndex = 0;

  openGallery(index: number) {
    this.selectedIndex = index;

    const modalEl = document.getElementById('galleryModal');
    if (!modalEl) return;

    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();

    setTimeout(() => {
      const carouselEl = document.getElementById('galleryCarousel');
      if (!carouselEl) return;

      const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
        interval: false,
        ride: false,
        wrap: true,
      });
      carousel.to(index);
    }, 50);
  }

  // ===== INYECCIONES =====
  private fb = inject(FormBuilder);
  private contactSvc = inject(ContactService);

  // ===== FORMULARIO DE CONTACTO GENERAL =====
  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    date: [''],
    people: [2, [Validators.min(1)]],
    message: [''],
  });

  sending = false;
  success: string | null = null;
  error: string | null = null;

  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    this.success = this.error = null;

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const payload = this.contactForm.value as ContactRequest;
    this.sending = true;

    this.contactSvc.sendRequest(payload).subscribe({
      next: () => {
        this.sending = false;
        this.success = 'Solicitud enviada ✅ Revisa tu correo, te avisaremos pronto.';
        this.contactForm.reset({ people: 2 });
      },
      error: (err) => {
        console.error(err);
        this.sending = false;
        this.error = 'No pudimos enviar tu solicitud. Intenta nuevamente más tarde.';
      },
    });
  }

  // ===== FORMULARIO DE RESERVA EDUCATIVA =====
  reservaForm = this.fb.group({
    institucion: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    programa: ['', Validators.required],
    fecha: ['', Validators.required],
    personas: [1, [Validators.required, Validators.min(1)]],
    comentarios: [''],
  });

  enviandoReserva = false;
  successReserva: string | null = null;
  errorReserva: string | null = null;

  get fr() {
    return this.reservaForm.controls;
  }

  onReservaSubmit() {
    this.successReserva = this.errorReserva = null;

    if (this.reservaForm.invalid) {
      this.reservaForm.markAllAsTouched();
      return;
    }

    // extraemos valores (pueden ser null según el tipo, por eso usamos ?? para asegurar strings/números)
    const r = this.reservaForm.value as {
      institucion: string | null;
      correo: string | null;
      programa: string | null;
      fecha: string | null;
      personas: number | null;
      comentarios: string | null;
    };

    // mapeamos a la forma que espera ContactRequest
    const payload: ContactRequest = {
      name: r.institucion ?? 'Institución sin nombre',
      email: r.correo ?? '',
      date: r.fecha ?? '',
      people: r.personas ?? 1,
      message:
        `Reserva educativa\nPrograma: ${r.programa ?? '-'}\n` +
        `Fecha tentativa: ${r.fecha ?? '-'}\n` +
        `Personas: ${r.personas ?? '-'}\n\n` +
        `Comentarios:\n${r.comentarios ?? '-'}`,
    };

    this.enviandoReserva = true;

    this.contactSvc.sendRequest(payload).subscribe({
      next: () => {
        this.enviandoReserva = false;
        this.successReserva = 'Reserva enviada ✅ Te contactaremos para confirmar la fecha.';
        this.reservaForm.reset({ personas: 1 });
      },
      error: (err) => {
        console.error(err);
        this.enviandoReserva = false;
        this.errorReserva = 'No pudimos enviar tu reserva. Intenta nuevamente más tarde.';
      },
    });
  }
}
