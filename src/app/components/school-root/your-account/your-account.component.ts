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


  constructor(
    private main: MainService,
    private router: Router,
    private fb: FormBuilder
  ) {

    this.userForm = this.fb.group({
      id: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      bio: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.main.updateTitle('My Profile');

    if (this.main.isBrowser) {

      this.main.user.pipe(takeUntil(this.destroy))
        .subscribe((data) => {
          if (data) {
            this.user = data;
            console.log(this.user);
            const { first_name, last_name, bio, id, profile_picture } = this.user;
            this.profilePic = profile_picture;
            this.userForm.patchValue({ first_name, last_name, bio, id });
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
      console.log(payload);
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
