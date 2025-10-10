import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export type ContactRequest = {
  name: string;
  email: string;
  date?: string;
  people?: number;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private readonly http: HttpClient) {}

  sendRequest(payload: ContactRequest): Observable<void> {
    // Reemplace la URL por un backend real cuando esté disponible
    // return this.http.post<void>('/api/contact', payload);
    console.info('Simulando envío de contacto', payload);
    return of(void 0);
  }
}


