import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { MainService } from '../../../services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private main: MainService, private router: Router) { }

  ngOnInit(): void {
    this.main.updateTitle();
  }

  goToMarketPlace(): void {
    this.main.user.pipe(take(1))
      .subscribe((usr) => {
        usr ? this.router.navigate(['/school/newspaper']) : this.router.navigate(['/access-school-newspaper']);
      });
  }

}
