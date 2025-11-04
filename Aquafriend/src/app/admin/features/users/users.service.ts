
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, catchError } from 'rxjs';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  usuarios?: T;
}

export interface Role {
  id_role: number;
  nombre: string;
}

export interface Usuario {
  id_usuario?: number;
  nombre: string;
  apellido: string;
  email: string;
  role: string;
  role_id?: number;
  password?: string;
  activo: number;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((resp: any) => {
        if (Array.isArray(resp)) return resp as Usuario[];
        if (Array.isArray(resp?.data)) return resp.data as Usuario[];
        if (Array.isArray(resp?.usuarios)) return resp.usuarios as Usuario[];
        return [];
      })
    );
  }

  obtenerTodos(): Observable<Usuario[]> {
    return this.listar();
  }

  obtenerPorId(id: number): Observable<Usuario> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((resp: any) => (resp?.data ?? resp) as Usuario)
    );
  }

  crear(data: Usuario): Observable<ApiResponse<Usuario>> {
    return this.http.post<ApiResponse<Usuario>>(this.apiUrl, data);
  }

  actualizar(id: number, data: Partial<Usuario>): Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`, data);
  }

  eliminar(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  obtenerRoles(): Observable<Role[]> {
    return this.http.get<any>(`${this.apiUrl}/roles`).pipe(
      map((resp: any) => {
        if (Array.isArray(resp?.data)) return resp.data as Role[];
        if (Array.isArray(resp)) return resp as Role[];
        return [];
      }),
      catchError(() => of([{ id_role: 1, nombre: 'Administrador' }]))
    );
  }
}
