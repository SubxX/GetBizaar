import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetUpMarketplaceComponent } from './components/marketplace/set-up-marketplace/set-up-marketplace.component';
import { HomeComponent } from './components/marketplace/home/home.component';
import { AddPostComponent } from './components/marketplace-root/add-post/add-post.component';
import { YourSalesRentalComponent } from './components/marketplace-root/your-sales-rental/your-sales-rental.component';
import { YourPurchasesComponent } from './components/marketplace-root/your-purchases/your-purchases.component';
import { YourPostsComponent } from './components/marketplace-root/your-posts/your-posts.component';
import { AuditLogComponent } from './components/marketplace-root/audit-log/audit-log.component';
import { MarketplaceComponent } from './components/marketplace-root/marketplace/marketplace.component';
import { AccessMarketPlaceComponent } from './components/marketplace/access-market-place/access-market-place.component';
import { YourAccountComponent } from './components/marketplace-root/your-account/your-account.component';
import { ConnectPaymentMethodComponent } from './components/marketplace/connect-payment-method/connect-payment-method.component';
import { SecurityComponent } from './components/marketplace/security/security.component';
import {MarketplaceRootComponent} from './components/marketplace-root/marketplace-root.component';
import {AuthGuardGuard} from './route-guards/auth-guard/auth-guard.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'setup-market-place', component: SetUpMarketplaceComponent },
  { path: 'access-marketplace', component: AccessMarketPlaceComponent },
  { path: 'security', component: SecurityComponent },
  { path: 'signup', component: ConnectPaymentMethodComponent },

  {path:'marketplace',component:MarketplaceRootComponent,children:[
    { path: '', component: MarketplaceComponent },
    { path: 'add-post', component: AddPostComponent },
    { path: 'your-posts', component: YourPostsComponent },
    { path: 'your-purchases', component: YourPurchasesComponent },
    { path: 'your-sales', component: YourSalesRentalComponent },
    { path: 'your-account', component: YourAccountComponent },
    { path: 'audit-log', component: AuditLogComponent }
  ],canActivate:[AuthGuardGuard]},

  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    scrollPositionRestoration:'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
