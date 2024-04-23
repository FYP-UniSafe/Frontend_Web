import { Component, OnInit } from '@angular/core';
import { TimeoutService } from '../services/timeout.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-counselling',
  templateUrl: './counselling.component.html',
  styleUrls: ['./counselling.component.css'],
})
export class CounsellingComponent implements OnInit {
  constructor(
    private timeoutService: TimeoutService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.timeoutService.resetTimer();
    this.authService.onLogout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
