import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificacaoService } from '../services/notificacao.service';


function isPublicRequest(url: string, method: string): boolean {
  const publicRequests = [
    {
      method: 'POST',
      path: '/auth/login'
    },
    {
      method: 'POST',
      path: '/usuarios'
    }
  ];

  const pathname = new URL(
    url,
    window.location.origin
  ).pathname;

  return publicRequests.some(
    request =>
      request.method === method &&
      pathname.endsWith(request.path)
  )
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const notificacaoService = inject(NotificacaoService);

  const token = localStorage.getItem('token');

  const isLoginRequest = req.url.includes('/auth/login')
  const publicRequest = isPublicRequest(
    req.url,
    req.method
  );

  const authReq = token && !publicRequest ? req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }) : req;
  return next(authReq).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (erro.status === 401 && !isLoginRequest) {
        authService.logout();

        notificacaoService.mostrarErro('Sessão expirada. Por favor, faça login novamente.');


        router.navigate(['/login']);
      }
      return throwError(() => erro);
    })
  );
};
