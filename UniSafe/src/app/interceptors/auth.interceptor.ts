import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TimeoutService } from '../services/timeout.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,
              private timeoutService: TimeoutService    
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Reset idle timer on outgoing requests
    this.timeoutService.resetTimer();
    
    // Add Authorization header if access token is available
    const accessToken = this.authService.getAccessToken();
    if (accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    // Handle profile requests with credentials
    if (request.url.includes('/profile')) {
      request = request.clone({
        withCredentials: true
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !request.url.includes('/refresh-token')) {
          return this.handle401Error(request, next);
        }
        return throwError(error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refresh().pipe(
      switchMap(() => {
        if (request.url.includes('/profile')) {
          request = request.clone({
            withCredentials: true
          });
        }
        return next.handle(request);
      }),
      catchError((error) => {
        // Handle refresh token error or any other errors
        this.authService.logout().subscribe(); // Logout user if refresh token fails
        return throwError(error);
      })
    );
  }
}
