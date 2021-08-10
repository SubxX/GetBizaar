import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { purchase } from '../../../api-routes/routes';
import { take } from 'rxjs/operators';

declare const paypal;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent implements OnInit, AfterViewInit, OnChanges {
  @Input('data') data: any;
  @Input('qty') qty: number;
  @Input('totalamount') totalAmt: any;
  @Output() paymentStatus: EventEmitter<Boolean> = new EventEmitter();
  @ViewChild('paypalBtn') paypalBtn: ElementRef;
  btnRef: any;

  constructor(private main: MainService) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.renderPaypalBtn(this.totalAmt.toFixed(2))
  }

  // Update Price on change
  ngOnChanges(): void { }

  // Render Paypal button
  renderPaypalBtn(price?: any): void {
    this.btnRef = this.getPaypalRef(this.totalAmt.toFixed(2));
    this.btnRef.render(this.paypalBtn.nativeElement);
  }

  // Initilize Paypal with options
  getPaypalRef(amount?: any): any {
    return paypal.Buttons({

      style: {
        layout: 'horizontal',
        color: 'blue',
        shape: 'rect',
        label: 'paypal',
        tagline: 'The safer, easier way to pay',
        height: 50
      },

      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: this.totalAmt.toFixed(2) }
          }]
        });
      },

      onApprove: (data, actions) => {
        return actions.order
          .capture()
          .then(details => this.processOrder(details));
      },

      onCancel: data => {
        console.log('cancled');
      },

      onError: data => {
        console.log('Something went wrong');
      }

    })
  }

  // Process Order after payment success
  processOrder(orderInfo): void {
    const payload = {
      product_id: this.data.id,
      user_id: this.data.purchasable_by,
      marketplace_id: this.data.marketplace_id,
      product_name: this.data.name,
      quantity: this.qty,
      unit_amount: this.data.price,
      rent_sale: this.data.sale_or_rent,
      rent_length: this.data.rent_length,
      order_id: orderInfo.id
    };
    this.main.toggleLoader(true);
    this.main.postFormData(purchase.BUY_USING_PAYPAL, payload)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.main.toggleLoader(false);
          data.server.message === 'payment_successfull' ? this.paymentStatus.emit(true) : this.paymentStatus.emit(false);
        }, err => { console.log(err); this.main.toggleLoader(false); }
      );
  }

}
