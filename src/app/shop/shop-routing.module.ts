import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeElevenComponent } from './home-11/home-eleven.component';

import { CollectionLeftSidebarComponent } from './product/collection/collection-left-sidebar/collection-left-sidebar.component';
import { CollectionRightSidebarComponent } from './product/collection/collection-right-sidebar/collection-right-sidebar.component';
import { CollectionNoSidebarComponent } from './product/collection/collection-no-sidebar/collection-no-sidebar.component';
import { ProductLeftSidebarComponent } from './product/product-details/product-left-sidebar/product-left-sidebar.component';
// import { ProductRightSidebarComponent } from './product/product-details/product-right-sidebar/product-right-sidebar.component';
// import { ProductNoSidebarComponent } from './product/product-details/product-no-sidebar/product-no-sidebar.component';
// import { ProductColLeftComponent } from './product/product-details/product-col-left/product-col-left.component';
// import { ProductColRightComponent } from './product/product-details/product-col-right/product-col-right.component';
// import { ProductColumnComponent } from './product/product-details/product-column/product-column.component';
// import { ProductAccordianComponent } from './product/product-details/product-accordian/product-accordian.component';
// import { ProductLeftImageComponent } from './product/product-details/product-left-image/product-left-image.component';
// import { ProductRightImageComponent } from './product/product-details/product-right-image/product-right-image.component';
// import { ProductVerticalTabComponent } from './product/product-details/product-vertical-tab/product-vertical-tab.component';
import { SearchComponent } from './product/search/search.component';
import { WishlistComponent } from './product/wishlist/wishlist.component';
import { ProductCompareComponent } from './product/product-compare/product-compare.component';
import { CartComponent } from './product/cart/cart.component';
import { CheckoutComponent } from './product/checkout/checkout.component';
import { SuccessComponent } from './product/success/success.component';
import { AuthGuard } from '../shared/guards/auth.guard';


// Routes
const routes: Routes = [
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: 'vapehan/:id',
    component: HomeElevenComponent
  },
  {
    path: 'product/collection',
    component: CollectionLeftSidebarComponent
  },
  {
    path: 'product/collection/:id',
    component: CollectionLeftSidebarComponent
  },
  /*
  {
    path: 'right-sidebar/collection/:category',
    component: CollectionRightSidebarComponent
  },

  {
    path: 'product/brand',
    component: CollectionNoSidebarComponent
  },

  {
    path: 'product/brand/:id',
    component: CollectionNoSidebarComponent
  },
  */
  {
    path: 'product/:id',
    component: ProductLeftSidebarComponent
  },
  // {
    // path: 'right-sidebar/product/:id',
    // component: ProductRightSidebarComponent
  // },
  // {
   // path: 'no-sidebar/product/:id',
    // component: ProductNoSidebarComponent
  // },
  // {
    // path: 'col-left/product/:id',
    // component: ProductColLeftComponent
  // },
  // {
    // path: 'col-right/product/:id',
    // component: ProductColRightComponent
  // },
  // {
   // path: 'column/product/:id',
   // component: ProductColumnComponent
  // },
  // {
   // path: 'accordian/product/:id',
   // component: ProductAccordianComponent
  // },
  // {
    // path: 'left-image/product/:id',
    // component: ProductLeftImageComponent
  // },
  // {
   //  path: 'right-image/product/:id',
   //  component: ProductRightImageComponent
  // },
  // {
   // path: 'vertical/product/:id',
    // component: ProductVerticalTabComponent
  // },
  /*
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'wishlist',
    component: WishlistComponent
  },
  {
    path: 'compare',
    component: ProductCompareComponent
  },
  */
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'checkout',
    canActivate: [AuthGuard],
    component: CheckoutComponent
  },
  {
    path: 'checkout/success/:id',
    component: SuccessComponent
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
export class ShopRoutingModule { }
