import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(
    private http: HttpClient,
    private router: Router,
    // private authService: AuthService
  ) {}

  createReport(report: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/reports/create`, report, {
      withCredentials: true,
    });
  }

  createAnonymousReport(report: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/reports/create/anonymous`,
      report
    );
  }
}
