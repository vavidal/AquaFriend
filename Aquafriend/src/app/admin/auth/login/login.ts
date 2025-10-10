import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class AdminLogin {
  private readonly router = inject(Router);

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    // Mock login: guarda flag en localStorage y redirige al home del panel
    localStorage.setItem('admin_logged_in', '1');
    this.router.navigate(['/admin/home']);
  }
}


