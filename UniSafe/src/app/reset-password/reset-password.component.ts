import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  showPassword: boolean = false;
  StrongPasswordRegx: RegExp =
    /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required],
      new_password: [
        '',
        [Validators.required, Validators.pattern(this.StrongPasswordRegx)],
      ],
    });
  }

  submit(): void {
    if (this.resetForm) {
      // Check if resetForm exists
      if (this.resetForm.valid) {
        const { email, otp, new_password } = this.resetForm.value;
        this.authService.resetPassword(email, otp, new_password).subscribe(
          (response: any) => {
            window.alert(response.detail);
            this.router.navigate(['/login']);
          },
          (error: any) => {
            window.alert(
              error.error.detail || 'An error occurred. Please try again.'
            );
          }
        );
      } else {
        window.alert(
          'Please fill in all the required fields and correct any errors.'
        );
      }
    } else {
      window.alert('Oops! Something went wrong. Please try again.');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get passwordFormField() {
    return this.resetForm.get('new_password');
  }
}
