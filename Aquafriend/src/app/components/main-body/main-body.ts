import { Component, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContactService, ContactRequest } from '../../services/contact.service';
import { ReservaService, ReservaRequest } from '../../services/reserva.service';

declare const bootstrap: any;

type GalleryItem = { src: string; title: string; text?: string };

@Component({
  selector: 'app-main-body',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './main-body.html',
  styleUrls: ['./main-body.css']
})
export class MainBody implements AfterViewInit {
  images: GalleryItem[] = [
    { src: 'assets/img/_DSC5200.JPG', title: 'Pez en acuario' },
    { src: 'assets/img/_DSC5247.JPG', title: 'Interaccion' },
    { src: 'assets/img/_DSC6185.jpg', title: 'Visita jardin infaltil' },
    { src: 'assets/img/_DSC6217.jpg', title: 'Visita jardin infaltil' },
    { src: 'assets/img/_DSC6353.jpg', title: 'Visita jardin infaltil' },
    { src: 'assets/img/_DSC7319.JPG', title: 'Familia en barco' },
    { src: 'assets/img/_DSC7416.JPG', title: 'Pareja con bebe ' },
    { src: 'assets/img/_DSC7529.JPG', title: 'Dueño acuriario con estudiantes' },
    { src: 'assets/img/_DSC7581.JPG', title: 'Pareja con bebe' },
    { src: 'assets/img/_DSC7810.JPG', title: 'Vista estudiantes de Basica' },
    { src: 'assets/img/_DSC8299.JPG', title: 'Interaccion alumnos con tortuga' },
    { src: 'assets/img/_DSC8311.JPG', title: 'Granja conejo y aves' },
    { src: 'assets/img/_DSC8314.JPG', title: 'Gansos' },
    { src: 'assets/img/_DSC8338.JPG', title: 'Peces pequeños ' },
    { src: 'assets/img/_DSC8349.JPG', title: 'Visita educativa' },
    { src: 'assets/img/3.jpg', title: 'Vista acuario 2025' },
    { src: 'assets/img/4.jpg', title: 'Pesca recreativa' },
    { src: 'assets/img/5.jpg', title: 'Entrada acuario' },
    { src: 'assets/img/6.jpg', title: 'Interior acuario' },
    { src: 'assets/img/7.jpg', title: 'Chivos' },
    { src: 'assets/img/8.jpg', title: 'Molino de agua y pato' },
    { src: 'assets/img/9.jpg', title: 'Coto de pesca' },
    { src: 'assets/img/10.jpg', title: 'Molino de agua' },
    { src: 'assets/img/17.jpg', title: 'Criadero de peces' },
    { src: 'assets/img/19.jpg', title: 'Barco' },
    { src: 'assets/img/20.jpg', title: 'Moai' },
    { src: 'assets/img/21.jpg', title: 'Timon' },
    { src: 'assets/img/nh.png', title: 'Dueño del acuario con ternero' }
  ];

  selectedIndex = 0;
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

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 0) this.currentPage--;
  }

  openGallery(index: number): void {
    this.selectedIndex = index;
    const modalEl = document.getElementById('galleryModal');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
    setTimeout(() => {
      const carouselEl = document.getElementById('galleryCarousel');
      if (!carouselEl) return;
      const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl, { interval: false, ride: false, wrap: true });
      carousel.to(index);
    }, 50);
  }

  ngAfterViewInit(): void {
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
      video.load();
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === 'function') playPromise.catch(() => {});
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
      loadVideo();
    }
  }

  private fb = inject(FormBuilder);
  private contactSvc = inject(ContactService);
  private reservaSvc = inject(ReservaService);

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    date: [''],
    people: [2, [Validators.min(1)]],
    message: ['']
  });

  sending = false;
  success: string | null = null;
  error: string | null = null;

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
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
      error: () => {
        this.sending = false;
        this.error = 'No pudimos enviar tu solicitud. Intenta nuevamente más tarde.';
      }
    });
  }

  reservaForm = this.fb.group({
    institucion: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    programa: ['', Validators.required],
    fecha: ['', Validators.required],
    personas: [1, [Validators.required, Validators.min(1)]],
    comentarios: ['']
  });

  enviandoReserva = false;
  successReserva: string | null = null;
  errorReserva: string | null = null;

  get fr() {
    return this.reservaForm.controls;
  }

  onReservaSubmit(): void {
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
      next: response => {
        this.enviandoReserva = false;
        if (response.success) {
          this.successReserva = 'Solicitud enviada correctamente. Te contactaremos por correo para coordinar tu visita.';
          this.reservaForm.reset({ personas: 1 });
        } else {
          this.errorReserva = response.message || 'Error al crear la reserva';
        }
      },
      error: () => {
        this.enviandoReserva = false;
        this.errorReserva = 'No pudimos procesar tu reserva. Verifica que el servidor esté corriendo.';
      }
    });
  }
}
