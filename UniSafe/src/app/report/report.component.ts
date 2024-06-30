import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { TimeoutService } from '../services/timeout.service';
import { ReportService } from '../services/report.service';
import { Report } from '../models/report';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit, OnDestroy {
  reports: Report[] = [];
  filteredReports: Report[] = [];
  selectedReport: any;
  activeStatus: string | null = null;
  authenticated: boolean = false;
  isReportVisible: boolean = false;
  paginatedReports: Report[] = [];
  currentPage = 1;
  reportsPerPage = 5;
  totalPages = 0;

  constructor(
    private timeoutService: TimeoutService,
    private reportService: ReportService,
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.timeoutService.resetTimer();
    const user = this.authService.getUser();
    if (user) {
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }

    this.fetchReports();
    this.filterReports('');

    this.authService.onLogout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  ngOnDestroy(): void {
    // Ensure body overflow is reset when component is destroyed
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  fetchReports() {
    if (this.authenticated === true) {
      this.reportService.getStudentReports().subscribe(
        (reports: Report[]) => {
          this.reports = reports.sort((a, b) => {
            return (
              new Date(b.created_on).getTime() -
              new Date(a.created_on).getTime()
            );
          });

          this.reports.forEach((report) => {
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
    this.calculateTotalPages();
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

    // Optional: Add styles to make the previewElement full-screen or use a modal/dialog component for a better UX.
  }

  togglePlayAudio(event: MouseEvent): void {
    const audioElement = event.target as HTMLAudioElement;
    if (audioElement.paused) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
    event.stopPropagation(); // Prevent triggering any parent click events
  }
}
