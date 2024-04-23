import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TimeoutService } from '../services/timeout.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  // note = 'Welcome to UniSafe!'+{user}
  note = 'Welcome to UniSafe!';
  userFullName: string = '';
  loggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private timeoutService: TimeoutService
  ) {}

  ngOnInit(): void {
    this.timeoutService.resetTimer();
    const user = this.authService.getUser();
    if (user) {
      this.userFullName = user.full_name + '!';
      this.note = 'Welcome to UniSafe';
      this.loggedIn = true;
    }
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
