import { Component, OnInit } from '@angular/core';
import { TimeoutService } from '../services/timeout.service';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  constructor(private timeoutService: TimeoutService) {}

  ngOnInit(): void {
    this.timeoutService.resetTimer();
  }

}
