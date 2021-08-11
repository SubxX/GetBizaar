import { Component, OnDestroy, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-your-posts',
  templateUrl: './your-posts.component.html',
  styleUrls: ['./your-posts.component.scss']
})

export class YourPostsComponent implements OnInit, OnDestroy {
  user: any;
  destroy: Subject<any> = new Subject<any>();

  constructor(private main: MainService, private router: Router) {
    if (this.main.isBrowser) {
      this.main.user.pipe(takeUntil(this.destroy))
        .subscribe((data) => {
          if (data) {
            this.user = data;
          }
        })
    }
  }

  ngOnInit(): void {
    this.main.updateTitle('My Articles');
  }

  ngOnDestroy(): void {
    this.destroy.next('');
    this.destroy.unsubscribe();
  }

}
