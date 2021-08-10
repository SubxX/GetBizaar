import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../environments/environment';
import { Title } from "@angular/platform-browser";

interface snackbarData {
  state: boolean;
  type: string;
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class MainService {
  isBrowser = false;
  loader: Subject<boolean> = new Subject<boolean>();
  user: BehaviorSubject<any> = new BehaviorSubject<any>('');
  tempUser: BehaviorSubject<any> = new BehaviorSubject<any>('');
  snackbarState: Subject<snackbarData> = new Subject<snackbarData>();

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private title: Title,
    @Inject(PLATFORM_ID) platformId,
    private cookieService: CookieService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setCookie(key: string, data: any): any {
    var date = new Date();
    const days = 365;
    date.setTime(+ date + (days * 86400000));
    console.log(date);

    this.cookieService.put(key, JSON.stringify(data), { expires: date });
    // this.cookieService.put(key,JSON.stringify(data),{expires:date,sameSite:"none",secure:true});
  }

  getCookie(key: string) {
    const data = this.cookieService.get(key);
    return data ? JSON.parse(data) : undefined;
  }

  removeCookie(key: string): void {
    this.cookieService.remove(key);
  }

  postFormData(url, payload: any): any {
    const body = new FormData();
    for (let field in payload) {
      const val = payload[field];
      if (Array.isArray(val)) {
        const arrayKey = `${field}[]`;
        val.forEach(v => body.append(arrayKey, v));
      } else { body.append(field, payload[field]); }
    }
    return this.http.post(`${environment.apiBase}${url}`, body);
  }
  get(url): any {
    return this.http.get(`${environment.apiBase}${url}`);
  }
  toggleLoader(state: boolean): void {
    this.loader.next(state);
  }
  openDialog(component, wdth, maxwdth, payload?: any): any {
    this.dialog.closeAll();
    return this.dialog.open(component, { width: wdth, maxWidth: maxwdth, data: payload });
  }
  logout(): void {
    this.removeCookie('user');
    this.user.next('');
  }

  showSnackbar(data: snackbarData) {
    this.snackbarState.next(data);
  }

  // SEO RELATED STUFF

  updateTitle(tt?: string): void {
    this.title.setTitle(tt ? `Bizaar | ${tt}` : 'Bizaar');
  }

}
