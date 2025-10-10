import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHome {
  cards = [
    { title: 'Usuarios', desc: 'Gestiona cuentas', route: '/admin/users' },
    { title: 'Especies', desc: 'Contenido del acuario', route: '/admin/species' },
    { title: 'Recorrido 360°', desc: 'Medios y escenas', route: '/admin/recorrido-360' },
  ];
}


