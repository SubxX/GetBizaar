import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailabilityStatusPopupComponent } from './availability-status-popup/availability-status-popup.component';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';
import { LoaderComponent } from './loader/loader.component';
import { MarketplaceAvailabilityComponent } from './marketplace-availability/marketplace-availability.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProductComponent } from './product/product.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AvailabilityStatusPopupComponent,
    ConfirmationPopupComponent,
    CustomSnackbarComponent,
    LoaderComponent,
    MarketplaceAvailabilityComponent,
    NavBarComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    AvailabilityStatusPopupComponent,
    ConfirmationPopupComponent,
    CustomSnackbarComponent,
    LoaderComponent,
    MarketplaceAvailabilityComponent,
    NavBarComponent,
    ProductComponent
  ]
})
export class SharedModule { }
