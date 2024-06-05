import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TimeoutService {
  private timer: any;

  constructor(private authService: AuthService, private router: Router) {}

  resetTimer(): void {
    // Check if the user is logged in
    if (this.authService.getAccessToken()) {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        await this.logout();
      }, 600000); // 10 minutes in milliseconds
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
}
