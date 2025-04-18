import { NgModule } from '@angular/core';
import { RouterModule, Routes, Scroll } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ReportComponent } from './report/report.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { CounsellingComponent } from './counselling/counselling.component';
import { ResendOtpComponent } from './resend-otp/resend-otp.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { GenderdeskComponent } from './genderdesk/genderdesk.component';
import { PoliceComponent } from './police/police.component';
import { ConsultantComponent } from './consultant/consultant.component';
import { JoinScreenComponent } from './join-screen/join-screen.component';
import { VideoCallComponent } from './video-call/video-call.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'report-form', component: ReportFormComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'resend-otp', component: ResendOtpComponent },
  { path: 'report', component: ReportComponent },
  { path: 'counselling', component: CounsellingComponent },
  { path: 'genderdesk', component: GenderdeskComponent },
  { path: 'police', component: PoliceComponent },
  { path: 'consultant', component: ConsultantComponent },
  { path: 'joinscreen', component: JoinScreenComponent },
  { path: 'videocall', component: VideoCallComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
