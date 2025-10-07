import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Category = 'pez' | 'animal' | 'anfibio';

@Injectable({ providedIn: 'root' })
export class SpeciesService {
  private http = inject(HttpClient);
  private baseUrl = '/api';

  list(cat: Category, params?: Record<string, any>): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${cat}s`, { params });
  }
  getOne(cat: Category, id: number | string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${cat}s/${id}`);
  }
  create(cat: Category, payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${cat}s`, payload);
  }
  update(cat: Category, id: number | string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${cat}s/${id}`, payload);
  }
  delete(cat: Category, id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${cat}s/${id}`);
  }
}
