import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TimeoutService } from '../services/timeout.service';
import { Router } from '@angular/router';
import { Chart, registerables } from 'node_modules/chart.js';
import { ReportService } from '../services/report.service';
import { StatisticsService } from '../services/statistics.service';
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
  yearlyReportsChart: Chart | undefined;
  note = 'Welcome to UniSafe!';
  userFullName: string = '';
  loggedIn: boolean = false;
  caseTypeData: any[] = [];
  reportCount: any[] = [];
  reportsYearData: any[] = [];
  selectedChart: string = 'pertype';
  selectedMap: string = 'map1';
  heading: string = "Map showing cases in UDSM's Hostels";
  private map: google.maps.Map | undefined;
  hostelsLocations: {
    [key: string]: {
      center: { lat: number; lng: number };
      cases: number;
    };
  } = {};
  // note = 'Welcome to UniSafe!'+{user}
  // locationData: any[] = [];

  constructor(
    private authService: AuthService,
    private timeoutService: TimeoutService,
    private router: Router,
    private reportService: ReportService,
    private statisticsService: StatisticsService
  ) {}

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
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  fetchReportData(): void {
    this.statisticsService.getReportsPerLocation().subscribe(
      (data: any) => {
        // this.locationData = data;
        this.hostelsLocations = data;
        console.log(this.hostelsLocations);
        this.createMap();
      },
      (error: any) => {
        console.error('Error fetching reports per location:', error);
      }
    );

    this.statisticsService.getReportsPerCaseType().subscribe(
      (data: any) => {
        this.caseTypeData = data;
        this.renderCaseTypeChart();
      },
      (error: any) => {
        console.error('Error fetching reports per case type:', error);
      }
    );

    this.statisticsService.getReportsCount().subscribe(
      (data: any) => {
        this.reportCount = data;
      },
      (error: any) => {
        console.error('Error fetching reports count:', error);
      }
    );

    this.statisticsService.getReportsPerYear().subscribe(
      (data: any) => {
        this.reportsYearData = data;
        // this.renderLocationChart();
        this.renderYearlyReportsChart();
      },
      (error: any) => {
        console.error('Error fetching reports per year:', error);
      }
    );
  }

  //   let loader = new Loader({
  //     apiKey: 'AIzaSyBZ1WM4F7jNn0w8s3kaQr1_1yblH9thlT8',
  //   });

  //   loader.load().then(() => {
  //     const mapElement = document.getElementById('map1');
  //     if (mapElement) {
  //       this.map = new google.maps.Map(mapElement as HTMLElement, {
  //         center: { lat: -6.7974259, lng: 39.2054525 },
  //         zoom: 13,
  //         // mapTypeId: 'hybrid',
  //         mapTypeId: 'satellite',
  //       });

  //       for (let hostel in this.hostelsLocations) {
  //         let hostelData = this.hostelsLocations[hostel];
  //         new google.maps.Circle({
  //           strokeColor: '#FF0000',
  //           strokeOpacity: 0.8,
  //           strokeWeight: 2,
  //           fillColor: '#FF0000',
  //           fillOpacity: 0.35,
  //           map: this.map,
  //           center: hostelData.center,
  //           radius: Math.sqrt(hostelData.cases) * 100, // Adjust the multiplier as per your needs
  //         });

  //         const infoWindow = new google.maps.InfoWindow({
  //           content: `<div style="text-align: center;">${this.hostelsLocations[hostel].cases}</div>`,
  //           position: this.hostelsLocations[hostel].center,
  //         });

  //         infoWindow.open(this.map);
  //       }
  //     } else {
  //       console.error('Element with id "map" not found');
  //     }
  //   });
  // }
  createMap(): void {
    let loader = new Loader({
      apiKey: 'AIzaSyBZ1WM4F7jNn0w8s3kaQr1_1yblH9thlT8',
    });

    loader.load().then(() => {
      const mapElement = document.getElementById('map1');
      if (mapElement) {
        this.map = new google.maps.Map(mapElement as HTMLElement, {
          center: { lat: -6.7856611, lng: 39.2289924 },
          zoom: 14,
          mapTypeId: 'satellite',
        });

        for (let hostel in this.hostelsLocations) {
          let hostelData = this.hostelsLocations[hostel];
          new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: this.map,
            center: hostelData.center,
            radius: Math.sqrt(hostelData.cases) * 100,
          });

          // const infoWindow = new google.maps.InfoWindow({
          //   content: `<div style="text-align: center;">${this.hostelsLocations[hostel].cases}</div>`,
          //   position: this.hostelsLocations[hostel].center,
          // });

          // infoWindow.open(this.map);
        }
      } else {
        console.error('Element with id "map" not found');
      }
    });
  }

  renderYearlyReportsChart(): void {
    const labels = this.reportsYearData.map((item) => item.year);
    const data = this.reportsYearData.map((item) => item.count);

    new Chart('yearlyReportsChart', {
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
              text: 'Academic Years',
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

  showMap(map: string): void {
    this.selectedMap = map;
    if (map === 'map1') {
      this.heading = 'Map showing cases in UDSM';
    } else if (map === 'map2') {
      this.heading =
        'Map showing location Auxiliary Police and Gender Offices in UDSM';
    }
  }
}
