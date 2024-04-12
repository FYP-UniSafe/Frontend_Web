import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  refresh = false;

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.getAccessToken()) {
      const req = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`
        }
      });

      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && !this.refresh) {
            this.refresh = true;
            return this.handle401Error(request, next);
          }
          return throwError(error);
        })
      );
    } else {
      return next.handle(request);
    }
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refresh().pipe(
      switchMap(() => {
        const req = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`
          }
        });
        return next.handle(req);
      }),
      catchError((error) => {
        // Handle refresh token error or any other errors
        this.authService.logout().subscribe(); // Logout user if refresh token fails
        return throwError(error);
      })
    );
  }
}






