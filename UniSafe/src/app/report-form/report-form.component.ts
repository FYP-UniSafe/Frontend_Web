import { NgPluralCase } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimeoutService } from '../services/timeout.service';

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

  constructor(
    private formBuilder: FormBuilder,
    private timeoutService: TimeoutService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.timeoutService.resetTimer();
  }

  initForm(): void {
    this.reportForm = this.formBuilder.group({
      loa: ['Location of the Abuse*', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // gender: [this.gender, Validators.required],
      pgender: [this.gender, Validators.required],
      phoneNumber: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      college: ['', Validators.required],
      abusetype: ['0', Validators.required],
      other: [''],
    });
  }

//   setDefaultCollege(): void {
//   // Set default college value after initializing the form group
//   this.reportForm.patchValue({
//     college: this.colleges[0] // Set the first college from the array as the default value
//   });
// }

  onLocationChange(event: Event): void {
    const value = (event.target as HTMLSelectElement)?.value;
    const loaControl = this.reportForm.get('loa');
    if (loaControl) {
      loaControl.setValue(value);
    }
  }
  

  // onCollegeChange(event: Event): void {
  //   const value = (event.target as HTMLSelectElement)?.value;
  //   const collegeControl = this.reportForm.get('college');
  //   if (collegeControl) {
  //     collegeControl.setValue(value);
  //   }
  // }

  onReportingForChange(value: string) {
    this.reportingFor = value;
}

  onSubmit(): void {
    if (this.reportForm.valid) {
      // Process form data and send to backend
      console.log(this.reportForm.value);
    } else {
      // Handle form validation errors
      console.log('Form validation failed');
    }
  }
}
