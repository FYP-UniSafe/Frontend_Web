import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent {

  constructor(private el: ElementRef) { }

  scrollToFooter() {
    const footerElement = document.getElementById('app-foot');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  
}
