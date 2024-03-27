import { Component, ElementRef } from '@angular/core';
// import { MenuService } from '../menu/menu.service';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent {

  // isVisible: boolean = true;
  menuValue: boolean = false;
  menu_icon: string = 'bi bi-list';

  constructor(private el: ElementRef) { }

  scrollToFooter() {
    const footerElement = document.getElementById('app-foot');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }


  openMenu(){
    this.menuValue = !this.menuValue;
    this.menu_icon = this.menuValue ? 'bi bi-x' : 'bi bi-list';
  }

  closeMenu(){
    this.menuValue = false;
    this.menu_icon = 'bi bi-list';
  }
}
