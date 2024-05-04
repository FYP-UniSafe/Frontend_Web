import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css'],
})
export class HeadComponent implements OnInit {
  menuValue: boolean = false;
  menu_icon: string = 'bi bi-list';
  authenticated = false;
  userData: any = {};
  activeRoute: string = '';
  profOpt: boolean = false;
  isHovered: boolean = false;
  isStudent: boolean = false;
  isGenderDesk: boolean = false;
  isConsultant: boolean = false;
  isPolice: boolean = false;

  constructor(
    private el: ElementRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activeRoute = this.router.url;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = this.router.url;
      }
    });

    const user = this.authService.getUser();
    if (user) {
      this.userData = user;
      this.authenticated = true;
      this.isStudent = this.userData.is_student;
      this.isGenderDesk = this.userData.is_genderdesk;
      this.isConsultant = this.userData.is_consultant;
      this.isPolice = this.userData.is_police;
    } else {
      this.authenticated = false;
    }

    this.authService.onLogout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  scrollToFooter() {
    const footerElement = document.getElementById('app-foot');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  toggleprofOpt(hovered: boolean) {
    this.isHovered = hovered;
    if (!hovered) {
      // Delay hiding the profile options by 200 milliseconds
      setTimeout(() => {
        if (!this.isHovered) {
          this.profOpt = false;
        }
      }, 200);
    } else {
      // If hovered, immediately show the profile options
      this.profOpt = true;
    }
  }

  openMenu() {
    this.menuValue = !this.menuValue;
    this.menu_icon = this.menuValue ? 'bi bi-x' : 'bi bi-list';
  }

  closeMenu() {
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
      },
    });
  }
}
