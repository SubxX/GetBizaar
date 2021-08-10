import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MainService } from '../../../services/main.service';
import { AvailabilityStatusPopupComponent } from '../../common/availability-status-popup/availability-status-popup.component';
import { Router } from '@angular/router';
import { login } from '../../../api-routes/routes';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-access-market-place',
  templateUrl: './access-market-place.component.html',
  styleUrls: ['./access-market-place.component.scss']
})
export class AccessMarketPlaceComponent implements OnInit {
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
    this.main.updateTitle('Access marketplace');
    if (this.main.isBrowser && history.state.mpInactive) { this.marketPlaceStatus('mp-inactive'); }
    if (this.main.isBrowser && history.state.userInactive) { this.marketPlaceStatus('user-inactive'); }
  }

  checkUser(): void {
    if (this.userMail.valid) {
      this.main.toggleLoader(true);
      this.main.get(`${login.CHECK_EMAIL}${this.userMail.value}`)
        .subscribe(
          (data: any) => {
            this.main.toggleLoader(false);
            console.log(data);
            if (data.server.message === 'user_inactive') { this.marketPlaceStatus('user-inactive'); }
            if (data.server.message === 'marketplace_inactive') { this.marketPlaceStatus('mp-inactive'); }
            if (data.server.message === 'marketplace_doesnot_exists') { this.marketPlaceStatus('not-available'); }
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

  marketPlaceStatus(t): void {
    this.main.openDialog(AvailabilityStatusPopupComponent, '90%', '330px', { type: t, email: this.userMail.value });
  }

}
