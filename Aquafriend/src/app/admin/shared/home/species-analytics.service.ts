import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type SpeciesType = 'pez' | 'mamifero' | 'ave' | 'reptil' | 'otros' | string;

export interface SpeciesDashboardResponse {
  totals: {
    overall: number;
    byType: Record<string, number>;
    habitats: number;
    recent30: number;
  };
  charts: {
    byType: Array<{ tipo: string; total: number }>;
    byHabitat: Array<{ habitat: string; total: number }>;
    monthly: Array<{ periodo: string; total: number }>;
  };
  list: Array<{
    id: number;
    nombre_comun: string;
    tipo: string;
    habitat: string;
    estado_conservacion: string;
    fecha_registro: string;
  }>;
}

@Injectable({ providedIn: 'root' })
export class SpeciesAnalyticsService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/especies';

  loadDashboard(): Observable<SpeciesDashboardResponse> {
    return this.http.get<SpeciesDashboardResponse>(`${this.baseUrl}/dashboard`);
  }
}
