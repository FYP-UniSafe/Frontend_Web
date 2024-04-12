import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// import { HttpModule } from '@angular/http';
// import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeadComponent } from './head/head.component';
import { FootComponent } from './foot/foot.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ReportComponent } from './report/report.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { CounsellingComponent } from './counselling/counselling.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// import { UserService } from './services/user.service';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule ,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
