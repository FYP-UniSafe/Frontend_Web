import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TimeoutService implements OnDestroy {
  private timer: any;
  private events: string[] = [
    'click',
    'mousemove',
    'keydown',
    'scroll',
    'touchstart',
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.setupActivityListeners();
  }

  setupActivityListeners(): void {
    this.events.forEach((event) => {
      document.addEventListener(event, () => this.resetTimer());
    });
  }

  resetTimer(): void {
    // Check if the user is logged in
    if (this.authService.getAccessToken()) {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        await this.logout();
      }, 1200000); // 10 minutes in milliseconds 600000 (20 minutes now)
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  ngOnDestroy(): void {
    // Remove event listeners to avoid memory leaks
    this.events.forEach((event) => {
      document.removeEventListener(event, () => this.resetTimer());
    });
  }
}
