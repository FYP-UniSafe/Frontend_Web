import { Component, OnInit } from '@angular/core';
import { TimeoutService } from '../services/timeout.service';
import { ReportService } from '../services/report.service';
import { Report } from '../models/report';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  reports: Report[] = [];
  filteredReports: Report[] = [];
  // activeStatus: string | undefined = '';
  activeStatus: string | null = null;
  authenticated: boolean = false;

  constructor(
    private timeoutService: TimeoutService,
    private reportService: ReportService,
    private authService: AuthService, 
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.timeoutService.resetTimer();
    const user = this.authService.getUser();
    if (user) {
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }

    // this.activeStatus = '';
    this.fetchReports();
    this.filterReports('');

    this.authService.onLogout().subscribe(() => {
      this.router.navigate(['/login']);
    });

  }

  fetchReports() {
    if (this.authenticated === true){
      this.reportService.getStudentReports().subscribe(
        (reports: Report[]) => {
          this.reports = reports.sort((a, b) => {
            const lastCharA = a.report_id.split('-').pop();
            const lastCharB = b.report_id.split('-').pop();
            return Number(lastCharA) - Number(lastCharB);
          });
  
          // Convert the created_on string to a Date object for each report
          this.reports.forEach(report => {
            report.created_on_date = new Date(report.created_on);
          });
  
          this.filterReports(null);
        },
        (error) => {
          console.error('Error fetching reports:', error);
        }
      );
    }
  }

  filterReports(status: string | null = null) {
    if (status === this.activeStatus) {
      this.activeStatus = null;
    } else {
      this.activeStatus = status;
    }

    if (this.activeStatus) {
      this.filteredReports = this.reports.filter(
        (report) => report.status === this.activeStatus
      );
    } else {
      this.filteredReports = this.reports;
    }
  }
}
