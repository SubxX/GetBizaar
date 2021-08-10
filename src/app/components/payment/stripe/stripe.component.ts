import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { loadStripe } from '@stripe/stripe-js';
import { MainService } from '../../../services/main.service';
import { purchase } from '../../../api-routes/routes';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss']
})
export class StripeComponent implements OnInit, AfterViewInit, OnChanges {
  stripe: any;
  cardValid = false;
  card: any;

  @ViewChild('stripeform') stripeForm: ElementRef;
  @ViewChild('cardelment') cardElment: ElementRef;
  @Input('data') data: any;
  @Input('qty') qty: number;
  @Input('totalamount') totalAmt: any;
  @Output() paymentStatus: EventEmitter<Boolean> = new EventEmitter();

  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private main: MainService
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
    this.totalAmt = parseFloat(this.data.price) * this.qty;
  }

  ngAfterViewInit(): void {
    if (this.main.isBrowser) this.initStripe();
  }

  ngOnChanges(): void { }

  async initStripe(): Promise<any> {
    this.stripe = await loadStripe(environment.stripe);

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
          rent_sale: this.data.sale_or_rent,
          rent_length: this.data.rent_length,
          ...this.paymentForm.value
        };
        console.log(payload);
        this.buyProductUsingStripe(payload);
      }
    } else {
      this.main.showSnackbar({ state: true, message: 'Invalid payment information', type: 'warning' });
    }
  }

  buyProductUsingStripe(payload): void {
    this.main.toggleLoader(true);
    this.main.postFormData(purchase.CREATE_STRIPE_SESSION, payload)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.main.toggleLoader(false);
          data.server.message === 'purchased_successful' ? this.paymentStatus.emit(true) : this.paymentStatus.emit(false);
        }, err => { console.log(err); this.main.toggleLoader(false); }
      );
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
  }

  getNumber(num) { return parseInt(num); }

  showInputError(control: AbstractControl) {
    return control.dirty && control.errors;
  }

}
