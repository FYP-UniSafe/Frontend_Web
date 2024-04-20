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

  constructor(private http: HttpClient,  
  ) {}

  signup(userData: any, profileType: string): Observable<any> {
    let signupUrl: string;
    switch (profileType) {
      case 'Student':
        signupUrl = `${environment.apiUrl}/users/signup/student`;
        break;
      case 'GenderDesk':
        signupUrl = `${environment.apiUrl}/users/signup/genderdesk`;
        break;
      case 'Consultant':
        signupUrl = `${environment.apiUrl}/users/signup/consultant`;
        break;
      case 'Police':
        signupUrl = `${environment.apiUrl}/users/signup/police`;
        break;
      default:
        throw new Error('Invalid profile type');
    }
    return this.http.post(signupUrl, userData);
  }

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
    return this.http
      .post(`${environment.apiUrl}/users/login`, body, {
        withCredentials: true,
      })
      .pipe(
        tap((res: any) => {
          this.setAccessToken(res.tokens.access);
          this.setRefreshToken(res.tokens.refresh);
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/password/forgot`, {
      email,
    });
  }

  resetPassword(email: string, otp: string, newPassword: string) {
    const resetUrl = `${environment.apiUrl}/users/password/reset`;
    const requestBody = { email, otp, new_password: newPassword };
    return this.http.post(resetUrl, requestBody);
  }

  
  user(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/user`);
  }

  updateUser(userData: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/users/user`, userData);
  }

  updateStudentProfile(profileData: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/users/student/profile/update`, profileData);
  }

  updateGenderDeskProfile(profileData: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/users/genderdesk/profile/update`, profileData);
  }

  updateConsultantProfile(profileData: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/users/consultant/profile/update`, profileData);
  }

  updatePoliceProfile(profileData: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/users/police/profile/update`, profileData);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const requestBody = {
      old_password: oldPassword,
      new_password: newPassword
    };
  
    return this.http.post(`${environment.apiUrl}/users/password/change`, requestBody);
  }
  


  refresh(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      return this.http
        .post(
          `${environment.apiUrl}/users/token/refresh`,
          { refresh: refreshToken },
          { withCredentials: true }
        )
        .pipe(
          tap((res: any) => {
            this.setAccessToken(res.access);
          })
        );
    } else {
      return of(null);
    }
  }

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

    return this.http.post(`${environment.apiUrl}/users/logout`, body, {
      headers,
    });
  }

  getStudentProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/student/profile`, {
      withCredentials: true,
    });
  }

  getGenderDeskProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/genderdesk/profile`, {
      withCredentials: true,
    });
  }

  getPoliceProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/police/profile`, {
      withCredentials: true,
    });
  }

  getConsultantProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/consultant/profile`, {
      withCredentials: true,
    });
  }

}
