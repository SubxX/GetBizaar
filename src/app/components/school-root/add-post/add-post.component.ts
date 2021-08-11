import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { MainService } from '../../../services/main.service';
import { products } from '../../../api-routes/routes';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit, OnDestroy {
  articleForm: FormGroup;
  articleId:String;
  articleImage:any;

  destroy: Subject<any> = new Subject();
  user: any;
  type = 'add';
  preventRefresh = false;

  @HostListener('window:beforeunload', ['$event'])
  handeleScroll(e: any) {
    if (this.preventRefresh) {
      e.preventDefault();
      return e.returnValue = 'Are you sure ?';
    }
  }

  constructor(private fb: FormBuilder, private main: MainService, private router: Router) {
    this.initForm();
    
    if (this.main.isBrowser) {
      this.main.user.pipe(takeUntil(this.destroy))
        .subscribe((data) => {
          if (data) { this.user = data; console.log(data); }
        });
    }
  }

  ngOnInit(): void {
    this.main.updateTitle('Create Article');

    if (this.main.isBrowser) {
      const editable: any = JSON.parse(localStorage.getItem('productEditable'));
      if (editable) {
        localStorage.removeItem('productEditable');
        this.type = 'edit';
        this.preventRefresh = true;
        const { name, email, location, price, quantity, rent_length, sale_or_rent, images, id } = editable;
        this.articleId = id;
      }
    }
  }

  initForm(): void {}

  submitForm(): void {
    console.log(this.articleForm.value);
  }

  fileSelected(e): void {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (r: any) => {
        this.articleImage = { src: r.target.result, file: file };
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
    this.destroy.subscribe();
  }

}
