import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthUser {
  id_usuario?: number;
  id?: number;
  email: string;
  nombre?: string;
  apellido?: string;
  nombre_completo?: string;
  full_name?: string;
  name?: string;
  role: string;
}

export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { success: boolean; message: string; data?: AuthUser; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private loggedKey = 'admin_logged_in';
  private userKey = 'admin_user';

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (this.isBrowser) {
      this.resyncFromStorage();
      window.addEventListener('storage', () => this.resyncFromStorage());
    }
  }

  private get isBrowser(): boolean { return isPlatformBrowser(this.platformId); }

  private normalize(u: any): AuthUser {
    if (!u) return u;
    const full = (u.nombre_completo ?? u.full_name ?? u.name ?? '').toString().trim();
    let nombre = (u.nombre ?? '').toString().trim();
    let apellido = (u.apellido ?? '').toString().trim();
    if ((!nombre || !apellido) && full) {
      const parts = full.split(' ').filter(Boolean);
      if (!nombre && parts.length) nombre = parts[0];
      if (!apellido && parts.length > 1) apellido = parts.slice(1).join(' ');
    }
    return {
      id_usuario: u.id_usuario ?? u.id,
      id: u.id ?? u.id_usuario,
      email: u.email ?? '',
      nombre,
      apellido,
      nombre_completo: full || undefined,
      full_name: full || undefined,
      name: full || undefined,
      role: (u.role ?? '').toString()
    };
  }

  private writeStorage(u: AuthUser | null) {
    if (!this.isBrowser) return;
    if (u) localStorage.setItem(this.userKey, JSON.stringify(u));
    else localStorage.removeItem(this.userKey);
  }

  resyncFromStorage(): void {
    if (!this.isBrowser) return;
    try {
      const raw = localStorage.getItem(this.userKey);
      const parsed = raw ? JSON.parse(raw) : null;
      this.currentUserSubject.next(parsed ? this.normalize(parsed) : null);
    } catch { this.currentUserSubject.next(null); }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.success && res.data) {
          if (this.isBrowser) localStorage.setItem(this.loggedKey, '1');
          const n = this.normalize(res.data);
          this.currentUserSubject.next(n);
          this.writeStorage(n);
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.loggedKey);
      localStorage.removeItem(this.userKey);
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return localStorage.getItem(this.loggedKey) === '1';
  }

  get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: any | null): void {
    const n = user ? this.normalize(user) : null;
    this.currentUserSubject.next(n);
    this.writeStorage(n);
  }

  updateCurrentUserPartial(partial: Partial<AuthUser>): void {
    const curr = this.currentUserSubject.value;
    if (!curr) return;
    const merged = this.normalize({ ...curr, ...partial });
    this.currentUserSubject.next(merged);
    this.writeStorage(merged);
  }

  refreshCurrentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.apiUrl}/me`).pipe(
      tap(u => this.setCurrentUser(u))
    );
  }
}
