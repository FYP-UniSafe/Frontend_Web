import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OtpService } from '../services/otp.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css'],
})
export class VerifyOtpComponent implements OnInit {
  verifyForm!: FormGroup;
  email: string = '';
  otp: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private otpService: OtpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.verifyForm = this.formBuilder.group({
      email: ['', Validators.required],
      otp: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.verifyForm.valid) {
      const { email, otp } = this.verifyForm.value; // Retrieve form values

      this.otpService.verifyOtp(email, otp).subscribe(
        (response) => {
          if (response && response.message) {
            window.alert(response.message);
            this.router.navigate(['/login']);
          } else {
            window.alert('An error occurred. Please try again later.');
          }
        },
        (error) => {
          if (error && error.error && error.error.message) {
            window.alert(error.error.message);
          } else {
            window.alert('An error occurred. Please try again later.');
          }
        }
      );
    } else {
      // Form is invalid, handle it accordingly
    }
  }
}
