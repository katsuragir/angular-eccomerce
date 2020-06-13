import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { IsotopeModule } from 'ngx-isotope';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { FaqComponent } from './faq/faq.component';
import { TypographyComponent } from './typography/typography.component';
import { AuthNoticeComponent } from './auth-notice/auth-notice.component';
import { BiodataComponent } from './biodata/biodata.component';
import { CustomServiceComponent } from './custom-service/custom-service.component';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { ShopModule } from '../shop/shop.module';
import { SharedModule } from '../shared/shared.module';
import {NgxPrintModule} from 'ngx-print';
// account
import { OverallComponent } from './dashboard/account/overall/overall.component';
import { AddressComponent } from './dashboard/account/address/address.component';
import { OrdersComponent } from './dashboard/account/order/order.component';
import { OrdersListComponent } from './dashboard/account/order/order-list/order-list.component';
import { InvoicesComponent } from './dashboard/account/invoice/invoice.component';
import { ShippingComponent } from './dashboard/account/shipping/shipping.component';
import { AccountComponent } from './dashboard/account/account/account.component';
import { PasswordComponent } from './dashboard/account/password/password.component';
import { ModalInfoComponent } from './dashboard/account/widget/modal-info/modal-info.component';
import { ModalContactComponent } from './dashboard/account/widget/modal-contact/modal-contact.component';
import { ModalAddressComponent } from './dashboard/account/widget/modal-address/modal-address.component';
import { ModalConfirmComponent } from './dashboard/account/widget/modal-confirm/modal-confirm.component';
import { ModalCancelComponent } from './dashboard/account/widget/modal-cancel/modal-cancel.component';
import { ModalResiComponent } from './dashboard/account/widget/modal-resi/modal-resi.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import {
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FileUploadComponent } from './file-upload/file-upload.component';
import { ProgressComponent } from './progress/progress.component';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from '../shared/reducers/auth.reducers';
import { AuthEffects } from '../shared/effects/auth.effects';
import { AuthLoginService } from '../shared/services/auth.service';
import { AuthGuard } from '../shared/guards/auth.guard';
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DonasiCovidComponent } from './donasi-covid/donasi-covid.component';



let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('886033887264-c8j6dpjsrlsmivkscltucj10eoholjn6.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('Facebook-App-Id')
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  imports: [
    ScrollToModule.forRoot(),
    NgxSpinnerModule,
    NgxPaginationModule,
    NgxPrintModule,
    ShopModule,
    SharedModule,
    CommonModule,
    PagesRoutingModule,
    SlickCarouselModule,
    IsotopeModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    NgbModule,
    ShowHidePasswordModule,
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects]),
    SocialLoginModule,
    MatDialogModule
  ],
  declarations: [
    OverallComponent,
    AddressComponent,
    OrdersComponent,
    OrdersListComponent,
    ShippingComponent,
    InvoicesComponent,
    AccountComponent,
    PasswordComponent,
    AboutUsComponent,
    ErrorPageComponent,
    LookbookComponent,
    LoginComponent,
    RegisterComponent,
    SearchComponent,
    WishlistComponent,
    CartComponent,
    CollectionComponent,
    ForgetPasswordComponent,
    ChangePasswordComponent,
    ContactComponent,
    CheckoutComponent,
    CompareComponent,
    OrderSuccessComponent,
    DashboardComponent,
    InvoiceComponent,
    FaqComponent,
    TypographyComponent,
    AuthNoticeComponent,
    BiodataComponent,
    FileUploadComponent,
    ProgressComponent,
    CustomServiceComponent,
    ModalInfoComponent,
    ModalContactComponent,
    ModalAddressComponent,
    ModalConfirmComponent,
    ModalCancelComponent,
    TNCComponent,
    HTOComponent,
    PrivasiComponent,
    ModalResiComponent,
    DonasiCovidComponent
   // GridTwoColComponent,
   // GridThreeColComponent,
   // GridFourColComponent,
   // MasonaryTwoGridComponent,
   // MasonaryThreeGridComponent,
   // MasonaryFourGridComponent,
   // MasonaryFullwidthComponent
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
  ],
  entryComponents: [
    ModalResiComponent
  ]
})
export class PagesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PagesModule,
        providers: [
          AuthLoginService,
        AuthGuard,
        {
          provide: AuthServiceConfig,
          useFactory: provideConfig
        }
      ]
    };
  }
 }
