import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OtpService } from '../services/otp.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css'],
})
export class VerifyOtpComponent {
  verifyForm!: FormGroup;
  email: string = '';
  otp: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private otpService: OtpService,
    private router: Router
  ) {
    this.verifyForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.verifyForm.valid) {
      const { email, otp } = this.verifyForm.getRawValue();
      this.otpService.verifyOtp(email, otp)
        .subscribe(
          (response) => {
            if (response && response.message) {
              // Display the success message to the user
              window.alert(response.message);
              this.router.navigate(['/login']);
            } else {
              // Handle unexpected response format
              window.alert('An error occurred. Please try again later.');
            }
          },
          (error) => {
            // Display the error message from the backend, if available
            if (error && error.error && error.error.message) {
              window.alert(error.error.message);
            } else {
              // Display a generic error message if the response format is unexpected
              window.alert('An error occurred. Please try again later.');
            }
          }
        );
    } else {
      // Form is invalid, handle validation errors or display a message
    }
  }
  
}
