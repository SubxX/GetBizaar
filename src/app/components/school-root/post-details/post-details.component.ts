import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {

  constructor(private main: MainService) { }

  ngOnInit(): void {
    this.main.headerData.next({ title: 'Rules of Effective Branding', sub: 'By Seline Shenoy', bg: 'assets/images/kitchen.jpg', nav: true, header: true, overlay: true });
  }

}
