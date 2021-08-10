import { Component, OnInit } from '@angular/core';
import { login } from './api-routes/routes';
import { MainService } from './services/main.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user:any;
  constructor(private main: MainService,private router:Router) { }

  ngOnInit(): void {
    if(this.main.isBrowser){
      this.user = this.main.getCookie('user');
      if (this.user) {this.refreshUser(this.user.id);}
    }
  }

  refreshUser(userId) {
    this.main.postFormData(login.REFESH_USER, { id: userId })
      .subscribe((data: any) => {
        if(data.server.message==='marketplace_inactive'){
          this.main.logout();
          this.router.navigateByUrl('/access-marketplace', { state: { mpInactive: true } });
        }
        if(data.server.message==='user_inactive'){
          this.main.logout();
          this.router.navigateByUrl('/access-marketplace', { state: { userInactive: true } });
        }

        if(data.server.message==='Success' && data.response.user){
          const { marketplace_details } = data.response.user;
          const mp = {
            marketplace_logo: marketplace_details.company_logo,
            marketplace_name: marketplace_details.company_name,
            cover_photo: marketplace_details.cover_photo
          };
          const updated = { ...this.user, ...mp };
          this.main.setCookie('user',updated);
          this.main.user.next(updated);
        }

      });
  }

}
