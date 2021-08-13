import { Component, OnDestroy, OnInit } from '@angular/core';
import { MainService, HeaderData } from '../../services/main.service';
import { Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';

@Component({
  selector: 'app-school-root',
  templateUrl: './school-root.component.html',
  styleUrls: ['./school-root.component.scss']
})
export class SchoolRootComponent implements OnInit, OnDestroy {
  headerData: HeaderData;
  destroy: Subject<any> = new Subject<any>();

  constructor(private main: MainService) { }

  ngOnInit(): void {
    this.main.headerData.pipe(takeUntil(this.destroy), delay(0))
      .subscribe(data => this.headerData = data);
  }

  ngOnDestroy(): void {
    this.destroy.next('');
    this.destroy.unsubscribe();
  }
}

