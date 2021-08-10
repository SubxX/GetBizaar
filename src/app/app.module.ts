import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, Location, LocationStrategy, PathLocationStrategy } from "@angular/common";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SetUpMarketplaceComponent } from './components/marketplace/set-up-marketplace/set-up-marketplace.component';
import { HomeComponent } from './components/marketplace/home/home.component';
import { AddPostComponent } from './components/marketplace-root/add-post/add-post.component';
import { NavBarComponent } from './components/common/nav-bar/nav-bar.component';
import { YourSalesRentalComponent } from './components/marketplace-root/your-sales-rental/your-sales-rental.component';
import { YourPurchasesComponent } from './components/marketplace-root/your-purchases/your-purchases.component';
import { YourPostsComponent } from './components/marketplace-root/your-posts/your-posts.component';
import { AuditLogComponent } from './components/marketplace-root/audit-log/audit-log.component';
import { MarketplaceComponent } from './components/marketplace-root/marketplace/marketplace.component';
import { ProductComponent } from './components/common/product/product.component';
import { ProductDetailsComponent } from './components/common/product-details/product-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { AccessMarketPlaceComponent } from './components/marketplace/access-market-place/access-market-place.component';
import { MarketplaceAvailabilityComponent } from './components/common/marketplace-availability/marketplace-availability.component';
import { YourAccountComponent } from './components/marketplace-root/your-account/your-account.component';
import { ConnectPaymentMethodComponent } from './components/marketplace/connect-payment-method/connect-payment-method.component';
import { ConfirmationPopupComponent } from './components/common/confirmation-popup/confirmation-popup.component';
import { SecurityComponent } from './components/marketplace/security/security.component';
import { LoaderComponent } from './components/common/loader/loader.component';
import {StripeComponent} from './components/payment/stripe/stripe.component';
import {BraintreeComponent} from './components/payment/braintree/braintree.component'
import {PaypalComponent} from './components/payment/paypal/paypal.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AvailabilityStatusPopupComponent } from './components/common/availability-status-popup/availability-status-popup.component';
import {ProductAddEditStatusComponent} from './components/common/product-add-edit-status/product-add-edit-status.component';

import {NumberInputDirective} from './directives/number-input/number-input.directive';
import {LazyLoadImageDirective} from './directives/lazy-load-image/lazy-load-image.directive';

import {LightboxSliderComponent} from './components/common/lightbox-slider/lightbox-slider.component';
import { SwiperModule } from 'swiper/angular';
import {MarketplaceRootComponent} from './components/marketplace-root/marketplace-root.component';

import {AuthGuardGuard} from './route-guards/auth-guard/auth-guard.guard';
import{CustomSnackbarComponent} from './components/common/custom-snackbar/custom-snackbar.component';


import { CookieModule } from 'ngx-cookie';

@NgModule({
  declarations: [
    AppComponent,
    MarketplaceRootComponent,
    SetUpMarketplaceComponent,
    HomeComponent,
    AddPostComponent,
    NavBarComponent,
    YourSalesRentalComponent,
    YourPurchasesComponent,
    YourPostsComponent,
    AuditLogComponent,
    MarketplaceComponent,
    ProductComponent,
    ProductDetailsComponent,
    AccessMarketPlaceComponent,
    MarketplaceAvailabilityComponent,
    YourAccountComponent,
    ConnectPaymentMethodComponent,
    ConfirmationPopupComponent,
    SecurityComponent,
    LoaderComponent,
    AvailabilityStatusPopupComponent,
    ProductAddEditStatusComponent,
    NumberInputDirective,
    LazyLoadImageDirective,
    LightboxSliderComponent,
    CustomSnackbarComponent,
    StripeComponent,
    BraintreeComponent,
    PaypalComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserModule, CookieModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SwiperModule
  ],
  providers: [
    AuthGuardGuard,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
