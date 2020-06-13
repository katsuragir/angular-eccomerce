import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Services
import { WINDOW_PROVIDERS } from './services/windows.service';
import { LandingFixService } from '../shared/services/landing-fix.service';
import { InstagramService } from './services/instagram.service';
import { ProductsService } from './services/products.service';
import { BannersService } from './services/banner.service';
import { WishlistService } from './services/wishlist.service';
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';
import { PaginationService } from './classes/paginate';
import { AuthLoginService } from './services/auth.service';
import { InvoiceService } from './services/invoice.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthNoticeService } from './services/auth-notice.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Pipes
import { SafeResourceUrlPipe } from './pipes/safeResourceUrl.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';
import { FilterPipe } from './pipes/fillter.pipe';
import { SecurePipe } from './pipes/imgsecure.pipe';
// components
// import { HeaderOneComponent } from './header/header-one/header-one.component';
// import { HeaderTwoComponent } from './header/header-two/header-two.component';
// import { HeaderThreeComponent } from './header/header-three/header-three.component';
import { HeaderFourComponent } from './header/header-four/header-four.component';
// import { HeaderFiveComponent } from './header/header-five/header-five.component';
import { LeftSidebarComponent } from './header/left-sidebar/left-sidebar.component';
import { TopbarOneComponent } from './header/widgets/topbar/topbar-one/topbar-one.component';
import { TopbarTwoComponent } from './header/widgets/topbar/topbar-two/topbar-two.component';
import { TopbarThreeComponent } from './header/widgets/topbar/topbar-three/topbar-three.component';
import { ModalProfileComponent } from './header/widgets/account-profile/modal-profile.component';
import { NavbarComponent } from './header/widgets/navbar/navbar.component';
import { SettingsComponent } from './header/widgets/settings/settings.component';
import { LeftMenuComponent } from './header/widgets/left-menu/left-menu.component';
import { FooterOneComponent } from './footer/footer-one/footer-one.component';
import { FooterTwoComponent } from './footer/footer-two/footer-two.component';
import { FooterThreeComponent } from './footer/footer-three/footer-three.component';
import { FooterFourComponent } from './footer/footer-four/footer-four.component';
import { InformationComponent } from './footer/widgets/information/information.component';
import { CategoriesComponent } from './footer/widgets/categories/categories.component';
import { WhyWeChooseComponent } from './footer/widgets/why-we-choose/why-we-choose.component';
import { CopyrightComponent } from './footer/widgets/copyright/copyright.component';
import { SocialComponent } from './footer/widgets/social/social.component';
// angular material
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSliderModule} from '@angular/material/slider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';

//
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { InterceptService } from './services/interception.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  exports: [
    PerfectScrollbarModule,
    CommonModule,
    TranslateModule,
   // HeaderOneComponent,
   // HeaderTwoComponent,
   // HeaderThreeComponent,
    HeaderFourComponent,
   // HeaderFiveComponent,
    LeftSidebarComponent,
    FooterOneComponent,
    FooterTwoComponent,
    FooterThreeComponent,
    FooterFourComponent,
    OrderByPipe,
    SafeResourceUrlPipe,
    SecurePipe,
    ModalProfileComponent
  ],
  imports: [
    ShowHidePasswordModule,
    PerfectScrollbarModule,
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatSliderModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatInputModule,
    MatGridListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
  ],
  declarations: [
   // HeaderOneComponent,
   // HeaderTwoComponent,
   // HeaderThreeComponent,
    HeaderFourComponent,
   // HeaderFiveComponent,
    LeftSidebarComponent,
    FooterOneComponent,
    FooterTwoComponent,
    FooterThreeComponent,
    FooterFourComponent,
    OrderByPipe,
    SafeResourceUrlPipe,
    SecurePipe,
    FilterPipe,
    NavbarComponent,
    SettingsComponent,
    LeftMenuComponent,
    TopbarOneComponent,
    TopbarTwoComponent,
    TopbarThreeComponent,
    ModalProfileComponent,
    InformationComponent,
    CategoriesComponent,
    WhyWeChooseComponent,
    CopyrightComponent,
    SocialComponent,
  ],
  providers: [
    InvoiceService,
    WINDOW_PROVIDERS,
    LandingFixService,
    InstagramService,
    ProductsService,
    BannersService,
    WishlistService,
    CartService,
    OrderService,
    PaginationService,
    AuthLoginService,
    AuthGuard,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
  ]
})
export class SharedModule { }
