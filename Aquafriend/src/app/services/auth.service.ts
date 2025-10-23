import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.success && res.data) {
          localStorage.setItem('admin_logged_in', '1');
          localStorage.setItem('admin_user', JSON.stringify(res.data));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_user');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('admin_logged_in') === '1';
  }

  getCurrentUser(): AuthUser | null {
    const userStr = localStorage.getItem('admin_user');
    return userStr ? (JSON.parse(userStr) as AuthUser) : null;
  }
}
