import { Component, OnInit } from '@angular/core';
import { TimeoutService } from '../services/timeout.service';
import { ReportService } from '../services/report.service';
import { Report } from '../models/report';

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

  constructor(
    private timeoutService: TimeoutService,
    private reportService: ReportService,
  ) {}

  ngOnInit(): void {
    this.timeoutService.resetTimer();
    // this.activeStatus = '';
    this.fetchReports();
    this.filterReports('');
  }

  fetchReports() {
    this.reportService.getStudentReports().subscribe(
      (reports: Report[]) => {
        this.reports = reports.sort((a, b) => {
          const lastCharA = a.report_id.split('-').pop();
          const lastCharB = b.report_id.split('-').pop();
          return Number(lastCharA) - Number(lastCharB);
        });
        this.filterReports(null);
      },
      (error) => {
        console.error('Error fetching reports:', error);
      }
    );
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
