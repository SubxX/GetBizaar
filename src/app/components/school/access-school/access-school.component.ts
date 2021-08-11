import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MainService } from '../../../services/main.service';
import { AvailabilityStatusPopupComponent } from '../../common/availability-status-popup/availability-status-popup.component';
import { Router } from '@angular/router';
import { login } from '../../../api-routes/routes';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-access-school',
  templateUrl: './access-school.component.html',
  styleUrls: ['./access-school.component.scss']
})
export class AccessSchoolComponent implements OnInit {
  userMail: FormControl = new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]);

  constructor(private main: MainService, private router: Router) {
    if (this.main.isBrowser) {
      this.main.user
        .pipe(take(1))
        .subscribe((data: any) => {
          if (data) { this.router.navigate(['/marketplace']); }
        });
    }
  }

  ngOnInit(): void {
    this.main.updateTitle('Access School Newspaper');
    if (this.main.isBrowser && history.state.mpInactive) { this.SchoolStatus('mp-inactive'); }
    if (this.main.isBrowser && history.state.userInactive) { this.SchoolStatus('user-inactive'); }
  }

  checkUser(): void {
    if (this.userMail.valid) {
      this.main.toggleLoader(true);
      this.main.get(`${login.CHECK_EMAIL}${this.userMail.value}`)
        .subscribe(
          (data: any) => {
            this.main.toggleLoader(false);
            console.log(data);
            if (data.server.message === 'user_inactive') { this.SchoolStatus('user-inactive'); }
            if (data.server.message === 'marketplace_inactive') { this.SchoolStatus('mp-inactive'); }
            if (data.server.message === 'marketplace_doesnot_exists') { this.SchoolStatus('not-available'); }
            if (data.server.message === 'user_doesnot_exists' || data.server.message === 'user_exists') {
              const t = data.server.message === 'user_doesnot_exists' ? 'new' : 'existing';
              this.main.tempUser.next({ type: t, id: data.response.id, email: this.userMail.value });
              this.router.navigate(['/security']);
            }
          },
          (err) => { console.log(err); this.main.toggleLoader(false); }
        );
    } else { this.userMail.markAsDirty(); }
  }

  SchoolStatus(t): void {
    this.main.openDialog(AvailabilityStatusPopupComponent, '90%', '330px', { type: t, email: this.userMail.value });
  }

}
