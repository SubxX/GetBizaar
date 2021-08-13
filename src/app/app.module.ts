import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, Location, LocationStrategy, PathLocationStrategy } from "@angular/common";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

// Material Inputs
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

// Custom Directives
import { NumberInputDirective } from './directives/number-input/number-input.directive';
import { LazyLoadImageDirective } from './directives/lazy-load-image/lazy-load-image.directive';

// Shared Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/school/home/home.component';

// Pages
import { SetUpSchoolComponent } from './components/school/set-up-school/set-up-school.component';
import { AccessSchoolComponent } from './components/school/access-school/access-school.component';
import { StudentSignupComponent } from './components/school/student-signup/student-signup.component';
import { SecurityComponent } from './components/school/security/security.component';

// Guards
import { AuthGuardGuard } from './route-guards/auth-guard/auth-guard.guard';
import { CookieModule } from 'ngx-cookie';

// Shard Module
import { SharedModule } from './components/common/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    SetUpSchoolComponent,
    HomeComponent,
    AccessSchoolComponent,
    StudentSignupComponent,
    SecurityComponent,
    NumberInputDirective,
    LazyLoadImageDirective,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserModule, CookieModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [
    AuthGuardGuard,
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
