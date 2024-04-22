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

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private timeoutService: TimeoutService
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
          this.fetchStudentProfile();
        } else if (this.isGenderDesk) {
          this.fetchGenderDeskProfile();
        } else if (this.isConsultant) {
          this.fetchConsultantProfile();
        } else if (this.isPolice) {
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

  initForm(): void {
    this.profileForm = this.formBuilder.group({
      full_name: [this.profileData.full_name, Validators.required],
      email: [this.profileData.email, Validators.required],
      phone_number: [this.profileData.phone_number, Validators.required],
      gender: [this.profileData.gender, Validators.required],
      staff_no: [this.profileData.profile.staff_no, Validators.required],
      police_no: [this.profileData.profile.police_no, Validators.required],
      reg_no: [this.profileData.profile.reg_no, Validators.required],
      office: [this.profileData.profile.office, Validators.required],
      college: [this.profileData.profile.college, Validators.required],
    });
  }

  submit() {}
}
