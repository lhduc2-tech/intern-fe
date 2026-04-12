import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthUseCase } from '@/features/auth/application/auth.usecase';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authUseCase = inject(AuthUseCase);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const token = authUseCase.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        if (isPlatformBrowser(platformId)) {
          authUseCase.logout();
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
