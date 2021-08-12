import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MainService } from '../../../services/main.service';
import { AvailabilityStatusPopupComponent } from '../availability-status-popup/availability-status-popup.component';
import { marketplace } from '../../../api-routes/routes';

@Component({
  selector: 'app-school-availability',
  templateUrl: './school-availability.component.html',
  styleUrls: ['./school-availability.component.scss']
})
export class SchoolAvailabilityComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]);
  available = '';
  constructor(private main: MainService) { }

  ngOnInit(): void {
  }

  checkAvailibility(e): void {
    e.preventDefault();
    if (this.email.valid) {
      this.main.toggleLoader(true);
      this.main.get(`${marketplace.CHECK_MARKETPLACE}${this.email.value}`)
        .subscribe(
          (data) => {
            this.main.toggleLoader(false);
            if (data.server.code === 200) {
              // data.response.marketplace.length > 0 ? this.showAlert('available') : this.showAlert('not-available');
              data.response.marketplace.length > 0 ? this.available = 'av' : this.available = 'na';
            }
          }, err => { console.log(err); this.main.toggleLoader(false); }
        );
    } else { this.email.markAsDirty(); }
  }

  showAlert(t): void {
    this.main.openDialog(AvailabilityStatusPopupComponent, '90%', '330px', { type: t });
  }

}
