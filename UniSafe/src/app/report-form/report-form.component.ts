import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css'],
})
export class ReportFormComponent implements OnInit {
  reportForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.reportForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['0', Validators.required],
      phoneNumber: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      college: ['0', Validators.required],
      abusetype: ['0', Validators.required],
      loa: ['0', Validators.required],
    });
  }
}
