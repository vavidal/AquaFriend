import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz para el formulario de contacto del footer
export interface ContactoFooterRequest {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje?: string;
}

// Interfaz para el formulario de contacto general (main-body)
export interface ContactRequest {
  name: string;
  email: string;
  date?: string;
  people?: number;
  message?: string;
}

// Interfaz para la respuesta del backend
export interface ContactoResponse {
  success: boolean;
  message: string;
  data?: {
    id_contacto: number;
  };
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private apiUrl = 'http://localhost:3000/api/contactos';

  constructor(private readonly http: HttpClient) {}

  // Método para enviar contacto desde el footer
  enviarContactoFooter(payload: ContactoFooterRequest): Observable<ContactoResponse> {
    return this.http.post<ContactoResponse>(this.apiUrl, payload);
  }

  // Método legacy para compatibilidad con main-body
  sendRequest(payload: ContactRequest): Observable<ContactoResponse> {
    // Adaptar al formato del backend
    const contacto: ContactoFooterRequest = {
      nombre: payload.name,
      email: payload.email,
      mensaje: payload.message
    };
    return this.http.post<ContactoResponse>(this.apiUrl, contacto);
  }
}


