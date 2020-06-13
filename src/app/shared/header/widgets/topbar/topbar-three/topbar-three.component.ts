import { Component, Inject, HostListener, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Injectable } from '@angular/core';
import { LandingFixService } from '../../../../services/landing-fix.service';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../../../../services/windows.service';
import { CartItem } from '../../../../classes/cart-item';
import { CartService } from '../../../../services/cart.service';
import { Observable, of, Subscription, interval } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { Logout, Login } from '../../../../actions/auth.actions';
import { AuthLoginService } from '../../../../services/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CartModel } from '../../../../classes/cart.models';
import { SettingService } from '../../../../../shared/services/setting.service';
import { AuthService } from 'angularx-social-login';
import { Customer } from '../../../../../shared/classes/customer';
import { currentUser } from '../../../../../shared/selectors/auth.selectors';

declare var $: any;

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-topbar-three',
  templateUrl: './topbar-three.component.html',
  styleUrls: ['./topbar-three.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarThreeComponent implements OnInit {

  public shoppingCartItems:   CartModel[] = [];
  public searchForm: FormGroup;
  private akses: any;
  private key: any;
  private accesskey: any;
  setting$: Observable<any>;
  customer$: Observable<Customer>;
  private customer: any;

  login: boolean;
  loadData = false;
  private updateSubscription: Subscription;
  private updateSub: Subscription;
  authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';

  constructor(@Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window, private fix: LandingFixService, private cartService: CartService,
    private store: Store<AppState>, private auth: AuthLoginService, private router: Router, private activatedRoute: ActivatedRoute,
    private fb: FormBuilder, private settingService: SettingService, private authService: AuthService) {
      this.setting$ = this.settingService.setting();
      this.akses = localStorage.getItem(this.authTokenKey);
      // console.log(this.akses);
      this.auth.isLoggedIn.subscribe( value => {
      this.login = value;
    });
  }

  ngOnInit() {
    this.auth.refreshNeeded$.subscribe(() => {
      this.refreshData();
    });
    this.customer$ = this.store.pipe(select(currentUser));
    this.initForm();
    this.updateCartLogin();
    // this.updateSubscription = interval(1000).subscribe(
      // () => {
        if (!this.loadData) {
          this.loadData = false;
          this.key = localStorage.getItem(this.authTokenKey);
          // console.log(this.akses);
          this.cartService.refreshNeed.subscribe(() => {
            this.key = localStorage.getItem(this.authTokenKey);
            // console.log(this.key);
            this.getAllCartOff(this.key);
          });
          this.getAllCartOff(this.key);
          return this.loadData = false;
        }
        // console.log(this.login);
      // }
    // );
   }

  refreshData() {
    this.store.dispatch(new Login({authToken: this.customer.accessToken}));
  }

   updateCartLogin() {
    // console.log(this.loadData);
    this.loadData = true;
    if (this.loadData) {
      this.updateSubscription = interval(3000).subscribe(
        () => {
          this.key = localStorage.getItem(this.authTokenKey);
          // console.log(this.akses);
          this.cartService.refreshNeed.subscribe(() => {
            this.key = localStorage.getItem(this.authTokenKey);
            // console.log(this.key);
            this.loadData = true;
            this.getAllCart(this.key);
          });
          this.getAllCart(this.key);
          // console.log(this.loadData);
        }
      );
    } else {
      return this.getAllCartOff(this.akses);
    }
   }

   // tslint:disable-next-line: use-life-cycle-interface
   ngOnDestroy() {
    this.updateSubscription.unsubscribe();
    return this.loadData = false;
  }
   private getAllCart(key) {
    if (key) {
      // this.login = true;
      // console.log(this.login);
      // this.loadData = true;
      // this.router.navigate(['/pages/login']);
      this.customer$.subscribe(
        result => {
          if (!result) {
            return null;
          }
          this.cartService.getItems(result.id_customer).subscribe(shoppingCartItems =>
            // tslint:disable-next-line: one-line
            {
              this.shoppingCartItems = shoppingCartItems;
              this.loadData = false;
              return this.ngOnDestroy();
            }
          );
        }
      );
    } else {
      return this.shoppingCartItems = [];
    }
   }

   private getAllCartOff(key) {
    this.loadData = false;
    if (key) {
      // this.login = true;
      // console.log(this.login);
      // this.loadData = true;
      // this.router.navigate(['/pages/login']);
      this.customer$.subscribe(
        result => {
          if (!result) {
            return null;
          }
          this.cartService.getItems(result.id_customer).subscribe(shoppingCartItems =>
            // tslint:disable-next-line: one-line
            {
              this.shoppingCartItems = shoppingCartItems;
              // return this.ngOnDestroy();
            }
          );
        }
      );
    } else {
      return this.shoppingCartItems = [];
    }
   }

   public logoutCart() {
    // console.log('hello');
    this.updateSubscription = interval(100).subscribe(
      () => {
        this.key = localStorage.getItem(this.authTokenKey);
        // console.log(this.akses);
        this.cartService.refreshNeed.subscribe(() => {
          this.key = localStorage.getItem(this.authTokenKey);
          // console.log(this.key);
          this.loadData = true;
          this.getAllCart(this.key);
        });
        this.getAllCart(this.key);
      }
      );
    }

   public destroyAllCart() {
    this.updateSubscription = interval(100).subscribe(
      () => {
        this.cartService.refreshNeed.subscribe(() => {
          this.loadData = true;
          this.CartNull();
        });
        this.CartNull();
      }
      );
   }

   private CartNull() {
    if (this.loadData) {
      return this.shoppingCartItems = [];
    }
    // return this.ngOnDestroy();
   }

   initForm() {
    this.searchForm = this.fb.group({
      search: ['', Validators.required]
    });
   }

  submit() {
    const controls = this.searchForm.controls;

    // check form
    if (this.searchForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
        );
      return;
    }

    this.router.navigate(['/pages/search', controls['search'].value], { relativeTo: this.activatedRoute });
  }

  openNav() {
    this.fix.addNavFix();
  }

  gotoDashboard() {
    const params = 'order';
    this.router.navigate(['/pages/dashboard', params], { relativeTo: this.activatedRoute });
  }

  /**
	 * Log out
	 */
  logout() {
    this.store.dispatch(new Logout());
    this.authService.signOut();
    localStorage.removeItem('google');
    this.logoutCart();
  }

}
