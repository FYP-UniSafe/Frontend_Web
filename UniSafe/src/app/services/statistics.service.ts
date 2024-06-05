import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private http: HttpClient) {}

  getReportsCount(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/statistics/counts`);
  }

  getReportsPerCaseType(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/statistics/per/abusetype`);
  }

  getReportsPerLocation(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/statistics/per/location`);
  }

  getReportsPerYear(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/statistics/per/year`);
  }
}
