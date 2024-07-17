import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  constructor(private http: HttpClient) {}

  verifyOtp(email: string, otp: string): Observable<any> {
    const body = { email, otp };

    return this.http
      .post<any>(`${environment.apiUrl}/users/otp/verify`, body)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  resendOtp(email: string): Observable<any> {
    const body = { email };

    return this.http
      .post<any>(`${environment.apiUrl}/users/otp/resend`, body)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
