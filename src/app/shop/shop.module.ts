import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShopRoutingModule } from './shop-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { BarRatingModule } from 'ngx-bar-rating';
import { RangeSliderModule  } from 'ngx-rangeslider-component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxImgZoomModule } from 'ngx-img-zoom';
import { DragScrollModule } from 'ngx-drag-scroll';

// home-eleven components
import { HomeElevenComponent } from './home-11/home-eleven.component';
import { SliderElevenComponent } from './home-11/slider/slider.component';
import { NewProductHomeComponent } from './home-11/new-product/new-product.component';
import { BestProductHomeComponent } from './home-11/best-product/best-product.component';
import { FeatureProductHomeComponent } from './home-11/feature-product/feature-product.component';
import { ServicesElevenComponent } from './home-11/services/services.component';
import { BlogElevenComponent } from './home-11/blog/blog.component';
import { InstagramElevenComponent } from './home-11/instagram/instagram.component';
import { LogoElevenComponent } from './home-11/logo/logo.component';
import { LogoDistributorComponent } from './home-11/distributor/distributor.component';

// Products Components
import { ProductComponent } from './product/product.component';
import { HomeProductComponent } from './home-11/product/product.component';
// import { ProductBoxComponent } from './product/product-box/product-box.component';
// import { ProductBoxHoverComponent } from './product/product-box-hover/product-box-hover.component';
// import { ProductBoxVerticalComponent } from './product/product-box-vertical/product-box-vertical.component';
import { ProductBoxMetroComponent } from './product/product-box-metro/product-box-metro.component';
import { CollectionLeftSidebarComponent } from './product/collection/collection-left-sidebar/collection-left-sidebar.component';
import { CollectionRightSidebarComponent } from './product/collection/collection-right-sidebar/collection-right-sidebar.component';
import { CollectionNoSidebarComponent } from './product/collection/collection-no-sidebar/collection-no-sidebar.component';
import { ColorComponent } from './product/collection/filter/color/color.component';
import { BrandComponent } from './product/collection/filter/brand/brand.component';
import { PriceComponent } from './product/collection/filter/price/price.component';
import { ProductLeftSidebarComponent } from './product/product-details/product-left-sidebar/product-left-sidebar.component';
import { ModalViewVoucherComponent } from './product/product-details/product-left-sidebar/modal-voucher/modal-voucher.component';
// import { ProductRightSidebarComponent } from './product/product-details/product-right-sidebar/product-right-sidebar.component';
// import { ProductNoSidebarComponent } from './product/product-details/product-no-sidebar/product-no-sidebar.component';
// import { ProductColLeftComponent } from './product/product-details/product-col-left/product-col-left.component';
// import { ProductColRightComponent } from './product/product-details/product-col-right/product-col-right.component';
// import { ProductColumnComponent } from './product/product-details/product-column/product-column.component';
// import { ProductAccordianComponent } from './product/product-details/product-accordian/product-accordian.component';
// import { ProductLeftImageComponent } from './product/product-details/product-left-image/product-left-image.component';
// import { ProductRightImageComponent } from './product/product-details/product-right-image/product-right-image.component';
// import { ProductVerticalTabComponent } from './product/product-details/product-vertical-tab/product-vertical-tab.component';
import { RelatedProductsComponent } from './product/product-details/related-products/related-products.component';
import { SidebarComponent } from './product/product-details/sidebar/sidebar.component';
import { CategoriesComponent } from './product/widgets/categories/categories.component';
import { QuickViewComponent } from './product/widgets/quick-view/quick-view.component';
import { ModalCartComponent } from './product/widgets/modal-cart/modal-cart.component';
import { NewProductComponent } from './product/widgets/new-product/new-product.component';
import { SearchComponent } from './product/search/search.component';
import { ProductCompareComponent } from './product/product-compare/product-compare.component';
import { WishlistComponent } from './product/wishlist/wishlist.component';
import { CartComponent } from './product/cart/cart.component';
import { ModalDeleteComponent } from './product/cart/widget/modal-delete/modal-delete.component';
import { CheckoutComponent } from './product/checkout/checkout.component';
import { ModalAddressComponent } from './product/checkout/widget/modal-address/modal-address.component';
import { ModalVoucherComponent } from './product/checkout/widget/modal-voucher/modal-voucher.component';
import { ModalPaymentComponent } from './product/checkout/widget/modal-payment/modal-payment.component';
import { ManualPayComponent } from './product/checkout/widget/modal-manual-pay/modal-manual-pay.component';
import { SuccessComponent } from './product/success/success.component';
import { ExitPopupComponent } from './product/widgets/exit-popup/exit-popup.component';
import { AgeVerificationComponent } from './product/widgets/age-verification/age-verification.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import {
  MatDialogModule
} from '@angular/material/dialog';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatInputModule
} from '@angular/material/input';

@NgModule({
  exports: [ExitPopupComponent, ProductComponent, HomeElevenComponent, QuickViewComponent],
  imports: [
    ScrollToModule.forRoot(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShopRoutingModule,
    SharedModule,
    SlickCarouselModule,
    BarRatingModule,
    RangeSliderModule,
    InfiniteScrollModule,
    NgxPayPalModule,
    NgxImgZoomModule,
    DragScrollModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule
  ],
  declarations: [
    // home eleven
    HomeElevenComponent,
    SliderElevenComponent,
    NewProductHomeComponent,
    BestProductHomeComponent,
    FeatureProductHomeComponent,
    ServicesElevenComponent,
    BlogElevenComponent,
    InstagramElevenComponent,
    LogoElevenComponent,
    LogoDistributorComponent,
    // Product
    ProductComponent,
    HomeProductComponent,
    // ProductBoxComponent,
    // ProductBoxHoverComponent,
    // ProductBoxVerticalComponent,
    ProductBoxMetroComponent,
    CollectionLeftSidebarComponent,
    CollectionRightSidebarComponent,
    CollectionNoSidebarComponent,
    ColorComponent,
    BrandComponent,
    PriceComponent,
    ProductLeftSidebarComponent,
    ModalViewVoucherComponent,
    // ProductRightSidebarComponent,
    // ProductNoSidebarComponent,
    // ProductColLeftComponent,
    // ProductColRightComponent,
    // ProductColumnComponent,
    // ProductAccordianComponent,
    // ProductLeftImageComponent,
    // ProductRightImageComponent,
    // ProductVerticalTabComponent,
    ModalDeleteComponent,
    RelatedProductsComponent,
    SidebarComponent,
    CategoriesComponent,
    QuickViewComponent,
    ModalCartComponent,
    NewProductComponent,
    SearchComponent,
    ProductCompareComponent,
    WishlistComponent,
    CartComponent,
    CheckoutComponent,
    ModalAddressComponent,
    ModalVoucherComponent,
    ModalPaymentComponent,
    ManualPayComponent,
    SuccessComponent,
    ExitPopupComponent,
    AgeVerificationComponent
  ],
  entryComponents: [
    ModalPaymentComponent,
    ManualPayComponent
  ]
})
export class ShopModule { }
