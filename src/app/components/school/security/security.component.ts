import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from '../../../services/main.service';
import { login } from '../../../api-routes/routes';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit, OnDestroy {
  user: any;
  otpFields = new FormArray([
    new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
    new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
    new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
    new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)])
  ]);
  @ViewChild('otpalert') otpAlert: ElementRef;
  @ViewChildren('otpinputs') otpios: any;
  // @HostListener('window:beforeunload', ['$event'])
  // handeleScroll(e: any) {
  //   console.log('test');
  //   e.preventDefault();
  //   return e.returnValue = 'Are you sure ?';
  // }

  constructor(private router: Router, private main: MainService) {
    // this.main.tempUser
    //   .pipe(take(1))
    //   .subscribe((data) => {
    //     if (data) {
    //       this.main.tempUser.next('');
    //       this.user = data;
    //     } else {
    //       this.router.navigate(['/access-marketplace'])
    //     }
    //   });
  }

  ngOnInit(): void {
    this.main.updateTitle('Verification');
  }

  submit(): void {
    if (this.otpFields.invalid) {
      this.otpFields.controls.forEach(ctrl => ctrl.markAsDirty());
    } else {
      this.otpAlert.nativeElement.classList.remove('shown');
      this.main.toggleLoader(true);
      this.main.postFormData(login.CHECK_CODE, { code: this.otpFields.value.join(''), id: this.user.id })
        .subscribe(
          (data) => {
            console.log(data);
            this.main.toggleLoader(false);
            if (data.server.message === 'invalid_code') {
              this.otpAlert.nativeElement.classList.add('shown');
            }
            if (data.server.message === 'logged_in' || data.server.message === 'verifed') {
              const user = data.response.user;
              if (user.status === '1') {
                this.main.setCookie('user', { ...user });
                this.main.user.next({ ...user });
                this.router.navigate(['/marketplace']);
              } else {
                this.main.tempUser.next(user);
                this.router.navigate(['/signup']);
              }
            }
          },
          (err) => { this.main.toggleLoader(false); console.log(err); }
        );
    }
  }

  /* OTP FIELDS */

  checkNumbers(e, i) {
    if (e.data !== null) {
      e.target.value = e.data.replace(/[^0-9]/gi, '');
      if (e.target.value && i < 3) {
        this.focusInput(this.otpios._results[i + 1]);
      }
    }
  }

  pressed(ev, i): void {
    if (ev.which === 8 && i > 0) { this.focusInput(this.otpios._results[i - 1]); }
  }

  focusInput(input: any) {
    input.nativeElement.focus();
    input.nativeElement.select();
  }

  ngOnDestroy(): void { }

}
