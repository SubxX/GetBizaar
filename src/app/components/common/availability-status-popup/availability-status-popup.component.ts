import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-availability-status-popup',
  templateUrl: './availability-status-popup.component.html',
  styleUrls: ['./availability-status-popup.component.scss']
})
export class AvailabilityStatusPopupComponent implements OnInit {
  mailHandle: string = '';

  constructor(
    public dialog: MatDialogRef<AvailabilityStatusPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {
    if (data.email) {this.mailHandle = data.email.split('@')[1];}
  }

  ngOnInit(): void {
  }

  createMarketPlace(): void {
    this.dialog.close();
    this.router.navigate(['/setup-market-place']);
  }

}
