import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TimeoutService } from '../services/timeout.service';

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

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private timeoutService: TimeoutService
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

      this.initForm();
    }
  }

  selectMenuItem(item: string): void {
    this.selectedItem = item;
  }

  initForm(): void {
    this.profileForm = this.formBuilder.group({
      full_name: [this.userData.full_name, Validators.required],
      email: [this.userData.email, Validators.required],
      phone_number: [this.userData.phone_number, Validators.required],
      gender: [this.userData.gender, Validators.required],
      staff_no: [this.userData.profile.staff_no, Validators.required],
      police_no: [this.userData.profile.police_no, Validators.required],
      reg_no: [this.userData.profile.reg_no, Validators.required],
      office: [this.userData.profile.office, Validators.required],
      college: [this.userData.profile.college, Validators.required],
    });
  }

  submit() {}
}
