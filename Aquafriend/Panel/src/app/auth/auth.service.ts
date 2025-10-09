import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

type User = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  avatarUrl?: string | null;
};

type LoginDto = { email: string; password: string };
type RegisterDto = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: string;
  password: string;
  avatarUrl?: string | null;
};

type AuthResponse = { token: string; user: User };

const API_BASE =
  (typeof window !== 'undefined' &&
    (window as any).env &&
    (window as any).env.API_BASE) ||
  'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private _user = signal<User | null>(null);
  readonly user = computed(() => this._user());
  readonly isLoggedIn = computed(() => !!this.token());

  login(dto: LoginDto) {
    return this.http
      .post<AuthResponse>(`${API_BASE}/api/auth/login`, dto)
      .pipe(
        tap(({ token, user }) => {
          localStorage.setItem('auth_token', token);
          this._user.set(user);
        })
      );
  }

  register(dto: RegisterDto): Observable<User> {
    return this.http.post<User>(`${API_BASE}/api/auth/register`, dto);
  }

  logout() {
    localStorage.removeItem('auth_token');
    this._user.set(null);
  }

  token(): string | null {
    return localStorage.getItem('auth_token');
  }

  authHeaders(): HttpHeaders {
    const t = this.token();
    return new HttpHeaders(
      t ? { Authorization: `Bearer ${t}` } : undefined
    );
  }
}
