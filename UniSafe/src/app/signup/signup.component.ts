import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  userProfiles = ['Student', 'GenderDesk', 'Consultant', 'Police'];
  showPassword: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.signupForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['0', Validators.required],
      phoneNumber: ['', Validators.required],
      userProfile: ['0', Validators.required], // Default value for profile type
      specificFields: this.formBuilder.group({
        registrationNumber: [''],
        collegeOrSchool: ['0'],
        staffNumber: [''],
        office: [''],
        policeNumber: [''],
        station: ['']
      })
    });
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
      specificFields?.get('collegeOrSchool')?.setValidators(Validators.required);
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

  onSubmit(): void {
    if (this.signupForm.valid) {
      // Process form data and send to backend
      console.log(this.signupForm.value);
    } else {
      // Handle form validation errors
      console.log("Form validation failed");
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
