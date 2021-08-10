import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { LightboxSliderComponent } from '../lightbox-slider/lightbox-slider.component';
import { MainService } from '../../../services/main.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  qty: number = 1;
  totalAmt: any;
  paymentForm: FormGroup;
  payUsing: any;

  constructor(
    private dialogRef: MatDialogRef<ProductDetailsComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private main: MainService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postal_code: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    // this.qty = this.getNumber(this.data.quantity);
    this.totalAmt = parseFloat(this.data.price) * this.qty;
    console.log(this.data, parseFloat(this.data.price), this.totalAmt);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.showPayment(), 100);
  }

  showInputError(control: AbstractControl) {
    return control.dirty && control.errors;
  }

  close(): void {
    this.dialogRef.close();
  }

  getNumber(num) {
    return parseInt(num);
  }

  incDecQuantity(type: any): void {
    if (type === 'inc') {
      if (this.qty + 1 > this.data.quantity) return;
      ++this.qty;
    } else {
      if (this.qty - 1 < 1) return;
      --this.qty;
    }
    this.totalAmt = parseFloat(this.data.price) * this.qty;
  }

  openLightBox(images, index): void {
    this.dialog.open(LightboxSliderComponent, { width: '90%', maxWidth: '800px', data: { images, index } })
  }

  showPayment(): void {
    this.payUsing = this.data.method;
  }

  handlePaymentStatus(state): void {
    if (!state) return;
    this.dialog.closeAll();
    this.router.navigateByUrl('/marketplace/your-purchases', { state: { added: true } });
  }

}

/*

  buyProduct(e):void{
    e.preventDefault();
    this.main.toggleLoader(true);
    this.main.postFormData(purchase.BUY_PRODUCT,{
      product_id: this.data.id,
      user_id: this.data.purchasable_by,
      marketplace_id: this.data.marketplace_id,
      product_name: this.data.name,
      quantity: this.qty,
      unit_amount: parseFloat(this.data.price).toFixed(2),
      source: 'test',
      rent_sale:this.data.sale_or_rent==='rent' ? 'rent' : 'sale',
      rent_length:null,
      ...this.paymentForm.value
    })
    .pipe(take(1))
    .subscribe(
      (data)=>{
        this.main.toggleLoader(false);
        if(data.server.message ==='purchased_successfull'){
          this.dialogRef.close();
          this.router.navigateByUrl('/marketplace/your-purchases', { state: { added: true } });
        }else{
          this.main.showSnackbar({ state: true, message: 'Payment failed', type: 'warning' });
        }
      },(err)=>{
        console.log(err);
        this.main.toggleLoader(false);
      }
    )

  }

  async loadStripe(): Promise<any> {
    this.stripe = await loadStripe('pk_test_51Id8lkSFq7DFbHcFltt8fBF6TFsgMGGIdIANxs0WRaoXQG2GpeCmP2SH94qTqTaiDe6jt6Z2IcKQ8K9CmYL1v9IX00KaXbVXnZ');
    const elements = this.stripe.elements();
    this.card = elements.create('card', { hidePostalCode: true });
    this.card.mount(this.cardElment.nativeElement);

    const test = (e) => this.cardValid = e.complete;
    this.card.addEventListener('change', (e) => test(e));
  }

  async submitStripeForm(e): Promise<any> {
    e.preventDefault();
    if (this.paymentForm.valid) {
      this.loading(true);
      const { error, token } = await this.stripe.createToken(this.card);
      if (error) {
        console.log(error);
        this.loading(false);
        this.main.showSnackbar({ state: true, message: 'Invalid payment information', type: 'warning' });
      } else {
        this.loading(false);
        this.main.toggleLoader(true);
        const payload = {
          description: this.data.name,
          source: token.id,
          quantity: this.qty,
          unit_amount: parseFloat(this.data.price).toFixed(2),
          product_name: this.data.name,
          product_id: this.data.id,
          user_id: this.data.purchasable_by,
          marketplace_id: this.data.marketplace_id,
          ...this.paymentForm.value
        };
        console.log(payload);
        this.buyProductUsingStripe(payload);
      }
    } else {
      this.main.showSnackbar({ state: true, message: 'Invalid payment information', type: 'warning' });
    }
  }

  loading(isLoading) {
    if (isLoading) {
      document.querySelector("button").disabled = true;
      document.querySelector("#spinner").classList.remove("hidden");
      document.querySelector("#button-text").classList.add("hidden");
    } else {
      document.querySelector("button").disabled = false;
      document.querySelector("#spinner").classList.add("hidden");
      document.querySelector("#button-text").classList.remove("hidden");
    }
  };

  buyProductUsingStripe(payload): void {
    this.main.toggleLoader(true);
    this.main.postFormData(purchase.CREATE_STRIPE_SESSION, payload)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.main.toggleLoader(false);
          if (data.server.message === 'purchased_successful') {
            this.dialogRef.close();
            this.router.navigateByUrl('/marketplace/your-purchases', { state: { added: true } });
          } else {
            this.main.showSnackbar({ state: true, message: 'Payment failed', type: 'warning' });
          }
        }, err => { console.log(err); this.main.toggleLoader(false); }
      );
  }

  // Braintree

  getBraintreeClientToken(): void {
    this.main.postFormData(purchase.CREATE_BRAINTREE_CLIENT_TOKEN, { id: this.data.purchasable_by })
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.main.toggleLoader(false);
          if (data.response.clientToken) {
            this.initilizeBraintree(data.response.clientToken);
            this.main.showSnackbar({ state: true, message: 'Client Token generated', type: 'success' });
          }
        }, err => { console.log(err); this.main.toggleLoader(false); }
      );
  }

  initilizeBraintree(clientToken): void {
    const dropinHolder = document.getElementById('dropinHolder');
    const payBtn = document.getElementById('paybtn');
    braintree.dropin.create({
      authorization: clientToken,
      container: '#dropin-container',
      vaultManager: true,
      dataCollector: {
        kount: true
      },
      venmo: {
        allowNewBrowserTab: false
      },
      paypal: {
        flow: 'checkout',
        amount: '1.00',
        currency: 'USD'
      }
    }, function (createErr, instance) {
      if (createErr) return;
      dropinHolder.classList.remove('d-none');

      instance.on('noPaymentMethodRequestable', function () {
        payBtn.setAttribute('disabled', 'true');
      });

      instance.on('paymentMethodRequestable', function (event) {
        console.log(event.type);
        console.log(event.paymentMethodIsSelected);

        payBtn.removeAttribute('disabled');
      });

      payBtn.addEventListener('click', function () {
        instance.requestPaymentMethod(function (requestPaymentMethodErr, payload) {
          console.log(requestPaymentMethodErr, payload);
        });
      });
    });
  }

  */
