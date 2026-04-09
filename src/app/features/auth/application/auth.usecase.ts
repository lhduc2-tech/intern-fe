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

  getUserFullName(): string {
    const token = this.getToken();
    if (!token) return 'Admin User';
    try {
      const payloadBase64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const decodedData = atob(payloadBase64);
      const uintArray = new Uint8Array(decodedData.length);
      for (let i = 0; i < decodedData.length; i++) {
        uintArray[i] = decodedData.charCodeAt(i);
      }
      const payloadJson = new TextDecoder('utf-8').decode(uintArray);
      const payload = JSON.parse(payloadJson);
      return payload.fullName || 'Admin User';
    } catch (e) {
      return 'Admin User';
    }
  }
}
