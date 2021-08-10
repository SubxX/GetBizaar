import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from '../../../services/main.service';
import { login } from '../../../api-routes/routes';
import { take, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-connect-payment-method',
  templateUrl: './connect-payment-method.component.html',
  styleUrls: ['./connect-payment-method.component.scss']
})
export class ConnectPaymentMethodComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  userPhoto: any;
  userPhotoerr = false;
  user: any;
  subscription: Subscription;
  @ViewChild('paymentlabel') paymentLabel: ElementRef;
  @ViewChild('paymentio') paymentIo: ElementRef;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private main: MainService
  ) {
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
      payment_method: ['paypal'],
      payment_credential: ['', Validators.required]
    });

    this.subscription = this.userForm.controls.payment_method.valueChanges
      .subscribe(data => this.updatePaymentLabel(data))

    this.main.tempUser
      .pipe(take(1))
      .subscribe((data) => {
        if (data) {
          this.user = data;
          console.log(this.user);
          this.userForm.controls.email.setValue(this.user.email);
          this.userForm.controls.email.disable();
          this.main.tempUser.next('');
        } else {
          this.router.navigate(['/access-marketplace'])
        }
      });
  }

  updatePaymentLabel(data): void {
    const label = data === 'paypal' ? 'Paypal E-mail:' : 'Stripe E-mail:';
    const placeHolder = data === 'paypal' ? 'Enter Paypal E-mail' : 'Enter Stripe E-mail';
    this.paymentLabel.nativeElement.innerHTML = label;
    this.paymentIo.nativeElement.setAttribute('placeholder', placeHolder);
  }

  ngOnInit(): void {
    this.main.updateTitle('Signup');
  }

  submit(): void {
    if (this.userForm.invalid || !this.userPhoto) {
      if (!this.userPhoto) { this.userPhotoerr = true; }
      for (let ctrl in this.userForm.controls) {
        this.userForm.controls[ctrl].markAsDirty();
      }
    } else {
      this.main.toggleLoader(true);
      console.log({ ...this.userForm.value, profile_picture: this.userPhoto.file });
      this.main.postFormData(login.UPDATE_USER, { ...this.userForm.value, id: this.user.id, profile_picture: this.userPhoto.file })
        .subscribe(
          (data) => {
            console.log(data);
            this.main.toggleLoader(false);
            if (data.server.message === 'Updated successfully') {
              localStorage.setItem('user', JSON.stringify({ ...data.response.user }));
              this.main.user.next({ ...data.response.user });
              this.main.setCookie('user', { ...data.response.user });
              this.router.navigate(['/marketplace']);
            }
          },
          (err) => { this.main.toggleLoader(false); console.log(err); }
        );
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
    this.subscription.unsubscribe();
  }

}
