import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit{
  menuValue: boolean = false;
  menu_icon: string = 'bi bi-list';
  authenticated = false;
  user = 'User';
  activeRoute: string = '';
  profOpt: boolean = false;

  constructor(private el: ElementRef,
              private authService: AuthService,
              private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (res: any) => {
        this.authenticated = true;
        this.user = res.full_name;
      },
      error: err => {
        this.authenticated = false;
      } 
    });
  }

  scrollToFooter() {
    const footerElement = document.getElementById('app-foot');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  toggleprofOpt() {
    this.profOpt = !this.profOpt;
  }


  openMenu(){
    this.menuValue = !this.menuValue;
    this.menu_icon = this.menuValue ? 'bi bi-x' : 'bi bi-list';
  }

  closeMenu(){
    this.menuValue = false;
    this.menu_icon = 'bi bi-list';
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}
