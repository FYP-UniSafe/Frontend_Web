import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TimeoutService {
  private timer: any;

  constructor(private authService: AuthService,
    private router: Router)
  {}

  resetTimer(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.logout();
    }, 600000); // 10 minutes in milliseconds
  }

  logout(): void {
    // Clear any session data
    this.authService.logout().subscribe(() => {
      // Redirect to login page after logout
      this.router.navigate(['/login']);
    });
  }
}
