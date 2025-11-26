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
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MaterialModule } from '../../ui/material-module';
import { SpeciesAnalyticsService, SpeciesDashboardResponse } from './species-analytics.service';
import { SpeciesService } from '../../features/species/species-form/species.service';
import { ReservationsAnalyticsService, ReservationsDashboardResponse } from './reservations-analytics.service';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type ModuleCard = { title: string; description: string; traits: string[]; route: string };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MaterialModule, BaseChartDirective, CurrencyPipe, DatePipe],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit, AfterViewInit {
  private elementRef = inject(ElementRef);
  private analytics = inject(SpeciesAnalyticsService);
  private speciesService = inject(SpeciesService);
  private reservationsAnalytics = inject(ReservationsAnalyticsService);
  private destroyRef = inject(DestroyRef);

  // Reservas dashboard
  reservationsDashboard = signal<ReservationsDashboardResponse | null>(null);
  reservationsLoading = signal(false);
  reservationsError = signal<string | null>(null);
  reservationsUpdated = signal<Date | null>(null);

  reservationStatusChartData = signal<ChartConfiguration<'doughnut'>['data']>({ labels: [], datasets: [] });
  reservationMonthlyChartData = signal<ChartConfiguration<'line'>['data']>({ labels: [], datasets: [] });
  reservationRevenueChartData = signal<ChartConfiguration<'bar'>['data']>({ labels: [], datasets: [] });

  reservationMonthlyOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    elements: { line: { tension: 0.35 } },
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { maxRotation: 0 }, grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  revenueChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, ticks: { callback: value => `$${value}` } },
      y: { grid: { display: false } },
    },
  };

  // Especies dashboard
  dashboard = signal<SpeciesDashboardResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  lastUpdated = signal<Date | null>(null);

  pieChartData = signal<ChartConfiguration<'doughnut'>['data']>({ labels: [], datasets: [] });
  habitatChartData = signal<ChartConfiguration<'bar'>['data']>({ labels: [], datasets: [] });
  speciesMonthlyChartData = signal<ChartConfiguration<'line'>['data']>({ labels: [], datasets: [] });

  pieChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: false },
    },
  };

  habitatChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'y',
    scales: {
      x: { beginAtZero: true, ticks: { precision: 0 } },
      y: { ticks: { autoSkip: false, maxRotation: 0 } },
    },
  };

  speciesMonthlyOptions: ChartConfiguration<'line'>['options'] = {
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
    this.loadReservationsDashboard();
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

  loadReservationsDashboard() {
    this.reservationsLoading.set(true);
    this.reservationsAnalytics.loadDashboard().subscribe({
      next: data => {
        this.reservationsDashboard.set(data);
        this.reservationsUpdated.set(new Date());
        this.reservationsError.set(null);
        this.buildReservationCharts(data);
        this.reservationsLoading.set(false);
      },
      error: err => {
        console.error('Error al cargar dashboard de reservas', err);
        this.reservationsError.set('No se pudo cargar la información de reservas.');
        this.reservationsLoading.set(false);
      },
    });
  }

  loadDashboard() {
    this.loading.set(true);
    this.analytics.loadDashboard().subscribe({
      next: data => {
        this.dashboard.set(data);
        this.lastUpdated.set(new Date());
        this.error.set(null);
        this.buildSpeciesCharts(data);
        this.loading.set(false);
      },
      error: err => {
        console.error('Error al cargar dashboard de especies', err);
        this.error.set('No se pudo cargar la información de especies.');
        this.loading.set(false);
      },
    });
  }

  private buildReservationCharts(data: ReservationsDashboardResponse) {
    const statusLabels = data.status.map(item => this.capitalize(item.estado));
    const statusValues = data.status.map(item => item.total);
    this.reservationStatusChartData.set({
      labels: statusLabels,
      datasets: [
        {
          data: statusValues,
          backgroundColor: this.statusPalette(statusValues.length),
          borderWidth: 1,
        },
      ],
    });

    const monthlySeries = this.buildMonthlySeries(data.monthly);
    const monthLabels = monthlySeries.map(item => item.label);

    this.reservationMonthlyChartData.set({
      labels: monthLabels,
      datasets: [
        {
          data: monthlySeries.map(item => item.reservas),
          label: 'Reservas confirmadas',
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37,99,235,0.15)',
          pointBackgroundColor: '#2563eb',
          fill: true,
        },
      ],
    });

    this.reservationRevenueChartData.set({
      labels: monthLabels,
      datasets: [
        {
          data: monthlySeries.map(item => item.ingresos),
          label: 'Ingresos estimados ($)',
          backgroundColor: '#f97316',
          hoverBackgroundColor: '#ea580c',
        },
      ],
    });
  }

  private buildSpeciesCharts(data: SpeciesDashboardResponse) {
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
    this.habitatChartData.set({
      labels: habitatData.map(item => item.habitat),
      datasets: [
        {
          data: habitatData.map(item => item.total),
          label: 'Especies',
          backgroundColor: '#1f5eab',
          hoverBackgroundColor: '#163f73',
        },
      ],
    });

    const monthlyLabels = data.charts.monthly.map(item => this.formatMonthLabel(item.periodo));
    const monthlyValues = data.charts.monthly.map(item => item.total);
    this.speciesMonthlyChartData.set({
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
  trackReservation = (_: number, item: { id_reserva: number }) => item.id_reserva;

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

  private buildMonthlySeries(rows: Array<{ periodo: string; reservas: number; ingresos: number; estudiantes: number }>) {
    const seriesMap = new Map(rows.map(row => [row.periodo, row]));
    const result: Array<{ key: string; label: string; reservas: number; ingresos: number; estudiantes: number }> = [];
    const baseDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
      const key = date.toISOString().slice(0, 7);
      const found = seriesMap.get(key);
      result.push({
        key,
        label: this.formatMonthLabel(key),
        reservas: found ? found.reservas : 0,
        ingresos: found ? found.ingresos : 0,
        estudiantes: found ? found.estudiantes : 0,
      });
    }
    return result;
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

  private statusPalette(amount: number) {
    const palette = ['#1f5eab', '#f97316', '#10b981', '#8b5cf6', '#0ea5e9', '#ef4444', '#14b8a6', '#facc15'];
    if (amount <= palette.length) {
      return palette.slice(0, amount);
    }
    const colors = [...palette];
    while (colors.length < amount) {
      colors.push(palette[colors.length % palette.length]);
    }
    return colors;
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
