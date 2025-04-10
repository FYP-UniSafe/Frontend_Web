import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeadComponent } from './head/head.component';
import { FootComponent } from './foot/foot.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ReportComponent } from './report/report.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { CounsellingComponent } from './counselling/counselling.component';
import { GenderdeskComponent } from './genderdesk/genderdesk.component';
import { PoliceComponent } from './police/police.component';
import { ConsultantComponent } from './consultant/consultant.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { TimeoutService } from './services/timeout.service';
import { ResendOtpComponent } from './resend-otp/resend-otp.component';
import { OtpService } from './services/otp.service';
import { ReportService } from './services/report.service';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { CommonModule } from '@angular/common';
import { MeetingService } from './services/meeting.service';
import { JoinScreenComponent } from './join-screen/join-screen.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { StatisticsService } from './services/statistics.service';
import { AppointmentsService } from './services/appointments.service';
import { AuthService } from './services/auth.service';
import { GeminiService } from './services/gemini.service';
import { VideoCallComponent } from './video-call/video-call.component';

@NgModule({
  declarations: [
    AppComponent,
    HeadComponent,
    FootComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    VerifyOtpComponent,
    ReportComponent,
    ReportFormComponent,
    CounsellingComponent,
    ResendOtpComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    GenderdeskComponent,
    PoliceComponent,
    ConsultantComponent,
    JoinScreenComponent,
    TopBarComponent,
    VideoCallComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartModule,
    CommonModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    TimeoutService,
    OtpService,
    ReportService,
    MeetingService,
    StatisticsService,
    AppointmentsService,
    AuthService,
    GeminiService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
