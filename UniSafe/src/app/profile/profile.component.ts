import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TimeoutService } from '../services/timeout.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  name = "User's Name";
  selectedItem: string = 'Personal Details';
  colleges = [
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
  selectedCollege: string = '';
  updatable = false;
  isStudent = false;
  isGenderDesk = false;
  isPolice = false;
  isConsultant = false;
  profileForm!: FormGroup;
  profileData: any = {};
  action: string = '';
  StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private timeoutService: TimeoutService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.user().subscribe({
      next: (res: any) => {
        this.name = res.full_name;
        this.isStudent = res.is_student;
        this.isGenderDesk = res.is_genderdesk;
        this.isConsultant = res.is_consultant;
        this.isPolice = res.is_police;
        if (this.isStudent && this.profileData.college) {
          this.profileForm = this.formBuilder.group({
            college: [this.profileData.college, Validators.required],
          });
        } else {
        }

        if (this.isStudent) {
          this.action = 'Reported'
          this.fetchStudentProfile();
        } else if (this.isGenderDesk) {
          this.action = 'Closed'
          this.fetchGenderDeskProfile();
        } else if (this.isConsultant) {
          this.fetchConsultantProfile();
        } else if (this.isPolice) {
          this.action = 'Investigated'
          this.fetchPoliceProfile();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  selectMenuItem(item: string): void {
    this.selectedItem = item;
  }

  fetchStudentProfile(): void {
    this.authService.getStudentProfile().subscribe({
      next: (profileData: any) => {
        this.profileData = profileData;
        this.initForm();
        this.timeoutService.resetTimer();

        if (this.profileData.profile && this.profileData.profile.college) {
          this.selectedCollege = this.profileData.profile.college;
        } else {
          console.error('College information not found in profile data');
        }
      },
      error: (error) => {
        console.error('Error fetching student profile:', error);
      },
    });
  }

  fetchGenderDeskProfile(): void {
    this.authService.getGenderDeskProfile().subscribe({
      next: (profileData: any) => {
        this.profileData = profileData;
        this.initForm();
      },
      error: (error) => {
        console.error('Error fetching gender desk profile:', error);
      },
    });
  }

  fetchPoliceProfile(): void {
    this.authService.getPoliceProfile().subscribe({
      next: (profileData: any) => {
        this.profileData = profileData;
        this.initForm();
      },
      error: (error) => {
        console.error('Error fetching police profile:', error);
      },
    });
  }

  fetchConsultantProfile(): void {
    this.authService.getConsultantProfile().subscribe({
      next: (profileData: any) => {
        this.profileData = profileData;
        this.initForm();
      },
      error: (error) => {
        console.error('Error fetching consultant profile:', error);
      },
    });
  }

  // updateUser() {
  //   this.authService.updateUser(this.userData).subscribe(
  //     (response) => {
  //       console.log('User details updated successfully', response);
  //     },
  //     (error) => {
  //       console.error('Error updating user details', error);
  //     }
  //   );
  // }

  initForm(): void {
    this.profileForm = this.formBuilder.group({
      full_name: [this.profileData.full_name, Validators.required],
      email: [this.profileData.email, Validators.required, Validators.email],
      phone_number: [this.profileData.phone_number, Validators.required, Validators.pattern(/^\+255\d{9}$/)],
      gender: [this.profileData.gender, Validators.required],
      staff_no: [this.profileData.profile.staff_no, Validators.required],
      police_no: [this.profileData.profile.police_no, Validators.required],
      reg_no: [this.profileData.profile.reg_no, Validators.required],
      office: [this.profileData.profile.office, Validators.required],
      college: [this.profileData.profile.college, Validators.required],
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
    });
  }

  submit() {}

  updateUser() {
    const updatedUserData = this.profileForm.value;
    this.authService.updateUser(updatedUserData).subscribe(
      (response) => {
        window.alert('User details updated successfully');
        console.log('User details updated successfully', response);
        this.profileData = { ...this.profileData, ...updatedUserData };
      },
      (error) => {
        console.error('Error updating user details', error);
      }
    );
  }

  updatePersonalDetails() {
    if (
      this.profileForm.get('email')?.valid &&
      this.profileForm.get('phone_number')?.valid
    ) {
      this.updateUser();
    } else {
      console.error('Invalid email or phone number');
    }
  }

  updateProfileDetails() {
    if (
      this.profileForm.get('office')?.valid ||
      this.profileForm.get('college')?.valid
    ) {
      let updateProfileMethod: Observable<any> | undefined;
      if (this.isStudent) {
        updateProfileMethod = this.authService.updateStudentProfile(
          this.profileForm.value
        );
      } else if (this.isGenderDesk) {
        updateProfileMethod = this.authService.updateGenderDeskProfile(
          this.profileForm.value
        );
      } // Add other conditions here for other user types
  
      // Call the update method and subscribe to the returned Observable
      updateProfileMethod?.subscribe(
        (response) => {
          window.alert('Profile details updated successfully');
          console.log('Profile details updated successfully', response);
          this.profileData = { ...this.profileData, ...this.profileForm.value };
        },
        (error) => {
          console.error('Error updating profile details', error);
        }
      );
    } else {
      console.error('Invalid office or college');
    }
  }
  


  changePassword() {
    const oldPassword = this.profileForm.get('old_password')?.value;
    const newPassword = this.profileForm.get('new_password')?.value;
    
    this.authService.changePassword(oldPassword, newPassword).subscribe(
      (response) => {
        window.alert('Password changed successfully');
        console.log('Password changed successfully', response);
        // Clear password fields
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error changing password', error);
        window.alert('Error changing password. Please try again.');
      }
    );
  }
}
