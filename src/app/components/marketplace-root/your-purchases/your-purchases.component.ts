import { Component, OnDestroy, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { products } from '../../../api-routes/routes';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-your-purchases',
  templateUrl: './your-purchases.component.html',
  styleUrls: ['./your-purchases.component.scss']
})
export class YourPurchasesComponent implements OnInit, OnDestroy {
  products: any;
  user: any;
  destroy: Subject<any> = new Subject();

  constructor(private main: MainService) {
    if (this.main.isBrowser) {
      this.main.user.pipe(takeUntil(this.destroy))
        .subscribe((data) => {
          if (data) {
            this.user = data;
            this.getPurchasedProducts();
          }
        })
    }
  }

  ngOnInit(): void {
    this.main.updateTitle('Your purchases');
  }

  openSnackBar(): void {
    this.main.showSnackbar({ state: true, message: 'Purchased successfully', type: 'success' });
  }

  getPurchasedProducts(): void {
    this.main.toggleLoader(true);
    this.main.postFormData(products.PURCHASED_PRODUCTS, { id: this.user.id })
      .pipe(take(1))
      .subscribe(
        (data) => {
          console.log(data);
          this.main.toggleLoader(false);
          if (history.state.added) this.openSnackBar();
          this.products = data.server.message === 'product_exists' ? data.response.products : [];
        }, (err) => { console.log(err); this.main.toggleLoader(false) }
      )
  }

  ngOnDestroy(): void {
    this.destroy.next('');
    this.destroy.unsubscribe();
  }

}
