import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private authToken: string | null = null;
  private meetingIdSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);
  public meetingId$: Observable<string | null> =
    this.meetingIdSubject.asObservable();

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

  setMeetingId(meetingId: string | null): void {
    this.meetingIdSubject.next(meetingId);
  }

  getMeetingId(): string | null {
    return this.meetingIdSubject.getValue();
  }

  getTokenFromService(): string | null {
    return this.authToken;
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
          .pipe(
            map((response) => {
              const roomId = response.roomId;
              this.setMeetingId(roomId); // Store the meetingId
              return roomId;
            })
          );
      })
    );
  }

  validateMeeting(meetingId: string, token: string): Observable<boolean> {
    const url = `https://api.videosdk.live/v2/rooms/validate/${meetingId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<{ roomId: string }>(url, { headers })
      .pipe(map((response) => response.roomId === meetingId));
  }
}
