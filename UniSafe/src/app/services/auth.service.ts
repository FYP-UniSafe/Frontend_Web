import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  constructor(private http: HttpClient) {}

  setAccessToken(token: string) {
    localStorage.setItem(this.accessTokenKey, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  removeAccessToken() {
    localStorage.removeItem(this.accessTokenKey);
  }

  setRefreshToken(token: string) {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  removeRefreshToken() {
    localStorage.removeItem(this.refreshTokenKey);
  }

  login(body: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/login`, body, { withCredentials: true })
      .pipe(
        tap((res: any) => {
          this.setAccessToken(res.tokens.access);
          this.setRefreshToken(res.tokens.refresh);
        })
      );
  }

  user(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/user`);
  }

  refresh(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      return this.http.post(`${environment.apiUrl}/users/token/refresh`, { refresh: refreshToken }, { withCredentials: true })
        .pipe(
          tap((res: any) => {
            this.setAccessToken(res.access);
          })
        );
    } else {
      return of(null);
    }
  }

  // logout(): Observable<any> {
  //   this.removeAccessToken();
  //   this.removeRefreshToken();
  //   return this.http.post(`${environment.apiUrl}/users/logout`, {}, { withCredentials: true });
  // }
  logout(): Observable<any> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    
    if (!accessToken || !refreshToken) {
      return throwError('Access token or refresh token not found');
    }

    const headers = { Authorization: `Bearer ${accessToken}` };
    const body = { refresh: refreshToken };

    this.removeAccessToken();
    this.removeRefreshToken();

    return this.http.post(`${environment.apiUrl}/users/logout`, body, { headers });
  }


}

