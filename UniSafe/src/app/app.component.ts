import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TimeoutService } from './services/timeout.service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'UniSafe';

  constructor(private router: Router,
              private timeoutService: TimeoutService,
  ) {}

  ngOnInit(): void {
    this.timeoutService.resetTimer()
  }

  isHomeRoute(): boolean{
    // return this.router.url === '/home';
    return this.router.url === '/home' || this.router.url === '/report' || this.router.url === '/report-form' 
    || this.router.url === '/counselling' || this.router.url === '/profile';
  }

}
