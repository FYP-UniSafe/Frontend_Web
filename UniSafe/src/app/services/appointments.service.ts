import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  constructor(private http: HttpClient) {}

  createAppointment(appointmentData: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/appointments/create`,
      appointmentData,
      {
        withCredentials: true,
      }
    );
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(
      `${environment.apiUrl}/appointments/list/requested`,
      {
        withCredentials: true,
      }
    );
  }

  cancelAppointment(appointmentId: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/appointments/cancel/${appointmentId}/`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(
      `${environment.apiUrl}/appointments/list/all`,
      {
        withCredentials: true,
      }
    );
  }

  acceptAppointment(appointmentId: string, appointmentData: any): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/appointments/accept/${appointmentId}/`,
      appointmentData,
      {
        withCredentials: true,
      }
    );
  }
}
