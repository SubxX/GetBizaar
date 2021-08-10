import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../../../services/main.service';
import { products } from '../../../api-routes/routes';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent implements OnInit, OnDestroy {
  products: any;
  user: any;
  destroy: Subject<any> = new Subject();
  search: string;
  filter = { lowest_price: false, location: false, most_recent: false }

  constructor(
    private router: Router,
    private main: MainService
  ) {
    if (this.main.isBrowser) {
      this.main.user
        .pipe(takeUntil(this.destroy))
        .subscribe((data: any) => {
          if (data) {
            this.user = data;
            console.log(this.user);
            this.getMarketplaceData(this.user.id);
          }
        });
    }
  }

  ngOnInit(): void {
    this.main.updateTitle('Marketplace');
    if (this.main.isBrowser && history.state.updated) this.openSnackBar();
  }

  openSnackBar() {
    this.main.showSnackbar({ state: true, message: 'Account information updated', type: 'success' });
  }


  getMarketplaceData(userId): void {
    this.main.toggleLoader(true);
    this.main.postFormData(products.MARKETPLACE_PRODUCTS, { id: userId })
      .pipe(take(1))
      .subscribe(
        (data) => {
          console.log(data);
          this.main.toggleLoader(false);
          this.products = data.server.message === 'product_does_not_exists' ? [] : data.response.product;
        },
        (err) => { this.main.toggleLoader(false); console.log(err); }
      );
  }

  searchProduct(event, keyword: string): void {
    event.preventDefault();
    if (keyword) {
      this.main.toggleLoader(true);
      this.main.postFormData(products.SEARCH_PRODUCTS, { id: this.user.id, search: keyword })
        .pipe(take(1))
        .subscribe(
          (data) => {
            this.main.toggleLoader(false);
            this.products = data.server.message === 'product_does_not_exists' ? [] : data.response.product;
            console.log(this.products);
          }, err => { console.log(err); this.main.toggleLoader(false); }
        )
    } else {
      this.getMarketplaceData(this.user.id);
      this.search = '';
    }
  }

  filterProduct(): void {
    if (this.search) this.search = '';
    this.main.toggleLoader(true);
    let payload = { ...this.filter };
    for (let key in this.filter) { payload[key] = this.filter[key] ? 1 : 0; };
    this.main.postFormData(products.FILTER_PRODUCTS, { id: this.user.id, ...payload })
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.main.toggleLoader(false);
          this.products = data.server.message === 'product_does_not_exists' ? [] : data.response.product;
          console.log(this.products);
        }, err => { console.log(err); this.main.toggleLoader(false); }
      )
  }

  ngOnDestroy(): void {
    this.destroy.next('');
    this.destroy.unsubscribe();
  }

}
