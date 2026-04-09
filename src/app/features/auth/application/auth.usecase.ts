import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../domain/auth.model';
import { AuthRepository } from '../domain/auth.repository';

@Injectable({ providedIn: 'root' })
export class AuthUseCase {
  private readonly authRepository = inject(AuthRepository);

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.authRepository.login(request).pipe(
      tap((response) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', response.accessToken);
        }
      }),
    );
  }

  register(request: RegisterRequest): Observable<void> {
    return this.authRepository.register(request);
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }
}
