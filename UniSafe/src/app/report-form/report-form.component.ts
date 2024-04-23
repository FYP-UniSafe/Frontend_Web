import { NgPluralCase } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimeoutService } from '../services/timeout.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css'],
})
export class ReportFormComponent implements OnInit {
  reportForm!: FormGroup;
  reportingFor: string = '';
  pgender: string = '0';
  gender: string = '0';
  college: string = '0';
  locations = [
    'Location of the Abuse*',
    'Hall I',
    'Hall II',
    'Hall III',
    'Hall IV',
    'Hall V',
    'Hall VI',
    'Hall VII',
    'Magufuli Hostels',
    'Mabibo Hostels',
    'Kunduchi Hostels',
    'CoICT Hostels',
    'Ubungo Hostels',
    'Other',
  ];
  selectedLocation: string = this.locations[0];
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
  selectedCollege: string = this.colleges[0];
  genders = ['Gender*', 'Female', 'Male'];
  selectedGender: string = this.genders[0];
  authenticated = false;

  constructor(
    private formBuilder: FormBuilder,
    private timeoutService: TimeoutService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.authService.user().subscribe({
      next: (res: any) => {
        this.authenticated = true;
        this.timeoutService.resetTimer();
      },
      error: (err) => {
        this.authenticated = false;
      },
    });
  }

  initForm(): void {
    this.reportForm = this.formBuilder.group({
      loa: [this.selectedLocation, Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      vgender: [this.selectedGender, Validators.required],
      pgender: [this.gender, Validators.required],
      phoneNumber: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      college: [this.selectedCollege, Validators.required],
      abusetype: ['0', Validators.required],
      other: [''],
    });
  }

  onReportingForChange(value: string) {
    this.reportingFor = value;
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      console.log(this.reportForm.value);
    } else {
      console.log('Form validation failed');
    }
  }
}
