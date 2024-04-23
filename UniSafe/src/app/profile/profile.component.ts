import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TimeoutService } from '../services/timeout.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user_id = "User's ID";
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
  userData: any = {};
  message: string = '';

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private timeoutService: TimeoutService,
    private router: Router
  ) {}

  ngOnInit() {
    this.timeoutService.resetTimer();

    // Get user details from local storage
    const user = this.authService.getUser();
    if (user) {
      this.isStudent = user.is_student;
      this.isGenderDesk = user.is_genderdesk;
      this.isConsultant = user.is_consultant;
      this.isPolice = user.is_police;
      this.userData = user;
      this.user_id = this.userData.profile.custom_id;

      if (user.is_student) {
        this.message = `Reported ${this.userData.profile.report_count} Times`;
      } else if (user.is_genderdesk || user.is_police) {
        this.message = `Closed ${this.userData.profile.report_count} Reports`;
      } else if (user.is_consultant) {
        this.message = `Handled ${this.userData.profile.report_count} Meetings`;
      } else {
        this.message = '';
      }

      this.initForm();
    }

    this.authService.onLogout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  selectMenuItem(item: string): void {
    this.selectedItem = item;
  }

  initForm(): void {
    this.profileForm = this.formBuilder.group({
      full_name: [this.userData.full_name],
      email: [this.userData.email, Validators.required],
      phone_number: [this.userData.phone_number, Validators.required],
      gender: [this.userData.gender],
      staff_no: [this.userData.profile.staff_no],
      police_no: [this.userData.profile.police_no],
      reg_no: [this.userData.profile.reg_no],
      office: [this.userData.profile.office, Validators.required],
      college: [this.userData.profile.college, Validators.required],
      current_password: [''],
      new_password: [''],
    });
  }

  submit() {}

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
      },
    });
  }

  updateUser() {
    const updatedUserData = this.profileForm.value;
    this.authService.updateUser(updatedUserData).subscribe(
      (response) => {
        window.alert('User details updated successfully');
        console.log('User details updated successfully', response);
        this.userData = { ...this.userData, ...updatedUserData };
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
      }

      updateProfileMethod?.subscribe(
        (response) => {
          window.alert('Profile details updated successfully');
          console.log('Profile details updated successfully', response);
          this.userData = { ...this.userData, ...this.profileForm.value };
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
    const currentPassword = this.profileForm.get('current_password')?.value;
    const newPassword = this.profileForm.get('new_password')?.value;

    this.authService.changePassword(currentPassword, newPassword).subscribe(
      (response) => {
        window.alert('Password changed successfully');
        this.logout();
      },
      (error) => {
        window.alert('Error changing password. Please try again.');
      }
    );
  }
}
