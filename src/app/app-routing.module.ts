import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/school/home/home.component';
import { SetUpSchoolComponent } from './components/school/set-up-school/set-up-school.component';
import { AccessSchoolComponent } from './components/school/access-school/access-school.component';
import { StudentSignupComponent } from './components/school/student-signup/student-signup.component';
import { SecurityComponent } from './components/school/security/security.component';


import { SchoolRootModule } from './components/school-root/school-root.module';
import { AuthGuardGuard } from './route-guards/auth-guard/auth-guard.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'setup-school-newspaper', component: SetUpSchoolComponent },
  { path: 'access-school-newspaper', component: AccessSchoolComponent },
  { path: 'security', component: SecurityComponent },
  { path: 'signup', component: StudentSignupComponent },

  {
    path: 'school', loadChildren: () => SchoolRootModule
    // ,canActivate: [AuthGuardGuard]
  },

  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
