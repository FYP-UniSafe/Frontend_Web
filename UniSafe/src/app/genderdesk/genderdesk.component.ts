import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TimeoutService } from '../services/timeout.service';
import { ReportService } from '../services/report.service';
import { Report } from '../models/report';

@Component({
  selector: 'app-genderdesk',
  templateUrl: './genderdesk.component.html',
  styleUrls: ['./genderdesk.component.css'], // Fixed typo: should be 'styleUrls' instead of 'styleUrl'
})
export class GenderdeskComponent implements OnInit {
  userFullName: string = '';
  userEmail: string = '';
  genderDesk: string = 'GenderDesk';
  showAllReports: boolean = false;
  reports: Report[] = [];
  filteredReports: Report[] = [];
  activeStatus: string | null = null;
  reportType: string = 'NORMAL';

  constructor(
    private authService: AuthService,
    private timeoutService: TimeoutService,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.timeoutService.resetTimer();
    const user = this.authService.getUser();
    if (user) {
      this.userFullName = user.full_name;
      this.genderDesk = user.profile.custom_id;
      this.userEmail = user.email;
    }

    this.fetchReports(); // By default fetch normal reports
  }

  onReportsFilterChange() {
    this.filterReports(this.activeStatus); // Apply filtering based on checkbox state
  }

  fetchReports() {
    this.reportService.getNormalReports().subscribe(
      (reports: Report[]) => {
        this.reports = reports.sort((a, b) => {
          const lastCharA = a.report_id.split('-').pop();
          const lastCharB = b.report_id.split('-').pop();
          return Number(lastCharA) - Number(lastCharB);
        });

        // Convert the created_on string to a Date object for each report
        this.reports.forEach((report) => {
          report.created_on_date = new Date(report.created_on);
        });

        this.filterReports(this.activeStatus);
      },
      (error) => {
        console.error('Error fetching reports:', error);
      }
    );
  }

  fetchAnonymousReports() {
    this.reportService.getAnonymousReports().subscribe(
      (reports: Report[]) => {
        this.reports = reports.sort((a, b) => {
          const lastCharA = a.report_id.split('-').pop();
          const lastCharB = b.report_id.split('-').pop();
          return Number(lastCharA) - Number(lastCharB);
        });

        // Convert the created_on string to a Date object for each report
        this.reports.forEach((report) => {
          report.created_on_date = new Date(report.created_on);
        });

        this.filterReports(this.activeStatus);
      },
      (error) => {
        console.error('Error fetching anonymous reports:', error);
      }
    );
  }

  filterReports(status: string | null = null) {
    if (status === this.activeStatus) {
      this.activeStatus = null;
    } else {
      this.activeStatus = status;
    }

    let filteredReports = this.reports;

    if (this.activeStatus) {
      filteredReports = filteredReports.filter(
        (report) => report.status === this.activeStatus
      );
    }

    if (!this.showAllReports) {
      filteredReports = filteredReports.filter(
        (report) => report.assigned_gd === this.userEmail
      );
    }

    this.filteredReports = filteredReports;
  }

  switchReportType(type: string) {
    this.reportType = type;
    if (type === 'NORMAL') {
      this.fetchReports();
    } else if (type === 'ANONYMOUS') {
      this.fetchAnonymousReports();
    }
  }
}
