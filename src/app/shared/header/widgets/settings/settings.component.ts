import { Component, OnInit, Input, Injectable, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CartItem } from '../../../../shared/classes/cart-item';
import { CartService } from '../../../../shared/services/cart.service';
import { ProductsService } from '../../../../shared/services/products.service';
import { Observable, of } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DomainURL } from '../../../../shared/domainURL';
import { AuthLoginService } from '../../../../shared/services/auth.service';
import { environment } from '../../../../../environments/environment';
import { CartModel } from '../../../../shared/classes/cart.models';
import { Customer } from '../../../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../shared/reducers';
import { currentUser } from '../../../../shared/selectors/auth.selectors';
import { Login } from '../../../../shared/actions/auth.actions';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-header-widgets',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {

  public searchForm: FormGroup;

  @Input() shoppingCartItems:   CartModel[] = [];

// tslint:disable-next-line: no-inferrable-types
  public show: boolean = false;
  imgUrl: string = this.localUrl.domain;
  private akses: any;
  private customer: number;
  customer$: Observable<Customer>;
  cust: Customer;

  constructor(
    private translate: TranslateService,
    private cartService: CartService,
    public productsService: ProductsService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localUrl: DomainURL,
    private auth: AuthLoginService,
    private store: Store<AppState>,
    private toastrService: ToastrService,
    ) {
      const authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
      this.akses = localStorage.getItem(authTokenKey);
      if (!this.akses) {
        return null;
      }
      /*
      this.auth.findAccount(this.akses).subscribe(
        result => {
          // tslint:disable-next-line: max-line-length
          this.cartService.getItems(result[0].id_customer).subscribe(shoppingCartItems => {
            this.shoppingCartItems = shoppingCartItems;
            // this.customer = this.shoppingCartItems[0].id_customer;
           //  console.log(this.shoppingCartItems[0].id_customer);
          });
        }
      );
      */
     }

  ngOnInit(): void {
    this.auth.refreshNeeded$.subscribe(() => {
      this.refreshData();
    });
    this.customer$ = this.store.pipe(select(currentUser));
    this.customer$.subscribe(
      result => {
        this.cust = result;
      }
    );
    /*
    if (this.akses) {
      this.auth.findAccount(this.akses).subscribe(
        result => {
          // tslint:disable-next-line: max-line-length
          this.cartService.getItems(result[0].id_customer).subscribe(shoppingCartItems => {
            this.shoppingCartItems = shoppingCartItems;
            // this.customer = this.shoppingCartItems[0].id_customer;
            // console.log(this.shoppingCartItems);
          });
        }
      );
    }
    */
    this.initForm();
   }

   refreshData() {
    this.store.dispatch(new Login({authToken: this.cust.accessToken}));
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
    return this.show = false;
  }

  public updateCurrency(curr) {
    this.productsService.currency = curr;
  }

  public changeLanguage(lang) {
    this.translate.use(lang);
  }

  public openSearch() {
    this.show = true;
  }

  gotoDashboard() {
    const params = 'order';
    this.router.navigate(['/pages/dashboard', params], { relativeTo: this.activatedRoute });
  }

  public closeSearch() {
    this.show = false;
  }

  public getTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }

  public removeItem(item: CartItem) {
    this.cartService.removeFromCart(item);
  }


  /**
   * Validation
   */
  valid(item) {
    const fill = item.filter( x => x.stock === 0 );

    if (fill.length > 0) {
      this.toastrService.error('Upss, There are empty products');
    } else {
      this.router.navigateByUrl('/home/checkout');
    }
  }

}
