import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthUseCase } from '@/features/auth/application/auth.usecase';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authUseCase = inject(AuthUseCase);
  const token = authUseCase.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};

