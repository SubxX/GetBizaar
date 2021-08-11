import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../../../services/main.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-newspaper',
  templateUrl: './newspaper.component.html',
  styleUrls: ['./newspaper.component.scss']
})
export class NewspaperComponent implements OnInit, OnDestroy {
  user: any;
  destroy: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private main: MainService
  ) {
    if (this.main.isBrowser) {
      this.main.user
        .pipe(takeUntil(this.destroy))
        .subscribe((data: any) => {
          if (data) {
            this.user = data;
            console.log(this.user);
          }
        });
    }
  }

  ngOnInit(): void {
    this.main.updateTitle('Newspaper');
    if (this.main.isBrowser && history.state.updated) this.openSnackBar();
  }

  openSnackBar() {
    this.main.showSnackbar({ state: true, message: 'Account information updated', type: 'success' });
  }

  ngOnDestroy(): void {
    this.destroy.next('');
    this.destroy.unsubscribe();
  }

}
