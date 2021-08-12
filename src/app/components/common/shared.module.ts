import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailabilityStatusPopupComponent } from './availability-status-popup/availability-status-popup.component';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';
import { LoaderComponent } from './loader/loader.component';
import { SchoolAvailabilityComponent } from './school-availability/school-availability.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ArticleCardComponent } from './article-card/article-card.component';

// import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AvailabilityStatusPopupComponent,
    ConfirmationPopupComponent,
    CustomSnackbarComponent,
    LoaderComponent,
    SchoolAvailabilityComponent,
    NavBarComponent,
    ArticleCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // MatIconModule
  ],
  exports: [
    AvailabilityStatusPopupComponent,
    ConfirmationPopupComponent,
    CustomSnackbarComponent,
    LoaderComponent,
    SchoolAvailabilityComponent,
    NavBarComponent,
    ArticleCardComponent
  ]
})
export class SharedModule { }
