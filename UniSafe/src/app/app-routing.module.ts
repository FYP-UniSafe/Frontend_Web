import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ReportComponent } from './report/report.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { CounsellingComponent } from './counselling/counselling.component';
import { ResendOtpComponent } from './resend-otp/resend-otp.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'report-form', component: ReportFormComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'verify-otp', component: VerifyOtpComponent},
  {path: 'resend-otp', component: ResendOtpComponent},
  {path: 'report', component: ReportComponent},
  {path: 'counselling', component: CounsellingComponent},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
