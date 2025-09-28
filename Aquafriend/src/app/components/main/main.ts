import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService, ContactRequest } from '../../services/contact.service';

declare const bootstrap: any; // API JS de Bootstrap 5

type GalleryItem = { src: string; title: string; text?: string };

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './main.html',
  styleUrls: ['./main.css'],
})
export class MainComponent {
  // ===== GALERÍA =====
  private readonly nums = [1, 2, 3, 4, 5, 10, 13, 15, 16, 17, 19, 20, 21];

  private readonly titles: Record<number, string> = {
    1: 'Vista del barco del acuario',
    2: 'Puesto',
    3: 'Senderos',
    4: 'Bosque nativo',
    5: 'Aula abierta',
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

  // ===== FORMULARIO =====
  private fb = inject(FormBuilder);
  private contactSvc = inject(ContactService);

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

  get f() { return this.contactForm.controls; }

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
      }
    });
  }
}
