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

  joinMeeting(): void {
    if (this.meetingId && this.token) {
      this.router.navigate(['/videocall']);
    } else {
      window.alert('Please enter a meeting ID');
    }
  }
}
