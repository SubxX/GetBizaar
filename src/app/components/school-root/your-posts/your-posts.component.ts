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
  articles = [
    {
      title: "16 problems with storage devices",
      desc: "15 ways new inventions could leave you needing a lawyer. 18 things you don't want to hear about science museums.",
      by: "Gomen Sai",
      added_date: "18.05.2021"
    },
    {
      title: "How photo awards make you a better lover",
      desc: "Why photography ideas beat peanut butter on pancakes. The 12 best photography award youtube videos",
      by: "William Benjamin",
      added_date: "14.05.2021"
    },
    {
      title: "Why do people think family trip ideas are a good?",
      desc: "Family trip ideas by the numbers. Culture tips by the numbers. What experts are saying about cheap tickets.",
      by: "Alex Luke",
      added_date: "12.05.2021"
    }
  ]

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
    this.main.headerData.next({ title: 'My Articles', sub: '', bg: 'assets/images/banner.jpg', nav: true, header: true });
    this.main.updateTitle('My Articles');
  }

  ngOnDestroy(): void {
    this.destroy.next('');
    this.destroy.unsubscribe();
  }

}
