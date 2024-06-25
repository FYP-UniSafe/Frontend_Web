import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Report } from '../models/report';
// import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  reportId: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router // private authService: AuthService
  ) {}

  createReport(report: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/reports/create`, report, {
      withCredentials: true,
    });
  }

  createAnonymousReport(report: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/reports/anonymous/create`,
      report
    );
  }

  getStudentReports(): Observable<Report[]> {
    return this.http.get<Report[]>(
      `${environment.apiUrl}/reports/list/created`,
      { withCredentials: true }
    );
  }

  getNormalReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${environment.apiUrl}/reports/list`, {
      withCredentials: true,
    });
  }

  getAnonymousReports(): Observable<Report[]> {
    return this.http.get<Report[]>(
      `${environment.apiUrl}/reports/anonymous/list`,
      {
        withCredentials: true,
      }
    );
  }

  acceptReport(reportId: string): Observable<any> {
    const url = `${environment.apiUrl}/reports/accept`;
    const body = { report_id: reportId };
    return this.http.put(url, body, { withCredentials: true });
  }

  rejectReport(reportId: string, rejectionReason: string): Observable<any> {
    const url = `${environment.apiUrl}/reports/reject`;
    const body = { report_id: reportId, rejection_reason: rejectionReason };
    return this.http.put(url, body, { withCredentials: true });
  }

  forwardReport(reportId: string): Observable<any> {
    const url = `${environment.apiUrl}/reports/forward`;
    const body = { report_id: reportId };
    return this.http.put(url, body, { withCredentials: true });
  }

  closeReport(reportId: string): Observable<any> {
    const url = `${environment.apiUrl}/reports/close`;
    const body = { report_id: reportId };
    return this.http.put(url, body, { withCredentials: true });
  }
}
