import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OtpService } from '../services/otp.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resend-otp',
  templateUrl: './resend-otp.component.html',
  styleUrls: ['./resend-otp.component.css']
})
export class ResendOtpComponent {
  resendForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private otpService: OtpService,
              private router: Router) {
    this.resendForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit(): void {
    if (this.resendForm.valid) {
      const email = this.resendForm.get('email')?.value; // Retrieve email from the form group
      this.otpService.resendOtp(email).subscribe(
        () => {
          this.router.navigate(['/verify-otp']);
        },
        (error) => {
          window.alert(error.error.message || 'Email not found. Please register to UniSafe!');
          this.router.navigate(['/signup']);
        }
      );
    } else {
      // Form is invalid, handle validation errors or display a message
    }
  }
}
