import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { MainService } from '../../../services/main.service';
import { products } from '../../../api-routes/routes';
import { Router } from '@angular/router';
import { ProductAddEditStatusComponent } from '../../common/product-add-edit-status/product-add-edit-status.component';


@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit, OnDestroy {
  newPostForm: FormGroup;
  photos: Array<any> = [];
  noPhotos: any;
  destroy: Subject<any> = new Subject();
  user: any;
  oldImages = [];
  type = 'add';
  preventRefresh = false;
  productId: string;
  @ViewChild('prodcutFormHolder') formHolder: ElementRef;

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
    this.main.updateTitle('Create post');

    if (this.main.isBrowser) {
      const editable: any = JSON.parse(localStorage.getItem('productEditable'));
      if (editable) {
        localStorage.removeItem('productEditable');
        this.type = 'edit';
        this.preventRefresh = true;
        const { name, email, location, price, quantity, rent_length, sale_or_rent, images, id } = editable;
        this.newPostForm.patchValue({
          name, quantity, location, work_email: email, price, rent_length: rent_length == null ? '' : rent_length,
          sale_or_rent: sale_or_rent
        });
        this.oldImages = images;
        this.productId = id;
      }
    }
  }

  initForm(): void {
    this.newPostForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required]],
      location: ['', [Validators.required, this.validateLocation]],
      sale_or_rent: ['sale', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      rent_length: [],
      work_email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]]
    });

    this.newPostForm.get('sale_or_rent').valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(value => {
        if (value === 'rent') {
          this.newPostForm.get('rent_length').setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
          this.newPostForm.get('rent_length').updateValueAndValidity();
        } else {
          this.newPostForm.get('rent_length').clearValidators();
          this.newPostForm.get('rent_length').reset();
        }
      });
  }

  validateLocation(c: FormControl) {
    if (!c.value) return null;
    const count = c.value.split(',').map(v => v.trim());
    return count.length > 2 && !count.includes("") ? null : {
      validLocation: { valid: false }
    };
  }

  setSaleOrRent(state: string) {
    this.newPostForm.get('sale_or_rent').setValue(state);
    console.log(this.getSaleOrRentVal());
  }

  getSaleOrRentVal(): string {
    return this.newPostForm.get('sale_or_rent').value;
  }

  submitForm(): void {
    if (this.newPostForm.invalid) {
      let invalidFieldID: String;

      for (let itm in this.newPostForm.controls) {
        this.newPostForm.controls[itm].markAsDirty();
        if (!invalidFieldID && this.newPostForm.controls[itm].errors) invalidFieldID = itm;
        if (this.type === 'add' && this.photos.length === 0) { this.noPhotos = true; }
        if (this.type === 'edit' && this.photos.length === 0 && this.oldImages.length === 0) {
          this.noPhotos = true;
        }
      }

      if (!invalidFieldID) return;

      const bodyRect = document.body.getBoundingClientRect();
      const pos = this.formHolder.nativeElement.querySelector(`#${invalidFieldID}`).getBoundingClientRect();
      const offset = (pos.top - bodyRect.top) - 120;
      window.scrollTo(0, offset);

    } else {

      if (this.type == 'add') {
        this.photos.length === 0 ? this.noPhotos = true :
          this.addPost({ ...this.newPostForm.value, files: this.photos });
      }

      if (this.type == 'edit') {
        this.photos.length === 0 && this.oldImages.length === 0 ? this.noPhotos = true :
          this.editProduct({ ...this.newPostForm.value, files: this.photos });
      }

    }
  }


  addPost(data: any) {
    const { name, quantity, price, sale_or_rent, rent_length, files, work_email, location } = data;
    const images = files.map(f => f.file);
    const payload = {
      name,
      location,
      quantity,
      price,
      rent_length,
      images,
      work_email,
      sale_or_rent,
      marketplace_id: this.user.marketplace_id,
      user_id: this.user.id
    };
    console.log(payload);
    this.main.toggleLoader(true);
    this.main.postFormData(products.ADD_PRODUCT, payload)
      .pipe(take(1))
      .subscribe((data) => {
        this.main.toggleLoader(false);
        if (data.server.code === 200 && data.server.message === 'added') {
          this.newPostForm.reset();
          this.photos = [];
          this.main.openDialog(ProductAddEditStatusComponent, '85%', '360px',
            { title: 'Product added successfully!', type: 'add' })
            .afterClosed().pipe(take(1))
            .subscribe((data) => {
              if (data) { this.router.navigate(['/marketplace/your-posts']); }
            })
        }
      });
  }

  editProduct(data: any): void {
    const { name, quantity, price, sale_or_rent, rent_length, files, work_email, location } = data;
    const update_images = files.map(f => f.file);
    const images = this.oldImages.map(i => i.image_url);
    const payload = {
      name,
      location,
      quantity,
      price,
      rent_length,
      update_images,
      images,
      work_email,
      sale_or_rent,
      marketplace_id: this.user.marketplace_id,
      user_id: this.user.id,
      id: this.productId
    };
    console.log(payload);
    this.main.toggleLoader(true);
    this.main.postFormData(products.UPDATE_PRODUCT, payload)
      .pipe(take(1))
      .subscribe((data) => {
        this.main.toggleLoader(false);
        if (data.server.code === 200 && data.server.message === 'updated') {
          this.newPostForm.reset();
          this.photos = [];
          this.oldImages = [];
          this.productId = '';
          this.preventRefresh = false;
          console.log(data);
          this.main.openDialog(ProductAddEditStatusComponent, '85%', '360px',
            { title: 'Product updated successfully!', type: 'edit' })
            .afterClosed().pipe(take(1))
            .subscribe((data) => {
              data ? this.router.navigate(['/marketplace/your-posts']) : this.type = 'add';
            });
        }
      });
  }

  fileSelected(e): void {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (r: any) => {
        this.photos.push({ src: r.target.result, file: file });
        e.target.value = '';
      };
      reader.readAsDataURL(file);
      if (this.noPhotos) { this.noPhotos = undefined; }
    }
  }

  deleteSelectImage(i): void {
    this.photos.splice(i, 1);
  }

  deleteFromAddedIamges(i): void {
    this.oldImages.splice(i, 1);
  }

  getError(control: AbstractControl) {
    return control.dirty && control.errors;
  }

  incDecQuantity(type: any): void {
    let val = this.newPostForm.controls.quantity.value;
    type === 'inc' ? this.newPostForm.get('quantity').setValue(++val) :
      this.newPostForm.get('quantity').setValue(val !== 0 ? --val : 0);
  }

  ngOnDestroy(): void {
    this.destroy.next('');
    this.destroy.subscribe();
  }

}
