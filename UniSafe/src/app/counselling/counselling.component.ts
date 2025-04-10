import { Component, OnInit, Renderer2 } from '@angular/core';
import { TimeoutService } from '../services/timeout.service';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ReportService } from '../services/report.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Appointment } from '../models/appointment';
import { AppointmentsService } from '../services/appointments.service';
import { GeminiService } from '../services/gemini.service';
import { MeetingService } from '../services/meeting.service'; // Import MeetingService

@Component({
  selector: 'app-counselling',
  templateUrl: './counselling.component.html',
  styleUrls: ['./counselling.component.css'],
})
export class CounsellingComponent implements OnInit {
  userData: any = {};
  appointmentForm!: FormGroup;
  reportId: string | null = null;
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  activeStatus: string | null = null;
  showChat = false;
  prompt: string = '';
  messageText: string = '';
  messages: { text: string; sender: 'user' | 'ai' }[] = [];
  currentPage = 1;
  appointmentsPerPage = 5;
  totalPages = 0;
  isAppointmentVisible: boolean = false;
  selectedAppointment: any;
  hasOnlineAppointments: boolean = false;

  constructor(
    private timeoutService: TimeoutService,
    private authService: AuthService,
    private router: Router,
    private reportService: ReportService,
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentsService,
    private geminiService: GeminiService,
    private renderer: Renderer2,
    private meetingService: MeetingService // Inject MeetingService
  ) {}

  ngOnInit(): void {
    this.timeoutService.resetTimer();
    this.authService.onLogout().subscribe(() => {
      this.router.navigate(['/login']);
    });
    this.reportId = this.reportService.reportId;

    const user = this.authService.getUser();
    if (user) {
      this.userData = user;
      this.initForm();
    }

    this.activeStatus = null;
    this.fetchAppointments();
    this.filterAppointments();
  }

  initForm(): void {
    this.appointmentForm = this.formBuilder.group({
      fullName: [this.userData.full_name],
      regNo: [this.userData.profile.reg_no],
      email: [this.userData.email, [Validators.required, Validators.email]],
      phone: [
        this.userData.phone_number,
        [Validators.required, Validators.pattern(/^\+255\d{9}$/)],
      ],
      reportId: [this.reportId],
      date: ['', Validators.required],
      gender: [this.userData.gender],
      sessionType: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const appointmentData = {
        report_id: this.appointmentForm.value.reportId,
        session_type: this.appointmentForm.value.sessionType,
        date: this.appointmentForm.value.date,
        student_full_name: this.appointmentForm.value.fullName,
        student_email: this.appointmentForm.value.email,
        student_phone: this.appointmentForm.value.phone,
        student_reg_no: this.appointmentForm.value.regNo,
        student_gender: this.appointmentForm.value.gender,
      };

      this.appointmentService.createAppointment(appointmentData).subscribe(
        (response) => {
          window.alert('Appointment Requested Successfully!');
          this.fetchAppointments();
        },
        (error) => {
          console.error('Error creating appointment:', error);
          window.alert(error.error.message);
        }
      );
    }
  }

  get phoneField() {
    return this.appointmentForm.get('phone');
  }

  get emailField() {
    return this.appointmentForm.get('email');
  }

  fetchAppointments(): void {
    this.appointmentService.getAppointments().subscribe(
      (data: Appointment[]) => {
        this.appointments = data.map((appointment) => ({
          ...appointment,
          created_on_date: new Date(appointment.created_on),
          start_time_date: appointment.start_time
            ? new Date(`1970-01-01T${appointment.start_time}`)
            : null,
        }));

        this.appointments.sort(
          (a, b) => b.created_on_date.getTime() - a.created_on_date.getTime()
        );

        this.filterAppointments(null);
      },
      (error) => {
        console.error('Error loading appointments:', error);
      }
    );
  }

  filterAppointments(status: string | null = null) {
    if (status === this.activeStatus) {
      this.activeStatus = null;
    } else {
      this.activeStatus = status;
    }

    if (this.activeStatus) {
      this.filteredAppointments = this.appointments.filter(
        (appointment) => appointment.status === this.activeStatus
      );
    } else {
      this.filteredAppointments = this.appointments;
    }

    this.calculateTotalPages();
    this.currentPage = 1;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(
      this.filteredAppointments.length / this.appointmentsPerPage
    );
  }

  getCurrentPageAppointments() {
    const startIndex = (this.currentPage - 1) * this.appointmentsPerPage;
    return this.filteredAppointments.slice(
      startIndex,
      startIndex + this.appointmentsPerPage
    );
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  toggleChat(): void {
    this.showChat = !this.showChat;
  }

  sendData() {
    if (this.messageText.trim()) {
      this.messages.push({ text: this.messageText, sender: 'user' });

      this.geminiService.generateText(this.messageText).subscribe(
        (response: string) => {
          this.messages.push({ text: response, sender: 'ai' });
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
      this.messageText = '';
    }
  }

  showAppointment(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    this.isAppointmentVisible = true;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    setTimeout(() => {
      const divreport = document.getElementById('divreport');
      divreport?.focus();
    }, 0);
  }

  hideAppointment() {
    this.isAppointmentVisible = false;
    this.selectedAppointment = null;
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  cancelAppointment(appointment: Appointment): void {
    this.appointmentService
      .cancelAppointment(appointment.appointment_id)
      .subscribe(
        (response) => {
          window.alert(response.message);
        },
        (error) => {
          window.alert(error.error.error);
        }
      );
  }

  attendOnline(appointment: Appointment) {
    if (
      appointment.session_type === 'Online' &&
      appointment.meeting_id &&
      appointment.meeting_token
    ) {
      console.log('Attending Online Appointment:', appointment);
      this.meetingService.setMeetingId(appointment.meeting_id);
      this.meetingService.setToken(appointment.meeting_token); // Set the meeting token
      this.router.navigate(['/joinscreen']);
    } else {
      console.error('Invalid Online Appointment:', appointment);
      window.alert(
        'This appointment does not have a valid meeting ID or token for online session.'
      );
    }
  }

  checkOnlineAppointments() {
    this.hasOnlineAppointments = this.appointments.some(
      (appointment) => appointment.session_type === 'Online'
    );
  }
}
