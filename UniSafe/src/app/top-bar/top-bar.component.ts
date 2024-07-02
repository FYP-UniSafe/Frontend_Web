import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {
  @Input() meetingId: string = '';

  constructor() {}

  toggleWebcam(): void {
    // Implement toggle webcam functionality
    console.log('Toggle Webcam clicked');
  }

  toggleMic(): void {
    // Implement toggle mic functionality
    console.log('Toggle Mic clicked');
  }

  leaveMeeting(): void {
    // Implement leave meeting functionality
    console.log('Leave Meeting clicked');
  }
}
