import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MeetingService } from '../services/meeting.service';
import { AuthService } from '../services/auth.service';
import { TimeoutService } from '../services/timeout.service';

@Component({
  selector: 'app-join-screen',
  templateUrl: './join-screen.component.html',
  styleUrls: ['./join-screen.component.css'],
})
export class JoinScreenComponent implements OnInit {
  @Input() meetingId: string = '';
  userFullName: string = '';
  userData: any = [];
  isConsultant: boolean = false;
  isStudent: boolean = false;
  appointmentId: string | null = null;

  constructor(
    private meetingService: MeetingService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private timeoutService: TimeoutService,
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { appointmentId: string };
    this.appointmentId = state ? state.appointmentId : null;

    console.log('Appointment ID:', this.appointmentId);

    const user = this.authService.getUser();
    if (user) {
      this.timeoutService.resetTimer();
      this.userData = user;
      this.isConsultant = this.userData.is_consultant;
      this.isStudent = this.userData.is_student;
    }

    this.authService.onLogout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  createMeeting(): void {
    if (this.appointmentId) {
      this.meetingService.createMeeting(this.appointmentId).subscribe(
        (response: any) => {
          this.meetingId = response.roomId;
          const token = response.token;
          // this.redirectToVideoCall(this.meetingId, token);
        },
        (error: any) => {
          console.error('Failed to create meeting:', error);
        }
      );
    } else {
      console.error('No appointment ID found.');
    }
  }

  validateMeeting(meetingId: string): void {
    this.meetingService.validateMeeting(meetingId).subscribe(
      (isValid: boolean) => {
        if (isValid) {
          this.meetingId = meetingId;
          this.redirectToVideoCall(meetingId);
        } else {
          alert('Invalid meeting id');
        }
      },
      (error: any) => {
        console.error('Failed to validate meeting:', error);
      }
    );
  }

  redirectToVideoCall(meetingId: string): void {
    // this.router.navigate(['/video-call', meetingId]);
  }
}
