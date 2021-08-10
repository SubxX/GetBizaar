import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { MainService } from '../../../services/main.service';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import {Router} from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})

export class NavBarComponent implements OnInit, AfterViewInit {
  public navOpened = false;
  @Input('userData') user:any;
  @ViewChild('innernavelm') innerNav: ElementRef;
  @HostListener('window:scroll', ['$event'])
  handeleScroll(ev: any) {
    this.navFixedToggler();
  }


  constructor(private main: MainService,private router:Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.navFixedToggler();
  }

  navFixedToggler(): any {
    if(!this.main.isBrowser) return;
    if (!document.querySelector('html').classList.contains('cdk-global-scrollblock')) {
       window.pageYOffset >= 20 ?
        this.innerNav.nativeElement.classList.add('shadowed') :
        this.innerNav.nativeElement.classList.remove('shadowed');
    }
  }

  logout(): void {
    if (this.navOpened) { this.navOpened = false; }
    this.main.openDialog(ConfirmationPopupComponent, '85%', '450px',
    { title: "You are about to logout", desc: "Are you sure?", btn: "Logout" })
      .afterClosed().pipe(take(1))
      .subscribe((data) => {
        if (data) { this.main.logout();this.router.navigate(['/']); }
      });
  }

}
