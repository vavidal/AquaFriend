import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class AdminLogin implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  loading = false;
  errorMessage = '';
  private returnUrl = '/dashboard/home';

  ngOnInit(): void {
    const requested = this.route.snapshot.queryParamMap.get('returnUrl');
    this.returnUrl = this.isValidReturnUrl(requested) ? requested! : '/dashboard/home';

    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  private isValidReturnUrl(url: string | null): boolean {
    if (!url) return false;
    return url.startsWith('/admin') || url.startsWith('/dashboard');
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = form.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success && response.data) {
          // Guardar en localStorage
          localStorage.setItem('admin_logged_in', '1');
          localStorage.setItem('admin_user', JSON.stringify(response.data));

          // Redirigir al dashboard o ruta solicitada originalmente
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.errorMessage = response.message || 'Error al iniciar sesión';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error en login:', err);
        this.errorMessage = err.error?.message || 'Error de conexión. Verifica que el servidor esté corriendo.';
      }
    });
  }
}


