import { Component, inject, OnInit } from '@angular/core';
import { TimeoutService } from '../services/timeout.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ReportService } from '../services/report.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Appointment } from '../models/appointment';
import { AppointmentsService } from '../services/appointments.service';
import { GeminiService } from '../services/gemini.service';

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

  constructor(
    private timeoutService: TimeoutService,
    private authService: AuthService,
    private router: Router,
    private reportService: ReportService,
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentsService,
    private geminiService: GeminiService
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
          console.log('Appointment created successfully:', response);
          window.alert('Appointment created successfully');
        },
        (error) => {
          console.error('Error creating appointment:', error);
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
        this.appointments = data;

        this.appointments.forEach((appointment) => {
          appointment.created_on_date = new Date(appointment.created_on);
        });

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
  }

  toggleChat(): void {
    this.showChat = !this.showChat;
  }

  sendData() {
    if (this.messageText.trim()) {
      // Add user message to the messages array
      this.messages.push({ text: this.messageText, sender: 'user' });

      this.geminiService.generateText(this.messageText).subscribe(
        (response: string) => {
          // Add AI response to the messages array
          this.messages.push({ text: response, sender: 'ai' });
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
      this.messageText = '';
    }
  }
}
