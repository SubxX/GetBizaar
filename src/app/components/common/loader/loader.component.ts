import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { MainService } from '../../../services/main.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit ,OnDestroy{
  loaderState: any;
  destroy:Subject<any> = new Subject<any>();

  constructor(private main: MainService) {
     this.main.loader
     .pipe(takeUntil(this.destroy),delay(0))
     .subscribe(state=>this.loaderState = state)
  }

  ngOnInit(): void {
  }

  ngOnDestroy():void{
    this.destroy.next('');
    this.destroy.unsubscribe();
  }

}
