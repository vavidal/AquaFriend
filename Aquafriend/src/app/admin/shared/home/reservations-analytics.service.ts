import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservationsDashboardResponse {
  totals: {
    overall: number;
    currentMonth: number;
    revenueMonth: number;
    studentsMonth: number;
  };
  status: Array<{ estado: string; total: number }>;
  monthly: Array<{ periodo: string; reservas: number; ingresos: number; estudiantes: number }>;
  recent: Array<{
    id_reserva: number;
    escuela: string;
    programa: string;
    fecha_reserva: string;
    estado: string;
    total_pagar: number;
    cantidad_estudiantes: number;
  }>;
}

@Injectable({ providedIn: 'root' })
export class ReservationsAnalyticsService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/reservas';

  loadDashboard(): Observable<ReservationsDashboardResponse> {
    return this.http.get<ReservationsDashboardResponse>(`${this.baseUrl}/dashboard`);
  }
}
