import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class AdminLogin {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  loading = false;
  errorMessage = '';

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

          // Redirigir al dashboard
          this.router.navigate(['/dashboard/home']);
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


