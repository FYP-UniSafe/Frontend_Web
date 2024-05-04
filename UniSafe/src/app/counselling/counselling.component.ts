import { Component, OnInit } from '@angular/core';
import { TimeoutService } from '../services/timeout.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ReportService } from '../services/report.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-counselling',
  templateUrl: './counselling.component.html',
  styleUrls: ['./counselling.component.css'],
})
export class CounsellingComponent implements OnInit {
  userData: any = {};
  appointmentForm!: FormGroup;
  reportId: string | null = null;

  constructor(
    private timeoutService: TimeoutService,
    private authService: AuthService,
    private router: Router,
    private reportService: ReportService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.timeoutService.resetTimer();
    this.authService.onLogout().subscribe(() => {
      this.router.navigate(['/login']);
    });
    this.reportId = this.reportService.reportId;

    const user = this.authService.getUser();
    if (user) {
      this.userData = user;
      this.initForm();
    }
  }

  initForm(): void{
    this.appointmentForm = this.formBuilder.group({
      fullName: [this.userData.full_name],
      regNo: [this.userData.profile.reg_no],
      email: [this.userData.email, [Validators.required, Validators.email]],
      phone: [this.userData.phone_number, [Validators.required, Validators.pattern(/^\+255\d{9}$/)]],
      reportId: [this.reportId],
      date: ['', Validators.required],
      sessionType: ['', Validators.required]
    });
  }

  onSubmit(){

  }

  get phoneField() {
    return this.appointmentForm.get('phone');
  }

  get emailField() {
    return this.appointmentForm.get('email');
  }

}
