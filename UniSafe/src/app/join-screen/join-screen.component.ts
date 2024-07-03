import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MeetingService } from '../services/meeting.service';
import { AuthService } from '../services/auth.service';
import { TimeoutService } from '../services/timeout.service';

@Component({
  selector: 'app-join-screen',
  templateUrl: './join-screen.component.html',
  styleUrls: ['./join-screen.component.css'],
})
export class JoinScreenComponent implements OnInit {
  userFullName: string = '';
  userData: any = {};
  isConsultant: boolean = false;
  isStudent: boolean = false;
  meetingId: string | null = null;
  token: string | null = null;

  constructor(
    private meetingService: MeetingService,
    private router: Router,
    private authService: AuthService,
    private timeoutService: TimeoutService
  ) {}

  ngOnInit(): void {
    this.timeoutService.resetTimer();
    const user = this.authService.getUser();
    if (user) {
      this.userData = user;
      this.isConsultant = this.userData.is_consultant;
      this.isStudent = this.userData.is_student;
    }
    this.retrieveMeetingId();
    this.authService.onLogout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }


  // DONT VALIDATE TRY GOING DIRECT INTO THE MEETING
  retrieveMeetingId(): void {
    this.meetingId = this.meetingService.getMeetingId();
    this.token = this.meetingService.getTokenFromService();

    if (this.meetingId && this.token) {
      console.log('Meeting ID:', this.meetingId);
      console.log('Token:', this.token);
    } else {
      console.error('No meeting ID or token found.');
    }
  }


  validateMeeting(meetingId: string, token: string): void {
    this.meetingService.validateMeeting(meetingId, token).subscribe(
      (isValid: boolean) => {
        if (isValid) {
          this.redirectToVideoCall(meetingId);
        } else {
          window.alert('Invalid meeting ID');
        }
      },
      (error: any) => {
        console.error('Failed to validate meeting:', error);
      }
    );
  }

  joinMeeting(): void {
    if (this.meetingId && this.token) {
      this.validateMeeting(this.meetingId, this.token);
    } else {
      window.alert('Please enter a meeting ID');
    }
  }

  redirectToVideoCall(meetingId: string): void {
    this.router.navigate(['/video-call', meetingId]);
    console.log('Redirecting to video call with meeting ID:', meetingId);
  }
}
