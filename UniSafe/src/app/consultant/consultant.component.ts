import { Component, OnInit, Renderer2 } from '@angular/core';
import { TimeoutService } from '../services/timeout.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppointmentsService } from '../services/appointments.service';
import { Appointment } from '../models/appointment';

@Component({
  selector: 'app-consultant',
  templateUrl: './consultant.component.html',
  styleUrls: ['./consultant.component.css'],
})
export class ConsultantComponent implements OnInit {
  userEmail: string = '';
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  activeStatus: string | null = null;
  currentPage = 1;
  appointmentsPerPage = 5;
  totalPages = 0;
  isAppointmentVisible: boolean = false;
  selectedAppointment: any;
  appointmentType: string = 'Physical';
  showAllAppointments: boolean = false;

  constructor(
    private timeoutService: TimeoutService,
    private authService: AuthService,
    private router: Router,
    private appointmentService: AppointmentsService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.timeoutService.resetTimer();
    this.authService.onLogout().subscribe(() => {
      this.router.navigate(['/login']);
    });
    const user = this.authService.getUser();
    if (user) {
      this.userEmail = user.email;
    }
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe(
      (data: Appointment[]) => {
        this.appointments = data.map((appointment) => ({
          ...appointment,
          created_on_date: new Date(appointment.created_on),
        }));
        this.applyFilters();
      },
      (error) => {
        console.error('Error loading appointments:', error);
      }
    );
  }

  applyFilters() {
    this.filteredAppointments = this.appointments.filter(
      (appointment) =>
        (!this.activeStatus || appointment.status === this.activeStatus) &&
        appointment.session_type.toLowerCase() ===
          this.appointmentType.toLowerCase() &&
        (this.showAllAppointments || appointment.consultant === this.userEmail)
    );
    this.calculateTotalPages();
    this.currentPage = 1;
  }

  filterAppointments(status: string | null = null) {
    this.activeStatus = status === this.activeStatus ? null : status;
    this.applyFilters();
  }

  onAppointmentFilterChange() {
    this.applyFilters();
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

  switchAppointmentType(type: string) {
    this.appointmentType = type;
    this.applyFilters();
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

  attendOnline() {
    // this.router.navigate(['/online']);
  }
}
