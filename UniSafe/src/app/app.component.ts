import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'UniSafe';

  constructor(private router: Router) {}

  isHomeRoute(): boolean{
    // return this.router.url === '/home';
    return this.router.url === '/home' || this.router.url === '/report' || this.router.url === '/report-form' 
    || this.router.url === '/counselling';
  }

}
