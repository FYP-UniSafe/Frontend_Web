import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TimeoutService } from '../services/timeout.service';
import { Router } from '@angular/router';
import { Chart, registerables } from 'node_modules/chart.js';
import { ReportService } from '../services/report.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Loader } from '@googlemaps/js-api-loader';
Chart.register(...registerables, ChartDataLabels);

// declare function test(): void;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // note = 'Welcome to UniSafe!'+{user}
  note = 'Welcome to UniSafe!';
  userFullName: string = '';
  loggedIn: boolean = false;
  locationData: any[] = [];
  caseTypeData: any[] = [];
  selectedChart: string = 'perloc';

  constructor(
    private authService: AuthService,
    private timeoutService: TimeoutService,
    private router: Router,
    private reportService: ReportService
  ) {
    // test();
  }

  ngOnInit(): void {
    this.timeoutService.resetTimer();
    const user = this.authService.getUser();
    if (user) {
      this.userFullName = user.full_name + '!';
      this.note = 'Welcome to UniSafe';
      this.loggedIn = true;
    }

    this.authService.onLogout().subscribe(() => {
      this.router.navigate(['/login']);
    });

    this.fetchReportData();

    let loader = new Loader ({
      apiKey: 'AIzaSyBZ1WM4F7jNn0w8s3kaQr1_1yblH9thlT8'
    })

    loader.load().then(() => {
      const mapElement = document.getElementById("map");
      if (mapElement) {
        new google.maps.Map(mapElement as HTMLElement, {
          center: { lat: -6.776635073401401, lng: 39.2138884875903},
          zoom: 15
        });
      } else {
        console.error('Element with id "map" not found');
      }
    });
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  fetchReportData(): void {
    this.reportService.getReportsPerLocation().subscribe(
      (data: any) => {
        this.locationData = data;
        this.renderLocationChart();
      },
      (error: any) => {
        console.error('Error fetching reports per location:', error);
      }
    );

    this.reportService.getReportsPerCaseType().subscribe(
      (data: any) => {
        this.caseTypeData = data;
        this.renderCaseTypeChart();
      },
      (error: any) => {
        console.error('Error fetching reports per case type:', error);
      }
    );
  }

  renderLocationChart(): void {
    const desiredOrder = [
      'Hall I',
      'Hall II',
      'Hall III',
      'Hall IV',
      'Hall V',
      'Hall VI',
      'Hall VII',
      'Magufuli Hostels',
      'Mabibo Hostels',
      'Kunduchi Hostels',
      'CoICT Hostels',
      'Ubungo Hostels',
      'Other',
    ];

    // Map the location data to labels and counts
    const labels = this.locationData.map((item) => item.location);
    const data = this.locationData.map((item) => item.count);

    // Sort the labels array based on the desired order
    labels.sort((a, b) => desiredOrder.indexOf(a) - desiredOrder.indexOf(b));

    new Chart('locationChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            borderWidth: 1,
            backgroundColor: '#0f6cbf',
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#fff',
            anchor: 'center',
            align: 'center',
            font: {
              weight: 'bold',
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Locations',
              font: {
                size: 14,
                weight: 'bold',
              },
              color: 'black',
            },
            beginAtZero: true,
            grid: {
              display: false,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Reports',
              font: {
                size: 14,
                weight: 'bold',
              },
              color: 'black',
            },
            beginAtZero: true,
            grid: {
              display: false,
            },
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }

  renderCaseTypeChart(): void {
    const labels = this.caseTypeData.map((item) => item.abuse_type);
    const data = this.caseTypeData.map((item) => item.count);

    new Chart('caseTypeChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Reports per GBV Type',
            data: data,
            backgroundColor: ['Red', 'Blue', 'Orange', 'Green', 'Purple'],
          },
        ],
      },
      options: {
        responsive: true,
        aspectRatio: 5,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            formatter: (value: number, context: any) => {
              const dataset = context.chart.data.datasets[0];
              const total = dataset.data.reduce(
                (prevValue: number, currValue: number) => prevValue + currValue,
                0
              );
              const percentage = ((value / total) * 100).toFixed(2);
              return `${percentage}%`;
            },
            color: '#fff',
            font: {
              weight: 'bold',
            },
          },
        },
      },
    });
  }

  showChart(chartType: string): void {
    this.selectedChart = chartType;
  }
}
