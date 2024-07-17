import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent {
  micOn: boolean = true;
  camOn: boolean = true;

  @Input() meetingId: string = '';
  @Output() webcamToggle: EventEmitter<void> = new EventEmitter<void>();
  @Output() micToggle = new EventEmitter<void>();
  @Output() leaveMeeting = new EventEmitter<void>();

  constructor() {}

  toggleWebcam(): void {
    console.log('Emitting webcamToggle event');
    this.webcamToggle.emit();
    this.camOn = !this.camOn;
  }

  toggleMic(): void {
    this.micOn = !this.micOn;
    this.micToggle.emit();
  }

  leave(): void {
    this.leaveMeeting.emit();
  }
}
