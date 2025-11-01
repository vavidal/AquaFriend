import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="h4">Panel de administración</h1>
    <p class="text-body-secondary">Bienvenida/o al dashboard. Aquí podrás migrar tus vistas.</p>
    <div class="alert alert-info small mt-3">
      Crea componentes/admin según tus secciones y enlázalos desde <code>ADMIN_ROUTES</code>.
    </div>
  `
})
export class AdminDashboard {}


