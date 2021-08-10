import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { log } from '../../../api-routes/routes';
import { MainService } from '../../../services/main.service';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent implements OnInit, OnDestroy {
  user: any;
  ar: Array<any> = new Array(10);
  logData: any;
  totalRecord: number;
  filter: FormControl = new FormControl('');
  sort: FormControl = new FormControl('');
  shownRecords: FormControl = new FormControl('10', [Validators.required]);

  page;
  startForm = 0;
  totalPages: number;

  destroy: Subject<any> = new Subject<any>();

  apiUrl = log.GET_LOG;

  constructor(
    private main: MainService
  ) {

    if (this.main.isBrowser) {

      this.shownRecords.valueChanges.pipe(takeUntil(this.destroy))
        .subscribe((value) => {
          this.getAuditLog(0, value, 1, this.filter.value ? { filter: this.filter.value } : null);
        });

      this.filter.valueChanges.pipe(takeUntil(this.destroy))
        .subscribe((value) => {
          if (value) {
            this.apiUrl = log.FILTER_LOG;
            this.getAuditLog(0, this.shownRecords.value, 1, { filter: value });
          } else { this.apiUrl = log.GET_LOG; this.getAuditLog(0, this.shownRecords.value, 1); }
        });

      this.sort.valueChanges.pipe(takeUntil(this.destroy))
        .subscribe((value) => {
          console.log(value);
          if (value) {
            this.apiUrl = log.SORT_LOG;
            this.getAuditLog(0, this.shownRecords.value, 1, { filter: value });
          } else { this.apiUrl = log.GET_LOG; this.getAuditLog(0, this.shownRecords.value, 1); }
        });

      this.main.user
        .pipe(takeUntil(this.destroy))
        .subscribe((data: any) => {
          if (data) {
            this.user = data;
            console.log(this.user);
            this.getAuditLog(0, this.shownRecords.value, 1);
          }
        });
    }
  }

  ngOnInit(): void {
    this.main.updateTitle('Audit log');
  }

  getAuditLog(start, draw, page, data?: any): void {
    let payload = { id: this.user.marketplace_id, draw, start };
    if (data) payload = { ...payload, ...data }
    this.main.toggleLoader(true);
    this.main.postFormData(this.apiUrl, payload)
      .pipe(take(1))
      .subscribe(
        (data) => {
          console.log(data);
          this.main.toggleLoader(false);
          if (data.server.message === 'log_exists') {
            this.logData = data.response.log;
            this.totalRecord = parseInt(data.response.totalRecord);
            this.startForm = start;
            this.page = page;
            this.calculatePagination();
          } else {
            this.logData = [];
          }
        }, (err) => { console.log(err); this.main.toggleLoader(false); this.logData = []; }
      )
  }

  calculatePagination(): void {
    const shownRecNumber = parseInt(this.shownRecords.value);
    if (this.totalRecord < shownRecNumber) { console.log('there should be no pagination'); this.totalPages = 1; return; }
    this.totalPages = Math.ceil(this.totalRecord / shownRecNumber);
    console.log('Total number of pages - ', this.totalPages);
  }

  changePage(type: string): void {
    if (type === 'next') {

      if (this.totalPages > this.page) {
        this.getAuditLog(this.shownRecords.value * this.page, this.shownRecords.value, this.page + 1);
      }

    } else {

      if (this.page - 1 > 0) {
        const start = Math.abs(this.shownRecords.value - (this.totalRecord - this.logData.length));
        this.getAuditLog(start === 1 ? 0 : start, this.shownRecords.value, this.page - 1);
      }

    }

  }

  ngOnDestroy(): void {
    this.destroy.next('');
    this.destroy.unsubscribe();
  }

}

