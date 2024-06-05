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
  selectedMap: string = 'map1';
  heading: string = 'Map showing cases in UDSM\'s Hostels';
  private map: google.maps.Map | undefined;

  hostelsLocations: {
    [key: string]: { 
      center: { lat: number, lng: number }, 
      cases: number 
    }
  } = {
    hall1: {
      center: { lat: -6.777830275857019, lng: 39.20674868360372 },
      cases: 8,
    },
    hall12: {
      center: { lat: -6.776433326520683, lng: 39.20761758999947 },
      cases: 2,
    },
    hall3: {
      center: { lat: -6.775460021509301, lng: 39.206156004132886 },
      cases: 3,
    },
    hall4: {
      center: { lat: -6.776342493802564, lng: 39.205924524550916 },
      cases: 6,
    },
    hall5: {
      center: { lat: -6.776252280774953, lng: 39.20715725250724 },
      cases: 0,
    },
    hall6: {
      center: { lat: -6.775709422827955, lng: 39.202819099746364 },
      cases: 1,
    },
    hall7: {
      center: { lat: -6.7773403337781986, lng: 39.20301746116488 },
      cases: 5,
    },
    magufuli: {
      center: { lat: -6.781932907748147, lng: 39.21320137083932 },
      cases: 3,
    },
    mabibo: {
      center: { lat: -6.804887157350432, lng: 39.20856607018921 },
      cases: 60,
    },
    kunduchi: {
      center: { lat: -6.6641503479942354, lng: 39.216198491764985 },
      cases: 6,
    },
    coict: {
      center: { lat: -6.772251650594132, lng: 39.241099878854385 },
      cases: 10,
    },
    ubungo: {
      center: { lat: -6.792457483174008, lng: 39.21243123112793 },
      cases: 2,
    },
  };

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

    let loader = new Loader({
      apiKey: 'AIzaSyBZ1WM4F7jNn0w8s3kaQr1_1yblH9thlT8',
    });

    loader.load().then(() => {
      const mapElement = document.getElementById('map1');
      if (mapElement) {
        this.map = new google.maps.Map(mapElement as HTMLElement, {
          center: { lat: -6.7974259, lng: 39.2054525 },
          zoom: 11.5,
          // mapTypeId: 'hybrid',
          mapTypeId: 'satellite',
        });
    
        // Iterate over hostelsLocations and create a circle for each location
        for (const location in this.hostelsLocations) {
          if (this.hostelsLocations.hasOwnProperty(location)) {
            new google.maps.Circle({
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35,
              map: this.map,
              center: this.hostelsLocations[location].center,
              radius: Math.sqrt(this.hostelsLocations[location].cases) * 100, // Adjust the multiplier as needed
            });

            // Create an InfoWindow to show the number of cases
            const infoWindow = new google.maps.InfoWindow({
              content: `<div style="text-align: center;">${this.hostelsLocations[location].cases}</div>`,
              position: this.hostelsLocations[location].center,
            });
            
            // Display the InfoWindow above the circle
            infoWindow.open(this.map);

          }
        }
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

  showMap(map: string): void {
    this.selectedMap = map;
    if (map === 'map1') {
      this.heading = 'Map showing cases in UDSM';
    } else if (map === 'map2') {
      this.heading =
        'Map showing location Auxiliary Police and Gender Offices in UDSM';
    }
  }

  // renderMap(): void {
  //   if (this.map) {
  //     const cases = [
  //       { location: { lat: -6.778347, lng: 39.205453 }, count: 10 },
  //       // Add more cases here
  //     ];

  //     cases.forEach((caseItem) => {
  //       if (typeof caseItem.count === 'number') {
  //         new google.maps.Circle({
  //           strokeColor: '#FF0000',
  //           strokeOpacity: 0.8,
  //           strokeWeight: 2,
  //           fillColor: '#FF0000',
  //           fillOpacity: 0.35,
  //           map: this.map,
  //           center: caseItem.location,
  //           radius: Math.sqrt(caseItem.count) * 1000, // Adjust the multiplier as needed
  //         });
  //       }
  //     });
  //   } else {
  //     console.error('Map instance is not available');
  //   }
  // }
}
