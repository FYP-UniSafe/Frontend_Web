import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TimeoutService } from '../services/timeout.service';
import { Router } from '@angular/router';
import { Chart, registerables } from 'node_modules/chart.js';
Chart.register(...registerables);

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

  constructor(
    private authService: AuthService,
    private timeoutService: TimeoutService,
    private router: Router
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

    this.RanderChart();
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  RanderChart() {
    // const ctx = document.getElementById('myChart');

    const myChart = new Chart('piechart', {
      type: 'bar',
      data: {
        labels: ['Hall I', 'Hall II', 'Hall III', 'CoICT', 'Magufuli', 'Mabibo Hostels'],
        datasets: [
          {
            label: 'Reports % Vs Hostel',
            data: [12, 19, 2, 20, 2, 3],
            borderWidth: 1,
            backgroundColor: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
