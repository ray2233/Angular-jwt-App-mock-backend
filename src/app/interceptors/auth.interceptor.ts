import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken(); 
  
  const authReq = req.clone({
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
  });

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        console.warn('401 Unauthorized: Logging out and redirecting');
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
