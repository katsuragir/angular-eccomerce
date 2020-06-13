import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../shared/classes/product';
import { CartItem } from '../../shared/classes/cart-item';
import { ProductsService } from '../../shared/services/products.service';
import { WishlistService } from '../../shared/services/wishlist.service';
import { CartService } from '../../shared/services/cart.service';
import { Observable, of } from 'rxjs';
import { DomainURL } from '../../shared/domainURL';
import { environment } from '../../../environments/environment';
import { AuthLoginService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TopbarTwoComponent } from '../../shared/header/widgets/topbar/topbar-two/topbar-two.component';
import { SettingsComponent } from '../../shared/header/widgets/settings/settings.component';
import { QuickViewComponent } from './widgets/quick-view/quick-view.component';
import { Customer } from '../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../shared/reducers';
import { currentUser } from '../../shared/selectors/auth.selectors';
import { Login } from '../../shared/actions/auth.actions';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductComponent implements OnInit {

  @Input() product: Product;
  @Input() category: boolean;
  @Input() setup: any;

  public variantImage:  any = '';
  public selectedItem:  any = '';
  imgUrl: string = this.localUrl.domain;
  private akses: any;
  private customer: any;
  customer$: Observable<Customer>;



  constructor(private router: Router, public productsService: ProductsService, private store: Store<AppState>,
    private wishlistService: WishlistService, private cartService: CartService,
    private localUrl: DomainURL, private route: Router, private auth: AuthLoginService,
    private toastrService: ToastrService, private topBar: TopbarTwoComponent, private setting: SettingsComponent,
    private quickView: QuickViewComponent
    ) {  }

  ngOnInit() {
    // console.log(this.setup);
    this.auth.refreshNeeded$.subscribe(() => {
      this.refreshData();
    });
    this.customer$ = this.store.pipe(select(currentUser));
    this.customer$.subscribe(
      res => {
        this.customer = res;
        // console.log(this.customer);
      }
    );
  }

  refreshData() {
    this.store.dispatch(new Login({authToken: this.customer.accessToken}));
  }

  // Add to cart
  public addToCart(product: Product, quantity: number = 1) {
    if (product.stock <= 0) {
      return;
    }
    if (product.stock < quantity) {
      this.toastrService.error('Not Enough Stock');
      return;
    }
    const authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
    this.akses = localStorage.getItem(authTokenKey);
      if (!this.akses) {
        this.route.navigate(['/pages/login']);
      } else {
      this.topBar.ngOnInit();
      this.customer$ = this.store.pipe(select(currentUser));
      this.customer$.subscribe(
        result => {
          this.customer = result;
          let harga: number;
          if (product.discount) {
            harga = product.harga_disc;
          } else {
            harga = product.price;
          }
          const data = {
            id_product: product.id,
            harga: harga,
            quantity: quantity,
            id_customer: result.id_customer
          };
          // sconsole.log(data);
          this.cartService.addToCart(data).subscribe();
          // this.topBar.ngOnInit();
          // this.setting.ngOnInit();

      });
    }
  }

  getIdProduct(id: string) {
    const id_product: string = id;
    // console.log(id_product);
    this.quickView.getVariant(id_product);
  }

  // Add to compare
  public addToCompare(product: Product) {
     this.productsService.addToCompare(product);
  }

  // Add to wishlist
  public addToWishlist(product: Product) {
     this.wishlistService.addToWishlist(product);
  }

 // Change variant images
  public changeVariantImage(image) {
     this.variantImage = image;
     this.selectedItem = image;
  }

  categoryUrl(slug): void {
    // console.log(slug);
    this.productsService.parameterCategory(true);
    this.router.navigate(['/home/product', slug]);
    this.toTop();
  }

  toTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

}
