import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  ElementRef,
  OnInit,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../ui/material-module';
import { SpeciesAnalyticsService, SpeciesDashboardResponse } from './species-analytics.service';
import { SpeciesService } from '../../features/species/species-form/species.service';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type ModuleCard = { title: string; description: string; traits: string[]; route: string };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MaterialModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit, AfterViewInit {
  private elementRef = inject(ElementRef);
  private analytics = inject(SpeciesAnalyticsService);
  private speciesService = inject(SpeciesService);
  private destroyRef = inject(DestroyRef);

  dashboard = signal<SpeciesDashboardResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  lastUpdated = signal<Date | null>(null);

  pieChartData = signal<ChartConfiguration<'doughnut'>['data']>({ labels: [], datasets: [] });
  barChartData = signal<ChartConfiguration<'bar'>['data']>({ labels: [], datasets: [] });
  lineChartData = signal<ChartConfiguration<'line'>['data']>({ labels: [], datasets: [] });

  pieChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: false },
    },
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'y',
    scales: {
      x: { beginAtZero: true, ticks: { precision: 0 } },
      y: { ticks: { autoSkip: false, maxRotation: 0 } },
    },
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    elements: { line: { tension: 0.35 } },
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { maxRotation: 0 } },
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  readonly typeCards = [
    { key: 'pez', label: 'Peces', color: '#1f5eab' },
    { key: 'mamifero', label: 'Mamíferos', color: '#ff7b32' },
    { key: 'ave', label: 'Aves', color: '#50b498' },
    { key: 'reptil', label: 'Reptiles', color: '#1098ad' },
  ];

  constructor() {}

  ngOnInit() {
    this.loadDashboard();
    this.speciesService.refresh$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (event === 'created') {
          this.loadDashboard();
        }
      });
  }

  ngAfterViewInit() {
    const video = this.elementRef.nativeElement.querySelector('video');
    if (video && typeof video.load === 'function') {
      video.load();
      video.play().catch(() => {
        // Ignorar error si autoplay falla
      });
    }
  }

  loadDashboard() {
    this.loading.set(true);
    this.analytics.loadDashboard().subscribe({
      next: data => {
        this.dashboard.set(data);
        this.lastUpdated.set(new Date());
        this.error.set(null);
        this.buildCharts(data);
        this.loading.set(false);
      },
      error: err => {
        console.error('Error al cargar dashboard de especies', err);
        this.error.set('No se pudo cargar la información de especies.');
        this.loading.set(false);
      },
    });
  }

  private buildCharts(data: SpeciesDashboardResponse) {
    const typeLabels = data.charts.byType.map(item => this.mapTypeLabel(item.tipo));
    const typeValues = data.charts.byType.map(item => item.total);
    const typeColors = data.charts.byType.map(item => this.resolveTypeColor(item.tipo));
    this.pieChartData.set({
      labels: typeLabels,
      datasets: [
        {
          data: typeValues,
          backgroundColor: typeColors,
          borderWidth: 1,
        },
      ],
    });

    const habitatData = this.prepareHabitatData(data.charts.byHabitat);
    const habitatLabels = habitatData.map(item => item.habitat);
    const habitatValues = habitatData.map(item => item.total);
    this.barChartData.set({
      labels: habitatLabels,
      datasets: [
        {
          data: habitatValues,
          label: 'Especies',
          backgroundColor: '#1f5eab',
          hoverBackgroundColor: '#163f73',
        },
      ],
    });

    const monthlyLabels = data.charts.monthly.map(item => this.formatMonthLabel(item.periodo));
    const monthlyValues = data.charts.monthly.map(item => item.total);
    this.lineChartData.set({
      labels: monthlyLabels,
      datasets: [
        {
          data: monthlyValues,
          label: 'Altas por mes',
          borderColor: '#ff7b32',
          backgroundColor: 'rgba(255,123,50,0.25)',
          pointBackgroundColor: '#ff7b32',
          fill: true,
        },
      ],
    });
  }

  typeCount(key: string) {
    return this.dashboard()?.totals.byType?.[key] ?? 0;
  }

  trackSpecies = (_: number, item: { id: number }) => item.id;

  private prepareHabitatData(items: Array<{ habitat: string; total: number }>) {
    const sorted = [...items].sort((a, b) => b.total - a.total);
    const maxItems = 8;
    const top = sorted.slice(0, maxItems);
    const otherTotal = sorted.slice(maxItems).reduce((sum, item) => sum + (item.total || 0), 0);
    if (otherTotal > 0) {
      top.push({ habitat: 'Otros', total: otherTotal });
    }
    return top;
  }

  mapTypeLabel(value: string) {
    const key = value?.toLowerCase();
    switch (key) {
      case 'pez':
        return 'Peces';
      case 'mamifero':
        return 'Mamíferos';
      case 'ave':
        return 'Aves';
      case 'reptil':
        return 'Reptiles';
      case 'sin tipo':
        return 'Sin tipo';
      default:
        return this.capitalize(value || 'Otros');
    }
  }

  private resolveTypeColor(value: string) {
    const key = value?.toLowerCase();
    const palette: Record<string, string> = {
      pez: '#1f5eab',
      mamifero: '#ff7b32',
      ave: '#50b498',
      reptil: '#1098ad',
      'sin tipo': '#94a3b8',
      otros: '#94a3b8',
    };
    return palette[key || 'otros'] || palette['otros'];
  }

  private formatMonthLabel(periodo: string) {
    if (!periodo) return 'N/A';
    const [year, month] = periodo.split('-').map(Number);
    const date = new Date(year, (month || 1) - 1, 1);
    return new Intl.DateTimeFormat('es-CL', { month: 'short', year: 'numeric' }).format(date);
  }

  private capitalize(value: string) {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  modules: ModuleCard[] = [
    {
      title: 'Recorrido 360��',
      description: 'Explora los hǭbitats del acuario en primera persona.',
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
      description: 'Galer��a fotogrǭfica del entorno y se��alǸtica.',
      traits: ['galer��a', 'informativo', 'geo'],
      route: '/dashboard/exterior',
    },
    {
      title: 'Aprender',
      description: 'Actividades, gu��as para docentes y accesibilidad.',
      traits: ['actividades', 'gu��as', 'accesibilidad'],
      route: '/dashboard/recursos/actividades',
    },
    {
      title: 'Administraci��n',
      description: 'Gestiona contenido, medios 360 y usuarios.',
      traits: ['CMS', 'media', 'usuarios'],
      route: '/dashboard/admin/contenido',
    },
    {
      title: 'Acerca & Contacto',
      description: 'Conoce AquaFriend y c��mo colaborar.',
      traits: ['about', 'equipo', 'contacto'],
      route: '/dashboard/acerca',
    },
  ];
}
