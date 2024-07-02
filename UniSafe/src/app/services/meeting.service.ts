import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private authToken: string | null = null;

  constructor(private http: HttpClient) {}

  getToken(roomId?: string, peerId?: string): Observable<{ token: string }> {
    let url = `${environment.apiUrl}/video-call/get-token/`;
    if (roomId || peerId) {
      url += '?';
      if (roomId) {
        url += `roomId=${roomId}&`;
      }
      if (peerId) {
        url += `peerId=${peerId}&`;
      }
    }
    return this.http.get<{ token: string }>(url);
  }

  setToken(token: string): void {
    this.authToken = token;
  }

  createMeeting(appointmentId: string): Observable<string> {
    return this.getToken().pipe(
      switchMap(({ token }) => {
        this.setToken(token);
        const apiUrl = `${environment.apiUrl}/video-call/create-meeting/`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.http
          .post<{ roomId: string }>(
            apiUrl,
            { token, appointment_id: appointmentId },
            { headers }
          )
          .pipe(map((response) => response.roomId));
      })
    );
  }

  validateMeeting(meetingId: string): Observable<boolean> {
    return this.getToken().pipe(
      switchMap(({ token }) => {
        this.setToken(token);
        const url = `${environment.apiUrl}/video-call/validate-meeting/${meetingId}/`;
        return this.http
          .post<{ roomId: string }>(url, { token })
          .pipe(map((response) => response.roomId === meetingId));
      })
    );
  }
}
