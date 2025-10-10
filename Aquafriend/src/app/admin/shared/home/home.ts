import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../ui/material-module';


type ModuleCard = { title: string; description: string; traits: string[]; route: string };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  modules: ModuleCard[] = [
    {
      title: 'Recorrido 360°',
      description: 'Explora los hábitats del acuario en primera persona.',
      traits: ['tour', 'inmersivo', 'multimedia'],
      route: '/dashboard/recorrido-360',
    },
    {
      title: 'Especies',
      description: 'Fichas con fotos, audio y datos clave.',
      traits: ['peces', 'invertebrados', 'plantas'],
      route: '/dashboard/especies',
    },
    {
      title: 'Exterior',
      description: 'Galería fotográfica del entorno y señalética.',
      traits: ['galería', 'informativo', 'geo'],
      route: '/dashboard/exterior',
    },
    {
      title: 'Aprender',
      description: 'Actividades, guías para docentes y accesibilidad.',
      traits: ['actividades', 'guías', 'accesibilidad'],
      route: '/dashboard/recursos/actividades',
    },
    {
      title: 'Administración',
      description: 'Gestiona contenido, medios 360 y usuarios.',
      traits: ['CMS', 'media', 'usuarios'],
      route: '/dashboard/admin/contenido',
    },
    {
      title: 'Acerca & Contacto',
      description: 'Conoce AquaFriend y cómo colaborar.',
      traits: ['about', 'equipo', 'contacto'],
      route: '/dashboard/acerca',
    },
  ];
}
