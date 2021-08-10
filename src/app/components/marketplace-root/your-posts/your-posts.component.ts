import { Component, OnDestroy, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { products } from '../../../api-routes/routes';
import { take, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-your-posts',
  templateUrl: './your-posts.component.html',
  styleUrls: ['./your-posts.component.scss']
})
export class YourPostsComponent implements OnInit, OnDestroy {
  products: any;
  user: any;
  destroy: Subject<any> = new Subject<any>();
  constructor(private main: MainService, private router: Router) {
    if (this.main.isBrowser) {
      this.main.user.pipe(takeUntil(this.destroy))
        .subscribe((data) => {
          if (data) {
            this.user = data;
            this.getPosts()
          }
        })
    }
  }

  ngOnInit(): void {
    this.main.updateTitle('Your posts');
  }

  getPosts(deleteFetch?: any): void {
    this.main.toggleLoader(true);
    this.main.postFormData(products.MY_LISTING, { id: this.user.id })
      .pipe(take(1))
      .subscribe(
        data => {
          this.main.toggleLoader(false);
          console.log(data);
          data.server.message === 'product_does_not_exists' ? this.products = [] :
            this.products = data.response.product;
          console.log(this.products);
          if (deleteFetch) { this.main.showSnackbar({ state: true, message: 'Product deleted successfully', type: 'success' }); }
        }, err => { this.main.toggleLoader(false); console.log(err); }
      );
  }

  deletePost(id): void {
    console.log(id);
    this.main.postFormData(products.DELETE_PRODUCT, { id, user_id: this.user.id })
      .pipe(take(1))
      .subscribe(
        data => {
          console.log(data);
          if (data.server.message === 'product_deleted') {
            this.getPosts(true);
          }
        }, err => { this.main.toggleLoader(false); console.log(err); }
      );
  }

  editPost(data): void {
    if (this.main.isBrowser) {
      localStorage.setItem('productEditable', JSON.stringify(data));
      this.router.navigate(['/marketplace/add-post']);
    }
  }

  ngOnDestroy(): void {
    this.destroy.next('');
    this.destroy.unsubscribe();
  }

}
