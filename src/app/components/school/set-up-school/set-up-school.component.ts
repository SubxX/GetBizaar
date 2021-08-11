import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MainService } from '../../../services/main.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { marketplace } from '../../../api-routes/routes';
import { takeUntil } from 'rxjs/operators';

interface Photo {
  src: string;
  file: File;
}

@Component({
  selector: 'app-set-up-school',
  templateUrl: './set-up-school.component.html',
  styleUrls: ['./set-up-school.component.scss']
})

export class SetUpSchoolComponent implements OnInit, OnDestroy {
  step = 1;
  userId: string;
  setUpForm: FormGroup;
  otpFields: FormArray;
  coverPhoto: Photo;
  coverPhotoErr = false;
  companyLogo: Photo;
  companyLogoErr = false;
  destroy: Subject<any> = new Subject<any>();

  @ViewChildren('otpinputs') otpios: any;
  @ViewChild('emailalert') emailAlert: ElementRef;
  @ViewChild('otpalert') otpAlert: ElementRef;
  @HostListener('window:beforeunload', ['$event'])
  unload(e: any) {
    if (this.step > 1) {
      e.preventDefault();
      return e.returnValue = 'Are you sure ?';
    }
  }

  constructor(
    private fb: FormBuilder,
    private main: MainService,
    private router: Router,
    private aRoute: ActivatedRoute
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.main.updateTitle('Setup School Newspaper');
  }

  initForms(): void {
    this.setUpForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      mail: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
      mailhandle: ['', [Validators.required, Validators.pattern('^@[A-Za-z0-9._%-]+\\.[a-z]{2,3}$')]],
      companyname: ['', Validators.required]
    });
    this.otpFields = new FormArray([
      new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
      new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
      new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
      new FormControl('', [Validators.required, Validators.maxLength(1), Validators.minLength(1)])
    ]);
    this.setUpForm.controls.mail.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(val => {
        if (!this.setUpForm.controls.mailhandle.dirty) { this.setUpForm.controls.mailhandle.markAsDirty(); }
        if (val) {
          const mailHandle = val.split('@');
          this.setUpForm.controls.mailhandle.setValue(mailHandle.length > 1 ? `@${mailHandle[1]}` : '');
        }
      });
  }

  navigateToHome() {
    if (this.step > 1) return;
    this.router.navigate(['/']);
  }

  next(): void {
    switch (this.step) {
      case 1:
        // this.setUpForm.valid ? this.register() : this.markFormFielsAsDirty(this.setUpForm);
        ++this.step
        break;
      case 2:
        // this.otpFields.valid ? this.checkOtp() : this.otpFields.controls.forEach(ct => ct.markAsDirty());
        ++this.step
        break;
      case 3:
        ++this.step
        // if (this.coverPhoto) {
        //   this.coverPhotoErr = false;
        //   this.uploadPhoto({ cover_photo: this.coverPhoto.file });
        // } else {
        //   this.coverPhotoErr = true;
        // }
        break;
      case 4:
        ++this.step
        // if (this.companyLogo) {
        //   this.companyLogoErr = false;
        //   this.uploadPhoto({ company_logo: this.companyLogo.file, application_status: 1 });
        // } else {
        //   this.companyLogoErr = true;
        // }
        break;
      default:
        console.log('IMVALID STEP');
        break;
    }
  }

  skip() {
    this.step === 4 ?
      this.uploadPhoto({ company_logo: this.companyLogo ? this.companyLogo.file : null, application_status: 1 }) :
      ++this.step;
  }

  register(): void {
    this.main.toggleLoader(true);
    const { fname, lname, mail, mailhandle, companyname } = this.setUpForm.value;
    const payload = {
      first_name: fname,
      last_name: lname,
      email: mail,
      company_name: companyname,
      submit: 1
    }
    this.main.postFormData(marketplace.ADD, payload)
      .subscribe(
        (data: any) => {
          this.main.toggleLoader(false);
          console.log('Success', data);
          if (data.server.message === 'User already exist') {
            this.emailAlert.nativeElement.classList.add('shown');
          } else {
            this.setUpForm.reset();
            this.userId = data.response.marketplace.id;
            this.step = 2;
            localStorage.setItem('mpnewsignup', JSON.stringify({ id: data.response.marketplace.id, step: this.step }));
          }
        },
        err => { console.log('Failed', err); this.main.toggleLoader(false); }
      );
  }

  checkOtp() {
    if (this.otpAlert.nativeElement.classList.contains('shown')) { this.otpAlert.nativeElement.classList.remove('shown'); }
    this.main.toggleLoader(true);
    this.main.postFormData(marketplace.CHECK_VERIFICATION, { code: this.otpFields.value.join(''), id: this.userId })
      .subscribe(
        (data: any) => {
          this.main.toggleLoader(false);
          if (data.server.message === 'Invalid varification code') {
            console.log('Invalid Code');
            this.otpAlert.nativeElement.classList.add('shown');
          } else {
            this.step = 3;
            this.otpFields.reset();
          }
        },
        err => { console.log('Failed', err); this.main.toggleLoader(false); }
      );
  }

  uploadPhoto(payload): void {
    this.main.toggleLoader(true);
    this.main.postFormData(marketplace.UPLOAD_IMAGE, { id: this.userId, ...payload })
      .subscribe(
        (data: any) => {
          console.log(data);
          this.main.toggleLoader(false);
          if (data.server.code === 200) {
            ++this.step;
            if (payload.cover_photo) { this.coverPhoto = undefined; }
            if (payload.application_status === 1) {
              this.companyLogo = undefined;
              localStorage.removeItem('user');
              this.main.user.next('');
            }
          }
        },
        err => { console.log('Failed', err); this.main.toggleLoader(false); }
      );
  }


  fileSelected(e, type): void {
    console.log(e);
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (r: any) => {
        type === 'cover' ? this.coverPhoto = { src: r.target.result, file: file } :
          this.companyLogo = { src: r.target.result, file: file };
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  }

  markFormFielsAsDirty(form: FormGroup) {
    for (let ctrl in form.controls) {
      form.controls[ctrl].markAsDirty();
    }
  }

  getError(control: AbstractControl) {
    return control.dirty && control.errors;
  }

  /* OTP FIELD FUNCTIONALITY */
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

  ngOnDestroy(): void {
    this.destroy.next('');
    this.destroy.unsubscribe();
  }

}
