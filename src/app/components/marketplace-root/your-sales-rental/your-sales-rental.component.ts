import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { products } from '../../../api-routes/routes';
import { MainService } from '../../../services/main.service';


@Component({
  selector: 'app-your-sales-rental',
  templateUrl: './your-sales-rental.component.html',
  styleUrls: ['./your-sales-rental.component.scss']
})
export class YourSalesRentalComponent implements OnInit, OnDestroy {
  products: any;
  destroy: Subject<any> = new Subject();
  user: any;

  constructor(private main: MainService) {
    if (this.main.isBrowser) {
      this.main.user.pipe(takeUntil(this.destroy))
        .subscribe((data) => {
          if (data) {
            this.user = data;
            this.getSaleRentalProducts();
          }
        })
    }
  }

  ngOnInit(): void {
    this.main.updateTitle('Your sales & rentals');
  }

  getSaleRentalProducts(): void {
    this.main.toggleLoader(true);
    this.main.postFormData(products.SALES_RENTAL, { id: this.user.id })
      .pipe(take(1))
      .subscribe(
        (data) => {
          console.log(data);
          this.main.toggleLoader(false);
          this.products = data.server.message === 'product_exists' ? data.response.products : [];
        }, (err) => { console.log(err); this.main.toggleLoader(false); this.products = []; }
      )
  }

  ngOnDestroy(): void {
    this.destroy.next('');
    this.destroy.unsubscribe();
  }

}
