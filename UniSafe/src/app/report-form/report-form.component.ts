import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimeoutService } from '../services/timeout.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ReportService } from '../services/report.service';

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
  selectedLocation: string = this.locations[0];
  selectedCollege: string = this.colleges[0];
  genders = ['Gender*', 'Female', 'Male'];
  selectedGender: string = this.genders[0];
  authenticated = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private timeoutService: TimeoutService,
    private authService: AuthService,
    private router: Router,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.initForm();

    const user = this.authService.getUser();
    if (user) {
      this.authenticated = true;
      this.timeoutService.resetTimer();
    } else {
      this.authenticated = false;
    }

    this.authService.onLogout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  initForm(): void {
    this.reportForm = this.formBuilder.group({
      reportFor: ['', Validators.required],
      fullname: ['', Validators.required],
      vgender: [this.selectedGender, Validators.required],
      college: [this.selectedCollege, Validators.required],
      registrationNumber: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}'),
        ],
      ],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^\+255\d{9}$/)],
      ],
      abusetype: ['0', Validators.required],
      datetime: ['', [Validators.required, this.dateTimeValidator()]],
      loa: [this.selectedLocation, Validators.required],
      otherLocation: [''],
      description: ['', Validators.required],
      evidence: [[]],
      Perpetrator: [''],
      pgender: [this.selectedGender, Validators.required],
      relationship: ['', Validators.required],
    });
    this.disableValidators();
  }

  disableValidators() {
    this.reportForm.get('fullname')?.clearValidators();
    this.reportForm.get('vgender')?.clearValidators();
    this.reportForm.get('college')?.clearValidators();
    this.reportForm.get('registrationNumber')?.clearValidators();
    this.reportForm.get('email')?.clearValidators();
    this.reportForm.get('phoneNumber')?.clearValidators();
    this.reportForm.get('otherLocation')?.clearValidators();
    this.reportForm.updateValueAndValidity();
  }

  enableValidators() {
    this.reportForm.get('fullname')?.setValidators(Validators.required);
    this.reportForm.get('vgender')?.setValidators(Validators.required);
    this.reportForm.get('college')?.setValidators(Validators.required);
    this.reportForm
      .get('registrationNumber')
      ?.setValidators(Validators.required);
    this.reportForm
      .get('email')
      ?.setValidators([
        Validators.required,
        Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}'),
      ]);
    this.reportForm
      .get('phoneNumber')
      ?.setValidators([
        Validators.required,
        Validators.pattern(/^\+255\d{9}$/),
      ]);
    if (this.reportForm.get('loa')?.value === 'Other') {
      this.reportForm.get('otherLocation')?.setValidators(Validators.required);
    }
    this.reportForm.updateValueAndValidity();
  }

  onReportingForChange(value: string) {
    this.reportingFor = value;
    if (value === 'Else') {
      this.enableValidators();
    } else {
      this.disableValidators();
    }
  }

  onLocationChange(value: string) {
    if (value === 'Other') {
      this.reportForm.get('otherLocation')?.setValidators(Validators.required);
    } else {
      this.reportForm.get('otherLocation')?.clearValidators();
    }
    this.reportForm.updateValueAndValidity();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.reportForm.valid) {
      const reportData = this.reportForm.value;

      reportData.date_and_time = this.formatDate(reportData.datetime);
      delete reportData.datetime;

      // Rename keys to match Django model field names
      reportData.report_for = reportData.reportFor;
      reportData.victim_email = reportData.email;
      reportData.victim_full_name = reportData.fullname;
      reportData.victim_phone = reportData.phoneNumber;
      reportData.victim_gender = reportData.vgender;
      reportData.victim_reg_no = reportData.registrationNumber;
      reportData.victim_college = reportData.college;
      reportData.abuse_type = reportData.abusetype;
      reportData.perpetrator_fullname = reportData.Perpetrator;
      reportData.perpetrator_gender = reportData.pgender;
      reportData.relationship = reportData.relationship;
      reportData.location = reportData.loa;
      reportData.other_location = reportData.otherLocation;
      
      // Remove unused keys from data object
      delete reportData.reportFor;
      delete reportData.abusetype;
      delete reportData.Perpetrator;
      delete reportData.pgender;
      delete reportData.relationshipDescription;
      delete reportData.loa;
      delete reportData.otherLocation;

      const formData = new FormData();
      Object.entries(reportData).forEach(([key, value]) => {
        if (key === 'evidence') {
          const files = value as File[];
          for (let i = 0; i < files.length; i++) {
            formData.append('evidence', files[i], files[i].name);
          }
        } else {
          formData.append(key, value as string);
        }
      });

      this.reportService.createReport(formData).subscribe(
        (response) => {
          window.alert('Report submitted successfully');
          console.log(response);
          this.router.navigate(['/report']);
        },
        (error) => {
          console.error('Error submitting report:', error);
        }
      );
    } else {
      console.log('Form validation failed');
      console.log(this.reportForm.errors);
      console.log(this.reportForm.value);
    }
  }

  formatDate(value: string): string {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // Custom validator for datetime field
  dateTimeValidator() {
    return (control: any): { [key: string]: any } | null => {
      const validDate = !isNaN(Date.parse(control.value));
      return validDate ? null : { invalidDateTime: { value: control.value } };
    };
  }
}
