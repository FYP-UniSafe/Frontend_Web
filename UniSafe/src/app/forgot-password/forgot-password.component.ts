import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit(): void {
    if (this.forgotForm.valid) {
      const email = this.forgotForm.value.email;
      this.authService.forgotPassword(email).subscribe(
        (response) => {
          window.alert(response.detail);
          this.router.navigate(['/reset-password']);
        },
        (error) => {
          window.alert(error.error.detail);
        }
      );
    } else {
      window.alert('Please enter a valid email.');
    }
  }
}
