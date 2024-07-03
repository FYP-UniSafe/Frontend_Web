import {
  Component,
  OnInit,
  AfterViewInit,
  Renderer2,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { VideoSDK } from '@videosdk.live/js-sdk'; // Adjust path as per your setup
import { MeetingService } from '../services/meeting.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css'],
})
export class VideoCallComponent implements OnInit, AfterViewInit {
  meeting: any;
  participantName: string = '';
  meetingId: string | null = null;
  token: string | null = null;
  showMeetingScreen: boolean = false;
  showJoinScreen: boolean = true;
  showTopBar: boolean = false;
  localParticipant: any;
  participants: any;

  @ViewChild('participantGridContainer', { static: false })
  participantGridContainer!: ElementRef;

  constructor(
    private meetingService: MeetingService,
    private authService: AuthService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.participantName = user.full_name;
    }

    this.retrieveMeetingDetails();
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit called'); // Debug log
    this.initMeeting();
  }

  retrieveMeetingDetails(): void {
    this.meetingId = this.meetingService.getMeetingId();
    this.token = this.meetingService.getTokenFromService();

    if (this.meetingId && this.token) {
      console.log('Meeting ID:', this.meetingId);
      console.log('Token:', this.token);
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
      meetingId: this.meetingId!, // required
      name: this.participantName, // required
      micEnabled: true, // optional, default: true
      webcamEnabled: true, // optional, default: true
    });
  }

  async joinMeeting(): Promise<void> {
    await this.initMeeting();
    this.meeting.join();

    this.handleMeetingEvents(this.meeting);

    const showJoinScreenMessage = this.renderer.createElement('div');
    this.renderer.setAttribute(
      showJoinScreenMessage,
      'id',
      'show-join-screen-message'
    );
    this.renderer.setProperty(
      showJoinScreenMessage,
      'innerHTML',
      'Please wait to join meeting...'
    );
    this.renderer.setStyle(showJoinScreenMessage, 'color', 'black');
    this.renderer.setStyle(showJoinScreenMessage, 'fontSize', '20px');
    this.renderer.setStyle(showJoinScreenMessage, 'fontWeight', 'bold');
    this.renderer.setStyle(showJoinScreenMessage, 'marginTop', '20px');
    this.renderer.setStyle(showJoinScreenMessage, 'marginLeft', '20px');
    this.renderer.appendChild(document.body, showJoinScreenMessage);

    this.showMeetingScreen = true;
    console.log('showMeetingScreen set to true'); // Debug log
  }

  handleMeetingEvents(meeting: any): void {
    this.localParticipant = meeting.localParticipant;
    this.participants = meeting.participants;

    if (meeting) {
      this.showJoinScreen = false;
      this.showMeetingScreen = true;
      console.log('showMeetingScreen inside handleMeetingEvents set to true'); // Debug log
    }

    // meeting joined event
    meeting.on('meeting-joined', () => {
      const showJoinScreenMessage = document.getElementById(
        'show-join-screen-message'
      );
      if (showJoinScreenMessage) {
        this.renderer.removeChild(document.body, showJoinScreenMessage);
      }
      const { getParticipantMediaElement } = this.participantGridGenerator(
        this.meeting.localParticipant
      );
      this.showTopBar = true;

      meeting.localParticipant.on('stream-enabled', (stream: any) => {
        console.log('Stream Enabled: ', stream);
        this.handleStreamEnabled(
          stream,
          meeting.localParticipant,
          true,
          getParticipantMediaElement
        );
      });
      meeting.localParticipant.on('stream-disabled', (stream: any) => {
        console.log('Stream Disabled: ', stream);
        this.handleStreamDisabled(
          stream,
          meeting.localParticipant,
          true,
          getParticipantMediaElement
        );
      });
    });

    // meeting left event
    meeting.on('meeting-left', () => {
      while (this.participantGridContainer.nativeElement.firstChild) {
        this.participantGridContainer.nativeElement.removeChild(
          this.participantGridContainer.nativeElement.firstChild
        );
      }
      this.showMeetingScreen = false;
      this.showJoinScreen = true;
    });

    // remote participant events
    meeting.on('participant-joined', (participant: any) => {
      console.log('New Participant Joined: ', participant.id);

      const { getParticipantMediaElement } =
        this.participantGridGenerator(participant);

      participant.on('stream-enabled', (stream: any) => {
        console.log('Participant Stream Enabled: ', stream);
        this.handleStreamEnabled(
          stream,
          participant,
          false,
          getParticipantMediaElement
        );
      });
      participant.on('stream-disabled', (stream: any) => {
        console.log('Participant Stream Disabled: ', stream);
        this.handleStreamDisabled(
          stream,
          participant,
          false,
          getParticipantMediaElement
        );
      });
    });

    meeting.on('participant-left', (participant: any) => {
      console.log('Participant Left: ', participant.id);
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
    this.renderer.setAttribute(audio, 'id', `audio-${participant.id}`);
    this.renderer.setAttribute(audio, 'autoplay', 'true');
    this.renderer.setAttribute(audio, 'playsinline', 'true');
    this.renderer.setAttribute(audio, 'muted', 'true');
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

  createNameElement(participant: any): HTMLElement {
    var nameElement = this.renderer.createElement('div');
    this.renderer.setAttribute(
      nameElement,
      'id',
      `name-container-${participant.id}`
    );
    nameElement.innerHTML = participant.displayName.charAt(0).toUpperCase();
    this.renderer.setStyle(nameElement, 'backgroundColor', 'black');
    this.renderer.setStyle(nameElement, 'color', 'white');
    this.renderer.setStyle(nameElement, 'textAlign', 'center');
    this.renderer.setStyle(nameElement, 'padding', '32px');
    this.renderer.setStyle(nameElement, 'borderRadius', '100%');
    this.renderer.setStyle(nameElement, 'fontSize', '20px');
    return nameElement;
  }

  participantGridGenerator(participant: any): {
    getParticipantMediaElement: HTMLElement;
  } {
    var participantGridItem = this.renderer.createElement('div');
    this.renderer.setStyle(participantGridItem, 'backgroundColor', 'lightgrey');
    this.renderer.setStyle(participantGridItem, 'borderRadius', '10px');
    this.renderer.setStyle(participantGridItem, 'aspectRatio', '16 / 9');
    this.renderer.setStyle(participantGridItem, 'width', '360px');
    this.renderer.setStyle(participantGridItem, 'marginTop', '8px');
    this.renderer.setStyle(participantGridItem, 'display', 'flex');
    this.renderer.setStyle(participantGridItem, 'alignItems', 'center');
    this.renderer.setStyle(participantGridItem, 'justifyContent', 'center');
    this.renderer.setStyle(participantGridItem, 'overflow', 'hidden');
    this.renderer.setAttribute(
      participantGridItem,
      'id',
      `participant-grid-item-${participant.id}`
    );
    this.renderer.setAttribute(participantGridItem, 'class', 'col-4');

    var participantMediaElement = this.renderer.createElement('div');
    this.renderer.setAttribute(
      participantMediaElement,
      'id',
      `participant-media-container-${participant.id}`
    );
    this.renderer.setStyle(participantMediaElement, 'position', 'relative');
    this.renderer.setStyle(participantMediaElement, 'width', '100%');
    this.renderer.setStyle(participantMediaElement, 'height', '100%');
    this.renderer.setStyle(participantMediaElement, 'display', 'flex');
    this.renderer.setStyle(participantMediaElement, 'alignItems', 'center');
    this.renderer.setStyle(participantMediaElement, 'justifyContent', 'center');

    var nameElement = this.createNameElement(participant);
    this.renderer.appendChild(
      this.participantGridContainer.nativeElement,
      participantGridItem
    );
    this.renderer.appendChild(participantGridItem, participantMediaElement);
    this.renderer.appendChild(participantMediaElement, nameElement);

    var getParticipantMediaElement = document.getElementById(
      `participant-media-container-${participant.id}`
    ) as HTMLElement;

    return { getParticipantMediaElement };
  }
}
