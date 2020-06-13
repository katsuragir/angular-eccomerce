import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutUsComponent } from './about-us/about-us.component';
import { TNCComponent } from './tnc/tnc.component';
import { HTOComponent } from './how-to-order/how-to-order.component';
import { PrivasiComponent } from './privasi/privasi.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { LookbookComponent } from './lookbook/lookbook.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CartComponent } from './cart/cart.component';
import { CollectionComponent } from './collection/collection.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ChangePasswordComponent } from './forget-password/change-password/change-password.component';
import { ContactComponent } from './contact/contact.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CompareComponent } from './compare/compare.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { TypographyComponent } from './typography/typography.component';
import { FaqComponent } from './faq/faq.component';
import { BiodataComponent } from './biodata/biodata.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { CustomServiceComponent } from './custom-service/custom-service.component';
import { DonasiCovidComponent } from './donasi-covid/donasi-covid.component';
// Portfolio Page
/*
import { GridTwoColComponent } from './portfolio/grid-two-col/grid-two-col.component';
import { GridThreeColComponent } from './portfolio/grid-three-col/grid-three-col.component';
import { GridFourColComponent } from './portfolio/grid-four-col/grid-four-col.component';
import { MasonaryTwoGridComponent } from './portfolio/masonary-two-grid/masonary-two-grid.component';
import { MasonaryThreeGridComponent } from './portfolio/masonary-three-grid/masonary-three-grid.component';
import { MasonaryFourGridComponent } from './portfolio/masonary-four-grid/masonary-four-grid.component';
import { MasonaryFullwidthComponent } from './portfolio/masonary-fullwidth/masonary-fullwidth.component';
*/

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'about-us',
        component: AboutUsComponent
      },
      {
        path: '404',
        component: ErrorPageComponent
      },
      /*
      {
        path: 'lookbook',
        component: LookbookComponent
      },
      */
      {
        path: 'login/:id',
        component: LoginComponent,

      },
      {
        path: 'login',
        component: LoginComponent,

      },
      /*
      {
        path: 'register/:id',
        component: BiodataComponent
      },
      */
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'search',
        component: SearchComponent
      },
      {
        path: 'search/:id',
        component: SearchComponent
      },
      /*
      {
        path: 'wishlist',
        component: WishlistComponent
      },
      */
      {
        path: 'cart',
        component: CartComponent
      },
      {
        path: 'collection',
        component: CollectionComponent
      },
      {
        path: 'forgetpassword',
        component: ForgetPasswordComponent
      },
      {
        path: 'changepassword/:id',
        component: ChangePasswordComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'checkout',
        canActivate: [AuthGuard],
        component: CheckoutComponent,
      },
      /*
      {
        path: 'compare',
        component: CompareComponent
      },

      {
        path: 'order-success',
        component: OrderSuccessComponent
      },
      */
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        component: DashboardComponent
      },
      {
        path: 'dashboard/:id',
        canActivate: [AuthGuard],
        component: DashboardComponent
      },
      {
        path: 'invoice/:id',
        canActivate: [AuthGuard],
        component: InvoiceComponent
      },
      /*
      {
        path: 'typography',
        component: TypographyComponent
      },
      */
      {
        path: 'faq',
        component: FaqComponent
      },
      {
        path: 'customerservice',
        component: CustomServiceComponent
      },
      /*
      {
        path: 'grid/two/column',
        component: GridTwoColComponent
      },
      {
        path: 'grid/three/column',
        component: GridThreeColComponent
      },
      {
        path: 'grid/four/column',
        component: GridFourColComponent
      },
      {
        path: 'grid/two/masonary',
        component: MasonaryTwoGridComponent
      },
      {
        path: 'grid/three/masonary',
        component: MasonaryThreeGridComponent
      },
      {
        path: 'grid/four/masonary',
        component: MasonaryFourGridComponent
      },
      {
        path: 'fullwidth/masonary',
        component: MasonaryFullwidthComponent
      }
      */
     {
       path: 'terms-and-condition',
       component: TNCComponent
     },
     {
       path: 'how-to-order',
       component: HTOComponent
     },
     {
       path: 'privacy-policy',
       component: PrivasiComponent
     }
    ]
  },
  {
    path: '**',
    redirectTo: 'pages/404'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
