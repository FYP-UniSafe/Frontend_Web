import {
  Component,
  OnInit,
  AfterViewInit,
  Renderer2,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { VideoSDK } from '@videosdk.live/js-sdk';
import { MeetingService } from '../services/meeting.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css'],
})
export class VideoCallComponent implements OnInit, AfterViewInit {
  meeting: any;
  participantName: string = '';
  isConsultant: boolean = false;
  isStudent: boolean = false;
  meetingId: string | null = null;
  token: string | null = null;
  showMeetingScreen: boolean = false;
  showJoinScreen: boolean = true;
  showTopBar: boolean = false;
  localParticipant: any;
  participants: any;
  isWebcamOn: boolean = true;
  isMicOn: boolean = true;

  @ViewChild('participantGridContainer', { static: false })
  participantGridContainer!: ElementRef;

  constructor(
    private meetingService: MeetingService,
    private authService: AuthService,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.participantName = user.full_name;
      this.isConsultant = user.is_consultant;
      this.isStudent = user.is_student;
    }

    this.retrieveMeetingDetailsFromStorage();
  }

  retrieveMeetingDetailsFromStorage(): void {
    this.meetingId = localStorage.getItem('meetingId');
    this.token = localStorage.getItem('token');

    if (this.meetingId && this.token) {
      this.joinMeeting();
    } else {
      this.retrieveMeetingDetails();
    }
  }

  ngAfterViewInit(): void {
    this.initMeeting();
  }

  retrieveMeetingDetails(): void {
    this.meetingId = this.meetingService.getMeetingId();
    this.token = this.meetingService.getTokenFromService();

    if (this.meetingId && this.token) {
      localStorage.setItem('meetingId', this.meetingId);
      localStorage.setItem('token', this.token);
      this.joinMeeting();
    } else {
      console.error('No meeting ID or token found.');
    }
  }

  async initMeeting(): Promise<void> {
    if (!this.token) {
      console.error('No token found for initializing the meeting.');
      return;
    }

    VideoSDK.config(this.token);

    this.meeting = VideoSDK.initMeeting({
      meetingId: this.meetingId!,
      name: this.participantName,
      micEnabled: true,
      webcamEnabled: true,
    });
  }

  async joinMeeting(): Promise<void> {
    await this.initMeeting();
    this.meeting.join();

    this.handleMeetingEvents(this.meeting);

    this.showMeetingScreen = true;
  }

  handleMeetingEvents(meeting: any): void {
    this.localParticipant = meeting.localParticipant;
    this.participants = meeting.participants;

    if (meeting) {
      this.showJoinScreen = false;
      this.showMeetingScreen = true;
    }

    meeting.on('meeting-joined', () => {
      this.showTopBar = true;

      const { getParticipantMediaElement } = this.participantGridGenerator(
        this.meeting.localParticipant
      );

      meeting.localParticipant.on('stream-enabled', (stream: any) => {
        this.handleStreamEnabled(
          stream,
          meeting.localParticipant,
          true,
          getParticipantMediaElement
        );
      });
      meeting.localParticipant.on('stream-disabled', (stream: any) => {
        this.handleStreamDisabled(
          stream,
          meeting.localParticipant,
          true,
          getParticipantMediaElement
        );
      });
    });

    meeting.on('meeting-left', () => {
      while (this.participantGridContainer.nativeElement.firstChild) {
        this.participantGridContainer.nativeElement.removeChild(
          this.participantGridContainer.nativeElement.firstChild
        );
      }
      this.showMeetingScreen = false;
      this.showJoinScreen = true;
    });

    meeting.on('participant-joined', (participant: any) => {
      const { getParticipantMediaElement } =
        this.participantGridGenerator(participant);

      participant.on('stream-enabled', (stream: any) => {
        this.handleStreamEnabled(
          stream,
          participant,
          false,
          getParticipantMediaElement
        );
      });
      participant.on('stream-disabled', (stream: any) => {
        this.handleStreamDisabled(
          stream,
          participant,
          false,
          getParticipantMediaElement
        );
      });
    });

    meeting.on('participant-left', (participant: any) => {
      this.handleParticipantLeft(participant);
    });
  }

  handleStreamEnabled(
    stream: any,
    participant: any,
    isLocal: any,
    participantMediaElement: any
  ): void {
    if (stream.kind == 'video') {
      var nameElement = document.getElementById(
        `name-container-${participant.id}`
      );
      if (nameElement) {
        this.renderer.removeChild(participantMediaElement, nameElement);
      }
      this.createVideoElement(stream, participant, participantMediaElement);
    }
    if (!isLocal && stream.kind == 'audio') {
      this.createAudioElement(stream, participant, participantMediaElement);
    }
  }

  handleStreamDisabled(
    stream: any,
    participant: any,
    isLocal: any,
    participantMediaElement: any
  ): void {
    if (stream.kind == 'video') {
      var videoElement = document.getElementById(
        `video-container-${participant.id}`
      );
      if (videoElement) {
        this.renderer.removeChild(participantMediaElement, videoElement);
      }
      var nameElement = this.createNameElement(participant);
      this.renderer.appendChild(participantMediaElement, nameElement);
    }
    if (!isLocal && stream.kind == 'audio') {
      var audioElement = document.getElementById(
        `audio-container-${participant.id}`
      );
      if (audioElement) {
        this.renderer.removeChild(participantMediaElement, audioElement);
      }
    }
  }

  handleParticipantLeft(participant: any): void {
    var participantGridItem = document.getElementById(
      `participant-grid-item-${participant.id}`
    );
    if (participantGridItem) {
      this.renderer.removeChild(
        this.participantGridContainer.nativeElement,
        participantGridItem
      );
    }
  }

  createVideoElement(
    stream: any,
    participant: any,
    participantMediaElement: any
  ): void {
    const video = this.renderer.createElement('video');
    const mediaStream = new MediaStream();
    mediaStream.addTrack(stream.track);
    this.renderer.setAttribute(video, 'id', `v-${participant.id}`);
    this.renderer.setAttribute(video, 'autoplay', 'true');
    this.renderer.setAttribute(video, 'playsinline', 'true');
    this.renderer.setAttribute(video, 'muted', 'true');
    this.renderer.setStyle(video, 'width', '100%');
    this.renderer.setStyle(video, 'height', '100%');
    this.renderer.setStyle(video, 'position', 'absolute');
    this.renderer.setStyle(video, 'top', '0');
    this.renderer.setStyle(video, 'left', '0');
    this.renderer.setStyle(video, 'object-fit', 'cover');
    this.renderer.setProperty(video, 'srcObject', mediaStream);

    const videoElement = this.renderer.createElement('div');
    this.renderer.setAttribute(
      videoElement,
      'id',
      `video-container-${participant.id}`
    );
    this.renderer.setStyle(videoElement, 'width', '100%');
    this.renderer.setStyle(videoElement, 'height', '100%');
    this.renderer.setStyle(videoElement, 'position', 'relative');
    this.renderer.appendChild(participantMediaElement, videoElement);
    this.renderer.appendChild(videoElement, video);

    const cornerDisplayName = this.renderer.createElement('div');
    this.renderer.setAttribute(
      cornerDisplayName,
      'id',
      `name-container-${participant.id}`
    );
    this.renderer.setStyle(cornerDisplayName, 'position', 'absolute');
    this.renderer.setStyle(cornerDisplayName, 'bottom', '16px');
    this.renderer.setStyle(cornerDisplayName, 'left', '16px');
    this.renderer.setStyle(cornerDisplayName, 'color', 'white');
    this.renderer.setStyle(
      cornerDisplayName,
      'backgroundColor',
      'rgba(0, 0, 0, 0.5)'
    );
    this.renderer.setStyle(cornerDisplayName, 'padding', '2px');
    this.renderer.setStyle(cornerDisplayName, 'borderRadius', '2px');
    this.renderer.setStyle(cornerDisplayName, 'fontSize', '12px');
    this.renderer.setStyle(cornerDisplayName, 'fontWeight', 'bold');
    this.renderer.setStyle(cornerDisplayName, 'zIndex', '1');
    this.renderer.setStyle(cornerDisplayName, 'padding', '4px');
    cornerDisplayName.innerHTML =
      participant.displayName.length > 15
        ? participant.displayName.substring(0, 15) + '...'
        : participant.displayName;
    this.renderer.appendChild(videoElement, cornerDisplayName);
  }

  createAudioElement(
    stream: any,
    participant: any,
    participantMediaElement: any
  ): void {
    const audio = this.renderer.createElement('audio');
    const mediaStream = new MediaStream();
    mediaStream.addTrack(stream.track);
    this.renderer.setAttribute(audio, 'id', `a-${participant.id}`);
    this.renderer.setAttribute(audio, 'autoplay', 'true');
    this.renderer.setAttribute(audio, 'playsinline', 'true');
    this.renderer.setProperty(audio, 'srcObject', mediaStream);

    const audioElement = this.renderer.createElement('div');
    this.renderer.setAttribute(
      audioElement,
      'id',
      `audio-container-${participant.id}`
    );
    this.renderer.appendChild(participantMediaElement, audioElement);
    this.renderer.appendChild(audioElement, audio);
  }

  createNameElement(participant: any): any {
    const nameElement = this.renderer.createElement('div');
    this.renderer.setAttribute(
      nameElement,
      'id',
      `name-container-${participant.id}`
    );
    this.renderer.setStyle(nameElement, 'width', '100%');
    this.renderer.setStyle(nameElement, 'height', '100%');
    this.renderer.setStyle(nameElement, 'display', 'flex');
    this.renderer.setStyle(nameElement, 'justifyContent', 'center');
    this.renderer.setStyle(nameElement, 'alignItems', 'center');
    this.renderer.setStyle(nameElement, 'color', 'white');
    this.renderer.setStyle(nameElement, 'backgroundColor', 'black');
    this.renderer.setStyle(nameElement, 'fontSize', '24px');
    this.renderer.setStyle(nameElement, 'fontWeight', 'bold');
    nameElement.innerHTML =
      participant.displayName.length > 15
        ? participant.displayName.substring(0, 15) + '...'
        : participant.displayName;
    return nameElement;
  }

  participantGridGenerator(participant: any): any {
    const participantGridItem = this.renderer.createElement('div');
    this.renderer.setAttribute(
      participantGridItem,
      'id',
      `participant-grid-item-${participant.id}`
    );
    this.renderer.addClass(participantGridItem, 'participant-grid-item');

    const participantMediaElement = this.renderer.createElement('div');
    this.renderer.setAttribute(
      participantMediaElement,
      'id',
      `participant-media-container-${participant.id}`
    );
    this.renderer.setStyle(participantMediaElement, 'position', 'relative');
    this.renderer.setStyle(participantMediaElement, 'width', '100%');
    this.renderer.setStyle(participantMediaElement, 'height', '100%');

    this.renderer.appendChild(participantGridItem, participantMediaElement);
    this.renderer.appendChild(
      this.participantGridContainer.nativeElement,
      participantGridItem
    );

    return {
      getParticipantMediaElement: participantMediaElement,
    };
  }

  toggleWebcam(): void {
    if (this.localParticipant) {
      if (this.isWebcamOn) {
        console.log('Disabling webcam');
        this.meeting.disableWebcam();
      } else {
        console.log('Enabling webcam');
        this.meeting.enableWebcam();
      }
      this.isWebcamOn = !this.isWebcamOn;
    }
  }

  toggleMic(): void {
    if (this.localParticipant) {
      if (this.isMicOn) {
        console.log('Disabling mic');
        this.meeting.muteMic();
      } else {
        console.log('Enabling mic');
        this.meeting.unmuteMic();
      }
      this.isMicOn = !this.isMicOn;
    }
  }

  leaveMeeting(): void {
    if (this.meeting) {
      this.meeting.leave();
    }
    this.showMeetingScreen = false;
    this.showJoinScreen = true;
    this.showTopBar = false;
    localStorage.removeItem('meetingId');
    localStorage.removeItem('token');
    if (this.isConsultant) {
      this.router.navigate(['/consultant']);
    } else if (this.isStudent) {
      this.router.navigate(['/counselling']);
    }
  }
}
