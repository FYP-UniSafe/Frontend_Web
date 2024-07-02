import { Component, OnInit } from '@angular/core';
import { VideoSDK } from '@videosdk.live/js-sdk'; // Adjust path as per your setup
import { ActivatedRoute } from '@angular/router';
import { MeetingService } from '../services/meeting.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css'],
})
export class VideoCallComponent implements OnInit {
  meeting: any; // Adjust type as per VideoSDK documentation
  participantName: string = ''; // Adjust participant name logic as needed
  meetingId: string = '';

  constructor(
    private route: ActivatedRoute,
    private meetingService: MeetingService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Retrieve meetingId from route params
    this.route.params.subscribe(params => {
      this.meetingId = params['id'];
      if (this.meetingId) {
        this.initMeeting();
      } else {
        console.error('No meeting id provided.');
      }
    });
    const user = this.authService.getUser();
    if (user) {
      this.participantName = user.full_name;
    }
  }

  // Initialize meeting with fetched token
  initMeeting(): void {
    this.meetingService.getToken().subscribe(
      response => {
        const token = response.token;

        VideoSDK.config(token);

        this.meeting = VideoSDK.initMeeting({
          meetingId: this.meetingId,
          name: this.participantName,
          micEnabled: true,
          webcamEnabled: true,
        });

        // Join the meeting
        this.meeting.join();

        // Handle meeting events
        this.handleMeetingEvents(this.meeting);
      },
      error => {
        console.error('Failed to fetch token:', error);
      }
    );
  }

  // Handle meeting events
  handleMeetingEvents(meeting: any): void {
    // Implement event handling logic as needed
    meeting.on('someEvent', (eventData: any) => {
      console.log('Received event:', eventData);
      // Handle event logic
    });
  }

  // Example of leaving the meeting
  leaveMeeting(): void {
    this.meeting.leave();
  }

  // Example of toggling webcam
  toggleWebcam(): void {
    this.meeting.toggleWebcam();
  }

  // Example of toggling mic
  toggleMic(): void {
    this.meeting.toggleMic();
  }
}
