import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../services/main.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-marketplace-root',
  templateUrl: './marketplace-root.component.html',
  styleUrls: ['./marketplace-root.component.scss'],
  animations:[
    trigger('state',[

      transition(':enter',[
        style({transform:'translateY(20px)'}),
        animate('150ms cubic-bezier(0,0,0.2,1)',style({
          transform:'translateY(0)',opacity:1
        }))
      ])

    ])
  ]
})
export class MarketplaceRootComponent implements OnInit, OnDestroy {
  url:any;
  user: any;
  headerText:any;
  destroy: Subject<any> = new Subject();
  topSectionShown = false;
  navbarShow =false;
  @ViewChild('uppersec') upperSec: ElementRef;
  // @HostListener('window:scroll', ['$event'])
  // handeleScroll(ev: any) { this.parallex(); }

  constructor(private main: MainService, private router: Router) {
    this.main.user
      .pipe(takeUntil(this.destroy))
      .subscribe((data: any) => {
        if (data) {
          this.user = data;
          if(this.url==='/marketplace') this.headerText = `${this.user.marketplace_name} Marketplace`;
        }
      });

    this.router.events
      .pipe(takeUntil(this.destroy))
      .subscribe(ev => {
        if (ev instanceof NavigationEnd) {
          const wq = ev.url.substr(0, ev.url.lastIndexOf("?"));
          this.url =wq ? wq :ev.url;
          if(this.url === '/marketplace/audit-log'){
            this.topSectionShown = false;
            this.navbarShow = true;
          }else if (this.url=== '/marketplace/your-account') {
            this.topSectionShown = false;
            this.navbarShow = false;
          } else {
            this.topSectionShown = true;
            this.navbarShow = true;
            if(this.url==='/marketplace' && this.user){
              this.headerText = `${this.user?.marketplace_name} Marketplace`;
            }
          }
        }
      });
  }

  ngOnInit(): void {
  }

  parallex(): void {
    if (!this.upperSec) return;
    if (!document.querySelector('html').classList.contains('cdk-global-scrollblock')) {
      this.upperSec.nativeElement.style.transform = `translateY(${window.scrollY * 0.05}px)`;
    }
  }

  ngOnDestroy(): void {
    this.destroy.next('');
    this.destroy.unsubscribe();
  }

}

