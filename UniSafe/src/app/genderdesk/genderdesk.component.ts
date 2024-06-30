import {
  Component,
  OnInit,
  Renderer2,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TimeoutService } from '../services/timeout.service';
import { ReportService } from '../services/report.service';
import { Report } from '../models/report';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { Chart, ChartOptions } from 'chart.js';
// import { Location } from '@angular/common';

@Component({
  selector: 'app-genderdesk',
  templateUrl: './genderdesk.component.html',
  styleUrls: ['./genderdesk.component.css'],
})
export class GenderdeskComponent implements OnInit, OnDestroy, AfterViewInit {
  userEmail: string = '';
  showAllReports: boolean = false;
  normalReports: Report[] = [];
  anonymousReports: Report[] = [];
  filteredReports: Report[] = [];
  activeStatus: string | null = null;
  reportType: string = 'NORMAL';
  currentPage = 1;
  reportsPerPage = 5;
  totalPages = 0;
  selectedReport: any;
  isReportVisible: boolean = false;
  isRejectDialogOpen = false;
  rejectionReason = '';
  normalPending = 0;
  normalAccepted = 0;
  anonymousPending = 0;
  anonymousAccepted = 0;

  abuseTypeCounts: { [key: string]: number } = {
    'Physical Violence': 0,
    'Sexual Violence': 0,
    'Psychological Violence': 0,
    'Online Harassment': 0,
    'Societal Violence': 0,
  };

  anonymousAbuseTypeCounts: { [key: string]: number } = {
    'Physical Violence': 0,
    'Sexual Violence': 0,
    'Psychological Violence': 0,
    'Online Harassment': 0,
    'Societal Violence': 0,
  };

  private radarChart: any;
  private radarChart2: any;

  constructor(
    private authService: AuthService,
    private timeoutService: TimeoutService,
    private reportService: ReportService,
    private renderer: Renderer2,
    private router: Router // private location: Location
  ) {}

  ngOnInit() {
    this.timeoutService.resetTimer();
    const user = this.authService.getUser();
    if (user) {
      this.userEmail = user.email;
    }

    this.fetchReports();
    this.fetchAnonymousReports();
  }

  ngAfterViewInit() {
    // Ensure the chart is rendered after the view has been initialized
    this.renderRadarChart();
  }

  onReportsFilterChange() {
    this.filterReports(this.activeStatus);
  }

  ngOnDestroy(): void {
    // Ensure body overflow is reset when component is destroyed
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  fetchReports() {
    this.reportService.getNormalReports().subscribe(
      (reports: Report[]) => {
        // Sort reports by created_on date in descending order
        this.normalReports = reports.sort((a, b) => {
          return (
            new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
          );
        });
        // Convert the created_on string to a Date object for each report
        this.normalReports.forEach((report) => {
          report.created_on_date = new Date(report.created_on);
        });
        this.filterReports(this.activeStatus);
        this.countReportStatuses();
        this.countAbuseTypes();
        this.renderRadarChart();
      },
      (error) => {
        console.error('Error fetching reports:', error);
      }
    );
  }

  fetchAnonymousReports() {
    this.reportService.getAnonymousReports().subscribe(
      (reports: Report[]) => {
        // Sort reports by created_on date in descending order
        this.anonymousReports = reports.sort((a, b) => {
          return (
            new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
          );
        });
        // Convert the created_on string to a Date object for each report
        this.anonymousReports.forEach((report) => {
          report.created_on_date = new Date(report.created_on);
        });
        this.filterReports(this.activeStatus);
        this.countAnonymousReportStatuses();
        this.countAbuseTypes();
        this.renderRadarChart();
        this.renderAnonymousRadarChart();
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
    let filteredReports =
      this.reportType === 'NORMAL' ? this.normalReports : this.anonymousReports;
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
    this.calculateTotalPages();
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(
      this.filteredReports.length / this.reportsPerPage
    );
  }

  countReportStatuses() {
    this.normalPending = 0;
    this.normalAccepted = 0;
    this.normalReports.forEach((report) => {
      if (report.status === 'PENDING') {
        this.normalPending++;
      } else {
        this.normalAccepted++;
      }
    });
  }

  countAnonymousReportStatuses() {
    this.anonymousPending = 0;
    this.anonymousAccepted = 0;
    this.anonymousReports.forEach((report) => {
      if (report.status === 'PENDING') {
        this.anonymousPending++;
      } else {
        this.anonymousAccepted++;
      }
    });
  }

  countAbuseTypes() {
    this.abuseTypeCounts = {
      'Physical Violence': 0,
      'Sexual Violence': 0,
      'Psychological Violence': 0,
      'Online Harassment': 0,
      'Societal Violence': 0,
    };
    this.normalReports.forEach((report) => {
      if (this.abuseTypeCounts.hasOwnProperty(report.abuse_type)) {
        this.abuseTypeCounts[report.abuse_type]++;
      }
    });
    this.anonymousAbuseTypeCounts = {
      'Physical Violence': 0,
      'Sexual Violence': 0,
      'Psychological Violence': 0,
      'Online Harassment': 0,
      'Societal Violence': 0,
    };
    this.anonymousReports.forEach((report) => {
      if (this.anonymousAbuseTypeCounts.hasOwnProperty(report.abuse_type)) {
        this.anonymousAbuseTypeCounts[report.abuse_type]++;
      }
    });
  }

  renderRadarChart() {
    const ctx = document.getElementById('radarChart') as HTMLCanvasElement;
    if (ctx && this.abuseTypeCounts) {
      if (this.radarChart) {
        this.radarChart.destroy();
      }
      this.radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: Object.keys(this.abuseTypeCounts),
          datasets: [
            {
              label: 'Reports per Abuse Types',
              data: Object.values(this.abuseTypeCounts),
              backgroundColor: 'rgba(255, 99, 132, 0.4)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            r: {
              ticks: {
                beginAtZero: true,
              },
            },
          },
        } as ChartOptions<'radar'>,
      });
    }
  }

  renderAnonymousRadarChart() {
    const ctx = document.getElementById('radarChart2') as HTMLCanvasElement;
    if (ctx && this.anonymousAbuseTypeCounts) {
      if (this.radarChart2) {
        this.radarChart2.destroy();
      }
      this.radarChart2 = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: Object.keys(this.anonymousAbuseTypeCounts),
          datasets: [
            {
              label: 'Anonymous Reports per Abuse Types',
              data: Object.values(this.anonymousAbuseTypeCounts),
              backgroundColor: 'rgba(255, 99, 132, 0.4)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            r: {
              ticks: {
                beginAtZero: true,
              },
            },
          },
        } as ChartOptions<'radar'>,
      });
    }
  }

  getCurrentPageReports() {
    const startIndex = (this.currentPage - 1) * this.reportsPerPage;
    return this.filteredReports.slice(
      startIndex,
      startIndex + this.reportsPerPage
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

  switchReportType(type: string) {
    this.reportType = type;
    this.filterReports(this.activeStatus);
  }

  showReport(report: any) {
    this.selectedReport = report;
    this.isReportVisible = true;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    setTimeout(() => {
      const divreport = document.getElementById('divreport');
      divreport?.focus();
    }, 0);
  }

  hideReport() {
    this.isReportVisible = false;
    this.selectedReport = null;
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  downloadReport() {
    const thereport = document.getElementById('thereport');
    if (thereport) {
      html2canvas(thereport, {
        scale: 2,
        scrollY: -window.scrollY,
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        const imgProps = pdf.getImageProperties(imgData);
        const numPages = Math.ceil(
          pdfHeight / pdf.internal.pageSize.getHeight()
        );
        for (let i = 0; i < numPages; i++) {
          const heightLeft = i * pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, 'PNG', 0, -heightLeft, pdfWidth, pdfHeight);
          if (i < numPages - 1) {
            pdf.addPage();
          }
        }
        pdf.save('report.pdf');
      });
    }
  }

  prepareAndDownloadReport(report: any) {
    this.showReport(report);
    setTimeout(() => {
      this.downloadReport();
    }, 500); // Adjust timing as needed to ensure HTML is fully rendered
  }

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(url);
  }

  isVideo(url: string): boolean {
    return /\.(mp4|mov)$/i.test(url);
  }

  isAudio(url: string): boolean {
    return /\.(mp3|wav)$/i.test(url);
  }

  openFullScreenPreview(mediaUrl: string): void {
    const isImageOrVideo = this.isImage(mediaUrl) || this.isVideo(mediaUrl);
    if (!isImageOrVideo) return;
    const previewElement = document.createElement(
      isImageOrVideo ? 'img' : 'video'
    );
    previewElement.src = mediaUrl;
    if (!this.isImage(mediaUrl)) {
      previewElement.setAttribute('controls', 'true');
      if (isImageOrVideo) {
        (previewElement as HTMLVideoElement).play();
      }
    }
    previewElement.style.width = '100%';
    previewElement.style.height = '100%';
    document.body.appendChild(previewElement);
    previewElement.onclick = function () {
      document.body.removeChild(previewElement);
    };
  }

  togglePlayAudio(event: MouseEvent): void {
    const audioElement = event.target as HTMLAudioElement;
    if (audioElement.paused) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
    event.stopPropagation();
  }

  openRejectDialog() {
    this.isRejectDialogOpen = true;
  }

  isAnonymousReport(reportId: string): boolean {
    return reportId.startsWith('A-RE');
  }

  // navigateAndReload() {
  //   this.router.navigateByUrl('/genderdesk').then(() => {
  //     window.location.reload();
  //   });
  // }

  acceptReport(report: Report) {
    if (this.isAnonymousReport(report.report_id)) {
      this.reportService.acceptAnonymous(report.report_id).subscribe({
        next: (response) => {
          window.alert(response.message);
          this.router.navigate(['/genderdesk']);
          // this.navigateAndReload;
        },
        error: (error) => {
          const errorMessage = error.error
            ? error.error.error
            : 'An unknown error occurred';
          window.alert(errorMessage);
        },
      });
    } else {
      this.reportService.acceptReport(report.report_id).subscribe({
        next: (response) => {
          window.alert(response.message);
          this.router.navigate(['/genderdesk']);
          // this.navigateAndReload;
        },
        error: (error) => {
          const errorMessage = error.error
            ? error.error.error
            : 'An unknown error occurred';
          window.alert(errorMessage);
        },
      });
    }
  }

  rejectReport(report: Report, rejectionReason: string) {
    if (this.isAnonymousReport(report.report_id)) {
      this.reportService
        .rejectAnonymous(report.report_id, rejectionReason)
        .subscribe({
          next: (response) => {
            window.alert(response.message);
            this.router.navigate(['/genderdesk']);
            // this.navigateAndReload;
          },
          error: (error) => {
            const errorMessage = error.error
              ? error.error.error
              : 'An unknown error occurred';
            window.alert(errorMessage);
          },
        });
    } else {
      this.reportService
        .rejectReport(report.report_id, rejectionReason)
        .subscribe({
          next: (response) => {
            window.alert(response.message);
            this.router.navigate(['/genderdesk']);
            // this.navigateAndReload;
          },
          error: (error) => {
            const errorMessage = error.error
              ? error.error.error
              : 'An unknown error occurred';
            window.alert(errorMessage);
          },
        });
    }
  }

  closeReport(report: Report) {
    if (this.isAnonymousReport(report.report_id)) {
      this.reportService.closeAnonymous(report.report_id).subscribe({
        next: (response) => {
          window.alert(response.message);
          this.router.navigate(['/genderdesk']);
          // this.navigateAndReload;
        },
        error: (error) => {
          const errorMessage = error.error
            ? error.error.error
            : 'An unknown error occurred';
          window.alert(errorMessage);
        },
      });
    } else {
      this.reportService.closeReport(report.report_id).subscribe({
        next: (response) => {
          window.alert(response.message);
          this.router.navigate(['/genderdesk']);
          // this.navigateAndReload;
        },
        error: (error) => {
          const errorMessage = error.error
            ? error.error.error
            : 'An unknown error occurred';
          window.alert(errorMessage);
        },
      });
    }
  }

  forwardReport(report: Report) {
    if (this.isAnonymousReport(report.report_id)) {
      this.reportService.forwardAnonymous(report.report_id).subscribe({
        next: (response) => {
          window.alert(response.message);
          this.router.navigate(['/genderdesk']);
          // this.navigateAndReload;
        },
        error: (error) => {
          const errorMessage = error.error
            ? error.error.error
            : 'An unknown error occurred';
          window.alert(errorMessage);
        },
      });
    } else {
      this.reportService.forwardReport(report.report_id).subscribe({
        next: (response) => {
          window.alert(response.message);
          this.router.navigate(['/genderdesk']);
          // this.navigateAndReload;
        },
        error: (error) => {
          const errorMessage = error.error
            ? error.error.error
            : 'An unknown error occurred';
          window.alert(errorMessage);
        },
      });
    }
  }
}
