import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Category = 'pez' | 'animal' | 'anfibio';

@Injectable({ providedIn: 'root' })
export class SpeciesService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  private path(cat: Category) {
    switch (cat) {
      case 'pez': return 'peces';
      case 'animal': return 'animales';
      case 'anfibio': return 'anfibios';
      default: return `${cat}s`;
    }
  }

  list(cat: Category, params?: Record<string, any>): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${this.path(cat)}`, { params });
  }
  getOne(cat: Category, id: number | string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${this.path(cat)}/${id}`);
  }
  create(cat: Category, payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${this.path(cat)}`, payload);
  }
  update(cat: Category, id: number | string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${this.path(cat)}/${id}`, payload);
  }
  delete(cat: Category, id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${this.path(cat)}/${id}`);
  }
}
