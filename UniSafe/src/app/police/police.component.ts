import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TimeoutService } from '../services/timeout.service';
import { ReportService } from '../services/report.service';
import { Report } from '../models/report';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-police',
  templateUrl: './police.component.html',
  styleUrls: ['./police.component.css'],
})
export class PoliceComponent implements OnInit, OnDestroy {
  userEmail: string = '';
  showAllReports: boolean = false;
  normalReports: Report[] = [];
  anonymousReports: Report[] = [];
  filteredReports: Report[] = [];
  activeStatus: string | null = null;
  reportType: string = 'NORMAL';
  currentPage = 1;
  reportsPerPage = 10;
  totalPages = 0;
  selectedReport: any;
  isReportVisible: boolean = false;

  normalReceived = 0;
  normalNotReceived = 0;
  anonymousReceived = 0;
  anonymousNotReceived = 0;

  constructor(
    private authService: AuthService,
    private timeoutService: TimeoutService,
    private reportService: ReportService,
    private renderer: Renderer2,
    private router: Router,
    private location: Location
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

  onReportsFilterChange() {
    this.filterReports(this.activeStatus);
  }

  ngOnDestroy(): void {
    // Ensure body overflow is reset when component is destroyed
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  fetchReports() {
    this.reportService.getForwardedReport().subscribe(
      (reports: Report[]) => {
        this.normalReports = reports.sort((a, b) => {
          const lastCharA = a.report_id.split('-').pop();
          const lastCharB = b.report_id.split('-').pop();
          return Number(lastCharA) - Number(lastCharB);
        });
        // Convert the created_on string to a Date object for each report
        this.normalReports.forEach((report) => {
          report.created_on_date = new Date(report.created_on);
        });
        this.filterReports(this.activeStatus);
        this.countReportStatuses();
      },
      (error) => {
        console.error('Error fetching reports:', error);
      }
    );
  }

  fetchAnonymousReports() {
    this.reportService.getForwardedAnonymous().subscribe(
      (reports: Report[]) => {
        this.anonymousReports = reports.sort((a, b) => {
          const lastCharA = a.report_id.split('-').pop();
          const lastCharB = b.report_id.split('-').pop();
          return Number(lastCharA) - Number(lastCharB);
        });
        // Convert the created_on string to a Date object for each report
        this.anonymousReports.forEach((report) => {
          report.created_on_date = new Date(report.created_on);
        });
        this.filterReports(this.activeStatus);
        this.countAnonymousReportStatuses();
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
        (report) => report.assigned_officer === this.userEmail
      );
    }
    this.filteredReports = filteredReports;
    this.calculateTotalPages();
  }

  countReportStatuses() {
    this.normalReceived = 0;
    this.normalNotReceived = 0;
    this.normalReports.forEach((report) => {
      if (report.police_status === 'RECEIVED') {
        this.normalReceived++;
      } else {
        this.normalNotReceived++;
      }
    });
  }

  countAnonymousReportStatuses() {
    this.anonymousReceived = 0;
    this.anonymousNotReceived = 0;
    this.anonymousReports.forEach((report) => {
      if (report.police_status === 'RECEIVED') {
        this.anonymousReceived++;
      } else {
        this.anonymousNotReceived++;
      }
    });
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(
      this.filteredReports.length / this.reportsPerPage
    );
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

  isAnonymousReport(reportId: string): boolean {
    return reportId.startsWith('A-RE');
  }

  // navigateAndReload() {
  //   this.router.navigateByUrl('/police').then(() => {
  //     window.location.reload();
  //   });
  // }

  receiveReport(report: Report) {
    if (this.isAnonymousReport(report.report_id)) {
      this.reportService.receiveAnonymous(report.report_id).subscribe({
        next: (response) => {
          window.alert(response.message);
          this.router.navigate(['/police']);
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
      this.reportService.receiveReport(report.report_id).subscribe({
        next: (response) => {
          window.alert(response.message);
          this.router.navigate(['/police']);
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
          this.router.navigate(['/police']);
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
          this.router.navigate(['/police']);
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
