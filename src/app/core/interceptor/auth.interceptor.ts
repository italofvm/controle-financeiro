import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      console.error(`[HTTP ${erro.status || 'erro de rede'}] ${req.method} ${req.url}`, erro);
      return throwError(() => erro);
    })
  );
};
