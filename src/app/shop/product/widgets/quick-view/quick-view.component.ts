import { Component, OnInit, OnDestroy, Injectable, Input } from '@angular/core';
import { Product } from '../../../../shared/classes/product';
import { CartItem } from '../../../../shared/classes/cart-item';
import { ProductsService } from '../../../../shared/services/products.service';
import { CartService } from '../../../../shared/services/cart.service';
import { DomainURL } from '../../../../shared/domainURL';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { AuthLoginService } from '../../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { SettingService } from '../../../../shared/services/setting.service';
import { Customer } from '../../../../shared/classes/customer';
import { select, Store } from '@ngrx/store';
import { currentUser } from '../../../../shared/selectors/auth.selectors';
import { AppState } from '../../../../shared/reducers';
import { Login } from '../../../../shared/actions/auth.actions';
declare var $: any;

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.scss']
})
export class QuickViewComponent implements OnInit, OnDestroy {

  @Input() products:   Product[] = [];
  @Input() category: boolean;
  @Input() setup: any;
// tslint:disable-next-line: no-inferrable-types
  public counter:   number = 1;
  public variantImage:   any = '';
  public selectedColor:   any = '';
  public selectedSize:   any = '';
  imgUrl: string = this.localUrl.domain;
  private akses: any;
  private customer: any;
  private images: any;
  setting$: Observable<any>;
  customer$: Observable<Customer>;

  public id_product: number;

  constructor(private productsService: ProductsService, private route: Router, private auth: AuthLoginService,
    private toastrService: ToastrService, private settingService: SettingService, private store: Store<AppState>,
// tslint:disable-next-line: indent
  	private cartService: CartService, private localUrl: DomainURL) { this.setting$ = this.settingService.setting(); }

  ngOnInit() {
    this.auth.refreshNeeded$.subscribe(() => {
      this.refreshData();
    });
    this.customer$ = this.store.pipe(select(currentUser));
  }

  refreshData() {
    this.store.dispatch(new Login({authToken: this.customer.accessToken}));
  }

  getVariant(id) {
    this.productsService.getVariantImage(id).subscribe(image => {
      this.images = image;
      // console.log(this.images);
    });
  }

  ngOnDestroy() {
    $('.quickviewm').modal('hide');
  }

  public increment() {
      this.counter += 1;
  }

  public decrement() {
      if (this.counter > 1 ) {
          this.counter -= 1;
      }
  }
   // Change variant images
  public changeVariantImage(image) {
     this.variantImage = image;
     this.selectedColor = image;
  }

  // Change variant
  public changeVariantSize(variant) {
     this.selectedSize = variant;
  }

  // Add to cart
  public addToCart(product: Product, quantity) {
    if (product.stock <= 0) {
      return;
    }
    if (product.stock < quantity) {
      this.toastrService.error('Not Enough Stock');
      return;
    }
    // tslint:disable-next-line: curly
    // console.log(product);
    // tslint:disable-next-line: curly
    if (quantity === 0) return false;
    const authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
    this.akses = localStorage.getItem(authTokenKey);
      if (!this.akses) {
        this.route.navigate(['/pages/login']);
      }
      this.customer$.subscribe(
        result => {
          this.customer = result;
          const data = {
            id_product: product.id,
            harga: product.price,
            quantity: quantity,
            id_customer: result.id_customer
          };
          this.cartService.addToCart(data).subscribe();
          this.ngOnDestroy();
      });
  }

}
