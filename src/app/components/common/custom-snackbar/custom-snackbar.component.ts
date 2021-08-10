import { Component, OnDestroy, OnInit } from '@angular/core';
import {trigger,transition,animate,style} from '@angular/animations';
import {MainService} from '../../../services/main.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
  styleUrls: ['./custom-snackbar.component.scss'],
  animations:[
    trigger('state',[

      transition(':enter',[
        style({transform:'translateX(-50%) scale(0.8)'}),
        animate('150ms cubic-bezier(0,0,0.2,1)',style({
          transform:'translateX(-50%) scale(1)',opacity:1
        }))
      ]),

      transition(':leave',[
        animate('150ms cubic-bezier(0.4,0,1,1)',style({
          transform:'translateX(-50%) scale(0.8)',opacity:0
        }))
      ])

    ])
  ]
})
export class CustomSnackbarComponent implements OnInit,OnDestroy {
  show=false;
  message:string ='';
  type:string = 'success';
  private subscription:Subscription;

  constructor(private main:MainService) {
    this.subscription =this.main.snackbarState
    .subscribe(
      (data)=>{
        this.show =data.state;
        this.message = data.message;
        this.type= data.type;
        setTimeout(()=>this.show =false,4000);
      }
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy():void{
    this.subscription.unsubscribe();
  }
}
