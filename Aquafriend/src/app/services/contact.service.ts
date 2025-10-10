import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactRequest {
  name: string;
  email: string;
  date?: string;
  people?: number;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  // En dev usa proxy /api → backend local. En prod, cambia a tu dominio.
  private base = '/api';

  constructor(private http: HttpClient) {}

  sendRequest(payload: ContactRequest): Observable<{ ok: boolean; message?: string }> {
    return this.http.post<{ ok: boolean; message?: string }>(`${this.base}/requests`, payload);
  }
}
