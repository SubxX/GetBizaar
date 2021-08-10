import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { login } from '../../../api-routes/routes';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-your-account',
  templateUrl: './your-account.component.html',
  styleUrls: ['./your-account.component.scss']
})
export class YourAccountComponent implements OnInit, OnDestroy {
  user: any;
  userForm: FormGroup;
  userPhoto: any;
  userPhotoerr = false;
  profilePic: string;
  destroy: Subject<any> = new Subject<any>();

  @ViewChild('paymentlabel', { static: true }) paymentLabel: ElementRef;
  @ViewChild('paymentio', { static: true }) paymentIo: ElementRef;

  constructor(
    private main: MainService,
    private router: Router,
    private fb: FormBuilder
  ) {

    this.userForm = this.fb.group({
      id: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      payment_method: ['paypal'],
      payment_credential: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.main.updateTitle('Your account');
    if (this.main.isBrowser) {
      this.userForm.controls.payment_method.valueChanges
        .pipe(takeUntil(this.destroy))
        .subscribe(data => this.updatePaymentLabel(data))

      this.main.user.pipe(takeUntil(this.destroy))
        .subscribe((data) => {
          if (data) {
            this.user = data;
            console.log(this.user);
            const { first_name, last_name, payment_method, payment_credential, id, profile_picture } = this.user;
            this.profilePic = profile_picture;
            this.userForm.patchValue({ first_name, last_name, payment_method, payment_credential, id });
            this.userPhoto = { src: profile_picture, file: null }
          }
        });
    }

  }


  updateUserInfo(): void {
    if (this.userForm.invalid || !this.userPhoto) {
      if (!this.userPhoto) { this.userPhotoerr = true; }
      for (let ctrl in this.userForm.controls) {
        this.userForm.controls[ctrl].markAsDirty();
      }
    } else {
      this.main.toggleLoader(true);
      const payload = { ...this.userForm.value, profile_picture: this.userPhoto.file ? this.userPhoto.file : this.profilePic };
      this.main.postFormData(login.EDIT_USER, payload)
        .subscribe(
          (data) => {
            console.log(data);
            this.main.toggleLoader(false);
            if (data.server.message === 'updated') {
              const newUser = { ...this.user, ...data.response.user };
              this.main.setCookie('user', newUser);
              this.main.user.next(newUser);
              this.router.navigateByUrl('/marketplace', { state: { updated: true } });
            }
          },
          (err) => { this.main.toggleLoader(false); console.log(err); }
        );
    }
  }

  updatePaymentLabel(data): void {
    if (this.main.isBrowser) {
      const label = data === 'paypal' ? 'Paypal E-mail:' : 'Stripe E-mail:';
      const placeHolder = data === 'paypal' ? 'Enter Paypal E-mail' : 'Enter Stripe E-mail';
      this.paymentLabel.nativeElement.innerHTML = label;
      this.paymentIo.nativeElement.setAttribute('placeholder', placeHolder);
    }
  }

  fileSelected(e): void {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (r: any) => {
        this.userPhoto = { src: r.target.result, file: file };
        this.userPhotoerr = false;
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  }

  getError(control: AbstractControl) {
    return control.dirty && control.errors;
  }

  ngOnDestroy(): void {
    this.destroy.next('');
    this.destroy.unsubscribe();
  }

}
