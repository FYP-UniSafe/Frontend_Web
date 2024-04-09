import { NgPluralCase } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.reportForm = this.formBuilder.group({
      loa: ['0', Validators.required], 
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // gender: [this.gender, Validators.required], 
      pgender: [this.gender, Validators.required],
      phoneNumber: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      college: ['0', Validators.required], 
      abusetype: ['0', Validators.required], 
      other: [''],
    });
  }

  onReportingForChange(value: string) {
    this.reportingFor = value;
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      // Process form data and send to backend
      console.log(this.reportForm.value);
    } else {
      // Handle form validation errors
      console.log("Form validation failed");
    }
  }

}
