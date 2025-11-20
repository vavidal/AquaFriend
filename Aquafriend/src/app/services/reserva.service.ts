import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservaRequest {
  // Datos de contacto (opcional)
  nombre?: string;
  apellido?: string;
  telefono?: string;
  institucion: string;
  correo: string;
  programa: string;
  fecha: string;
  personas: number;
  comentarios?: string;
}

export interface ReservaResponse {
  success: boolean;
  message: string;
  data?: {
    id_reserva: number;
    total_pagar: string;
  };
  error?: string;
}

export interface Reserva {
  id_reserva: number;
  fecha_reserva: string;
  cantidad_estudiantes: number;
  total_pagar: number;
  escuela: string;
  programa: string;
  estado: string;
  created_at: string;
  // Contacto asociado (si existe)
  profesor_nombre?: string;
  profesor_apellido?: string;
  profesor_telefono?: string;
}

export interface ReservasListResponse {
  success: boolean;
  data: Reserva[];
  message?: string;
  error?: string;
}

export interface FechasOcupadasResponse {
  success: boolean;
  data: string[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:3000/api/reservas';

  constructor(private http: HttpClient) { }

  // Crear una nueva reserva
  crearReserva(reserva: ReservaRequest): Observable<ReservaResponse> {
    return this.http.post<ReservaResponse>(this.apiUrl, reserva);
  }

  // Obtener todas las reservas (para el panel admin)
  obtenerReservas(): Observable<ReservasListResponse> {
    return this.http.get<ReservasListResponse>(this.apiUrl);
  }

  // Obtener programas educativos disponibles
  obtenerProgramas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/programas`);
  }

  // Obtener fechas ya ocupadas
  obtenerFechasOcupadas(): Observable<FechasOcupadasResponse> {
    return this.http.get<FechasOcupadasResponse>(`${this.apiUrl}/fechas`);
  }

  // Actualizar estado de una reserva
  actualizarEstado(id: number, estado: 'pendiente' | 'confirmada' | 'cancelada'): Observable<ReservaResponse> {
    return this.http.patch<ReservaResponse>(`${this.apiUrl}/${id}/estado`, { estado });
  }

  // Eliminar una reserva
  eliminarReserva(id: number): Observable<ReservaResponse> {
    return this.http.delete<ReservaResponse>(`${this.apiUrl}/${id}`);
  }
}
