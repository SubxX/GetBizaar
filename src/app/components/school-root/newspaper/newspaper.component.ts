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
  categoryList = [
    { title: 'Sort by', id: 'sort-by' },
    { title: 'All', id: 'all' },
    { title: 'Sports', id: 'xxx-txz' },
    { title: 'Politics', id: 'xza-sta' },
    { title: 'Opinion', id: 'zmj-ham' },
    { title: 'Fiction', id: 'lao-pyu' },
    { title: 'History', id: 'loa-klm' }
  ]
  sortBy = { title: 'Sort by', id: 'sort-by' };
  articles = [
    {
      title: "Is Social Media a Bad Guy ? Redefining Beauty in a Digital World",
      desc: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, consectetur quod
      molestias aliquid a ab fugiat minus perspiciatis? Esse quo voluptatum natus dicta, rem saepe sit numquam voluptas
      assumenda corrupti?`,
      by: "Seline Shenoy",
      added_date: "20.05.2021"
    },
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
      title: "Why do people think family trip ideas are a good idea?",
      desc: "Family trip ideas by the numbers. Culture tips by the numbers. What experts are saying about cheap tickets.",
      by: "Alex Luke",
      added_date: "12.05.2021"
    }
  ]

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
