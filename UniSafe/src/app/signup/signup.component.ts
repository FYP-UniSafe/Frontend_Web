import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  showPassword: boolean = false;
  StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  colleges = [
    'College / School*',
    'CoICT',
    'CoET',
    'UDBS',
    'CoNAS',
    'CoSS',
    'CoHU',
    'CoAF',
    'MUCE',
    'DUCE',
    'SoED',
    'SoAF',
    'UDSE',
    'MCHAS',
    'UDSoL',
    'SJMC',
    'SoMG',
    'Other',
  ];
  selectedCollege: string = 'College / School*';

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
        gender: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern(/^\+255\d{9}$/)]],
        userProfile: ['0', Validators.required],
        password: ['', [Validators.required, Validators.pattern(this.StrongPasswordRegx)]],
        specificFields: this.formBuilder.group({
          registrationNumber: [''],
          college: ['0'],
          staffNumber: [''],
          office: [''],
          policeNumber: [''],
          station: [''],
        }),
      },
    );
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
        specificFields?.get('registrationNumber')?.setValidators(Validators.required);
        specificFields?.get('college')?.setValidators(Validators.required);
      } else if (profileType === 'GenderDesk' || profileType === 'Consultant') {
        specificFields?.get('staffNumber')?.setValidators(Validators.required);
        specificFields?.get('office')?.setValidators(Validators.required);
      } else if (profileType === 'Police') {
        specificFields?.get('policeNumber')?.setValidators(Validators.required);
        specificFields?.get('station')?.setValidators(Validators.required);
      }
      specificFields.updateValueAndValidity();
    }
  }

  submit(): void {
    if (this.signupForm) {
      const userProfileControl = this.signupForm.get('userProfile');
      if (userProfileControl) {
        // Map form values to backend field names
        const mappedFormValues = {
          full_name: this.signupForm.value.fullname,
          email: this.signupForm.value.email,
          gender: this.signupForm.value.gender,
          phone_number: this.signupForm.value.phone,
          password: this.signupForm.value.password,
          reg_no: this.signupForm.value.specificFields.registrationNumber,
          college: this.signupForm.value.specificFields.college,
          staff_no: this.signupForm.value.specificFields.staffNumber,
          office: this.signupForm.value.specificFields.office,
          police_no: this.signupForm.value.specificFields.policeNumber,
          station: this.signupForm.value.specificFields.station,
        };
        this.authService.signup(mappedFormValues, userProfileControl.value)
          .subscribe(
            (response) => {
              window.alert(response.message || 'Sign up successful!');
              this.router.navigate(['/verify-otp']);
            },
            (error) => {
              window.alert(error.error.message || 'An error occurred. Please try again.');
            }
          );
      } else {
        window.alert('Oops! Something went wrong. Please try again.');
      }
    } else {
      window.alert('Oops! Something went wrong. Please try again.');
    }
  }
  
  
  
  get phoneField() {
    return this.signupForm.get('phone');
  }
  
  get emailField() {
    return this.signupForm.get('email');
  }
  
  get passwordFormField() {
    return this.signupForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
}
