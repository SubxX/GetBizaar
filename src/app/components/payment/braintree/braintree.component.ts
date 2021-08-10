import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { products, purchase } from '../../../api-routes/routes';
import { take } from 'rxjs/operators';
import { pipe } from 'rxjs';

declare const braintree;

@Component({
  selector: 'app-braintree',
  templateUrl: './braintree.component.html',
  styleUrls: ['./braintree.component.scss']
})
export class BraintreeComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('data') data: any;
  @Input('qty') qty: number;
  @Input('totalamount') totalAmt: any;
  @Output() paymentStatus: EventEmitter<Boolean> = new EventEmitter();

  @ViewChild('paybtn') payBtn: ElementRef;
  @ViewChild('dropinHolder') dropinHolder: ElementRef;

  customerId: any;
  dropinInstance: any;

  constructor(private main: MainService) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (this.main.isBrowser) this.getBraintreeClientToken();
  }

  getBraintreeClientToken(): void {
    this.main.toggleLoader(true);
    this.main.postFormData(purchase.CREATE_BRAINTREE_CLIENT_TOKEN, { id: this.data.purchasable_by })
      .pipe(take(1))
      .subscribe(
        (data) => {
          // this.main.toggleLoader(false);
          if (data.response.clientToken) {
            console.log(data.response);
            this.customerId = data.response.customerId;
            this.initilizeBraintree(data.response.clientToken);
            // this.main.showSnackbar({ state: true, message: 'Client Token generated', type: 'success' });
          }
        }, err => { console.log(err); this.main.toggleLoader(false); }
      );
  }

  initilizeBraintree(clientToken): void {
    const dropinHolder = this.dropinHolder.nativeElement;
    const payBtn = this.payBtn.nativeElement;

    braintree.dropin.create({
      authorization: clientToken,
      container: '#dropin-container',
      vaultManager: true,
      dataCollector: {
        kount: true
      },
      paypal: {
        flow: 'checkout',
        amount: '1.00',
        currency: 'USD'
      }
    }, (createErr, instance) => {
      this.main.toggleLoader(false);
      if (createErr) return;

      this.dropinInstance = instance;
      dropinHolder.classList.remove('d-none');
      instance.on('noPaymentMethodRequestable', () => payBtn.setAttribute('disabled', 'true'));
      instance.on('paymentMethodRequestable', function (event) {
        console.log(event.type, event.paymentMethodIsSelected);
        payBtn.removeAttribute('disabled');
      });

    });
  }

  chargePayment(): void {
    this.dropinInstance.requestPaymentMethod((requestPaymentMethodErr, chargeInfo) => {
      if (!chargeInfo) return;

      this.main.toggleLoader(true);
      const { id, marketplace_id, price, name, sale_or_rent, rent_length, purchasable_by } = this.data;
      const productpayLoad = {
        product_id: id,
        user_id: purchasable_by,
        marketplace_id,
        product_name: name,
        quantity: this.qty,
        unit_amount: price,
        rent_sale: sale_or_rent,
        rent_length: rent_length,
        payment_method_nonce: chargeInfo.nonce,
        deviceData: chargeInfo.deviceData,
        customer_id: this.customerId
      }
      this.main.postFormData(purchase.BUY_USING_PAYPAL, productpayLoad)
        .pipe(take(1))
        .subscribe(
          (data) => {
            console.log(data);
            this.main.toggleLoader(false);
            data.server.message === 'payment_successfull' ? this.paymentStatus.emit(true) : this.paymentStatus.emit(false);
          },
          (err) => { this.main.toggleLoader(false); console.log(err); }
        )

    });
  }

  ngOnDestroy(): void {
    this.dropinInstance.teardown(err => err && console.log('err'));
  }

}
