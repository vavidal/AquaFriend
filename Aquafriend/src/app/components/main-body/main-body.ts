import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContactService, ContactRequest } from '../../services/contact.service';
import { ReservaService, ReservaRequest } from '../../services/reserva.service';

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

  // Paginación de galería
  itemsPerPage = 6;
  currentPage = 0;

  get totalPages(): number {
    return Math.ceil(this.images.length / this.itemsPerPage);
  }

  get visibleImages(): GalleryItem[] {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.images.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

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

  // ===== HERO VIDEO (lazy load) =====
  ngAfterViewInit() {
    // Evitar ejecutar en SSR
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const video = document.getElementById('heroVideo') as HTMLVideoElement | null;
    if (!video) return;

    const source = video.querySelector('source') as HTMLSourceElement | null;
    if (!source) return;

    const loadVideo = () => {
      if (!source.src) {
        const ds = (source as any).dataset?.src as string | undefined;
        if (ds) source.src = ds;
      }
      // Forzar carga y reproducción cuando esté listo
      video.load();
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => {/* algunos navegadores bloquean, ignorar */});
      }
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            loadVideo();
            obs.disconnect();
          }
        });
      }, { rootMargin: '200px 0px' });
      io.observe(video);
    } else {
      // Fallback
      loadVideo();
    }
  }

  // ===== INYECCIONES =====
  private fb = inject(FormBuilder);
  private contactSvc = inject(ContactService);
  private reservaSvc = inject(ReservaService);

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

    const payload: ReservaRequest = {
      institucion: this.reservaForm.value.institucion ?? '',
      correo: this.reservaForm.value.correo ?? '',
      programa: this.reservaForm.value.programa ?? '',
      fecha: this.reservaForm.value.fecha ?? '',
      personas: this.reservaForm.value.personas ?? 1,
      comentarios: this.reservaForm.value.comentarios ?? ''
    };

    this.enviandoReserva = true;

    this.reservaSvc.crearReserva(payload).subscribe({
      next: (response) => {
        this.enviandoReserva = false;
        if (response.success) {
          this.successReserva = `Reserva creada exitosamente ✅ Total a pagar: $${response.data?.total_pagar}`;
          this.reservaForm.reset({ personas: 1 });
        } else {
          this.errorReserva = response.message || 'Error al crear la reserva';
        }
      },
      error: (err) => {
        console.error(err);
        this.enviandoReserva = false;
        this.errorReserva = 'No pudimos procesar tu reserva. Verifica que el servidor esté corriendo.';
      },
    });
  }
}
