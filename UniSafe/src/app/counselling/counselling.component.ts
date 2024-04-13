import { Component, OnInit } from '@angular/core';
import { TimeoutService } from '../services/timeout.service';

@Component({
  selector: 'app-counselling',
  templateUrl: './counselling.component.html',
  styleUrls: ['./counselling.component.css']
})
export class CounsellingComponent implements OnInit {
  constructor(private timeoutService: TimeoutService) {}

  ngOnInit(): void {
    this.timeoutService.resetTimer();
  }

}
