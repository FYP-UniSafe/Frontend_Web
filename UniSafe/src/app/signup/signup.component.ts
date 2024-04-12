import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  userProfiles = ['Student', 'GenderDesk', 'Consultant', 'Police'];
  showPassword: boolean = false;
  // college: string = '0';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      {
        fullname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        gender: ['0', Validators.required],
        phone: ['', Validators.required],
        userProfile: ['0', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
        specificFields: this.formBuilder.group({
          registrationNumber: [''],
          // collegeOrSchool: [this.college, Validators.required],
          collegeOrSchool: ['0', Validators.required],
          staffNumber: [''],
          office: [''],
          policeNumber: [''],
          station: [''],
        }),
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (passwordControl && confirmPasswordControl) {
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  onProfileChange(): void {
    const userProfileControl = this.signupForm.get('userProfile');
    const specificFields = this.signupForm.get('specificFields');

    if (userProfileControl && specificFields) {
      const profileType = userProfileControl.value;

      specificFields.reset();
      specificFields.clearValidators();
      specificFields.updateValueAndValidity();

      // Show/hide specific fields and apply validators based on profile type
      if (profileType === 'Student') {
        specificFields
          ?.get('registrationNumber')
          ?.setValidators(Validators.required);
        specificFields
          ?.get('collegeOrSchool')
          ?.setValidators(Validators.required);
      } else if (profileType === 'GenderDesk' || profileType === 'Consultant') {
        specificFields?.get('staffNumber')?.setValidators(Validators.required);
        specificFields?.get('office')?.setValidators(Validators.required);
      } else if (profileType === 'Police') {
        specificFields?.get('policeNumber')?.setValidators(Validators.required);
        specificFields?.get('station')?.setValidators(Validators.required);
      }

      // Update form validity
      specificFields.updateValueAndValidity();
    }
  }

  // submit() {
  //   this.authService.register(this.signupForm.getRawValue()).subscribe(
  //     () => this.router.navigate(['/verify-otp']));
  // }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
