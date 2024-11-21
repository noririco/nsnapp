import { inject } from '@angular/core';
import { AuthStore } from './../../../store/auth.store';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const token = authStore.token();
  console.log('Token in interceptor:', token);
  const authReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;
  console.log('Req in interceptor:', authReq);
  return next(authReq).pipe(
    catchError((error) => {
      // Redirect to login if token is missing or if unauthorized error is returned
      if (!token || error.status === 401) {
        authStore.logout({ shallow: true });
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
