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

  acceptAnonymous(reportId: string): Observable<any> {
    const url = `${environment.apiUrl}/reports/anonymous/accept`;
    const body = { report_id: reportId };
    return this.http.put(url, body);
  }

  rejectReport(reportId: string, rejectionReason: string): Observable<any> {
    const url = `${environment.apiUrl}/reports/reject`;
    const body = { report_id: reportId, rejection_reason: rejectionReason };
    return this.http.put(url, body, { withCredentials: true });
  }

  rejectAnonymous(reportId: string, rejectionReason: string): Observable<any> {
    const url = `${environment.apiUrl}/reports/anonymous/reject`;
    const body = { report_id: reportId, rejection_reason: rejectionReason };
    return this.http.put(url, body);
  }

  forwardReport(reportId: string): Observable<any> {
    const url = `${environment.apiUrl}/reports/forward`;
    const body = { report_id: reportId };
    return this.http.put(url, body, { withCredentials: true });
  }

  forwardAnonymous(reportId: string): Observable<any> {
    const url = `${environment.apiUrl}/reports/anonymous/forward`;
    const body = { report_id: reportId };
    return this.http.put(url, body);
  }

  closeReport(reportId: string): Observable<any> {
    const url = `${environment.apiUrl}/reports/close`;
    const body = { report_id: reportId };
    return this.http.put(url, body, { withCredentials: true });
  }

  closeAnonymous(reportId: string): Observable<any> {
    const url = `${environment.apiUrl}/reports/anonymous/close`;
    const body = { report_id: reportId };
    return this.http.put(url, body);
  }

  receiveReport(reportId: string): Observable<any> {
    const url = `${environment.apiUrl}/reports/receive`;
    const body = { report_id: reportId };
    return this.http.put(url, body, { withCredentials: true });
  }

  receiveAnonymous(reportId: string): Observable<any> {
    const url = `${environment.apiUrl}/reports/anonymous/receive`;
    const body = { report_id: reportId };
    return this.http.put(url, body);
  }

  getForwardedReport(): Observable<Report[]> {
    return this.http.get<Report[]>(
      `${environment.apiUrl}/reports/list/forwarded`,
      { withCredentials: true }
    );
  }

  getForwardedAnonymous(): Observable<Report[]> {
    return this.http.get<Report[]>(
      `${environment.apiUrl}/reports/anonymous/list/forwarded`,
      { withCredentials: true }
    );
  }

}
