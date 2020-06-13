import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../../shared/classes/product';
import { CartItem } from '../../../shared/classes/cart-item';
import { ProductsService } from '../../../shared/services/products.service';
import { CartService } from '../../../shared/services/cart.service';
import { Observable, of, Subscription, interval } from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import { DomainURL } from '../../../shared/domainURL';
import { environment } from '../../../../environments/environment';
import { AuthLoginService } from '../../../shared/services/auth.service';
import { PaginationService } from '../../../shared/services/pagination.service';
import { ToastrService } from 'ngx-toastr';
import { Customer } from '../../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../shared/reducers';
import { currentUser } from '../../../shared/selectors/auth.selectors';
import { Login } from '../../../shared/actions/auth.actions';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  // public cartItems:   Observable<CartItem[]> = of([]);
  public products:   Product[] = [];
  public shoppingCartItems:   any[] = [];
  imgUrl: string = this.localUrl.domain;
  private akses: any;
  customer: Customer;
  paginate: any = {};
  page: number;
  returnURL: string;
  customer$: Observable<Customer>;
  private updateSubscription: Subscription;

  constructor(private productsService: ProductsService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private localUrl: DomainURL,
    private auth: AuthLoginService,
    private paginateService: PaginationService,
    private toastrService: ToastrService,
    private store: Store<AppState>) {
      const authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
      this.akses = localStorage.getItem(authTokenKey);
      this.returnURL = this.route.snapshot.queryParams['returnURL'] || '/home/cart';
      if (!this.akses) {
        this.router.navigate(['/pages/login'], { queryParams: { returnUrl: this.returnURL }});
      }
      /*
      this.auth.refreshNeeded$.subscribe(() => {
        this.refreshData();
      });
      this.customer$ = this.store.pipe(select(currentUser));
      this.customer$.subscribe(
        result => {
          this.customer = result;
          console.log(this.customer);
        }
      );
      this.customer$.subscribe(
        result => {
          // tslint:disable-next-line: max-line-length
          this.cartService.getItems(result.id_customer).subscribe(shoppingCartItems => {
            this.shoppingCartItems = shoppingCartItems;
            // console.log(this.shoppingCartItems);
            // this.setPage(1);
            // this.customer = this.shoppingCartItems[0].id_customer;
          });
        });
        */
       this.customer$ = this.store.pipe(select(currentUser));
   }

  ngOnInit() {
    this.auth.refreshNeeded$.subscribe(() => {
      this.refreshData();
    });
    this.auth.findAccount(this.akses).subscribe(
      result => {
        this.customer = result[0];
        // console.log(this.customer);
        // this.getCustomerAddress(result[0].id_city, result[0].id_district);
        this.updateSubscription = interval(1000).subscribe(
          () => {
          this.getAllCart(result[0].id_customer);
        });
       // console.log(result[0].id_customer);
       /*
        const data = {
          id_city: result[0].id_city,
          id_district: result[0].id_district
        };
        // console.log(data);
        this.shipping.getDistrictById(data.id_city, data.id_district).subscribe(
          res => {
            this.dist = res.result;
            // console.log(this.dist);
        });
        */
      }
    );
    this.customer$ = this.store.pipe(select(currentUser));
    this.customer$.subscribe(
      result => {
        this.customer = result;
        this.cartService.getItems(result.id_customer).subscribe(shoppingCartItems => {
          this.shoppingCartItems = shoppingCartItems;
          // console.log(this.shoppingCartItems);
        // console.log(this.customer);
          }
        );
    });
  }

  getAllCart(id) {
    this.cartService.getItems(id).subscribe(
      products => {
        this.shoppingCartItems = products;
        return this.ngOnDestroy();
    });
  }

  ngOnDestroy() {
    return this.updateSubscription.unsubscribe();
  }

  refreshData() {
    this.store.dispatch(new Login({authToken: this.customer.accessToken}));
  }

  public setPage(page: number) {
    this.page = page;
    // get paginate object from service
    this.paginate = this.paginateService.getPagerCart(this.shoppingCartItems.length, page);
    // get current page of items
    this.products = this.shoppingCartItems.slice(this.paginate.startIndex, this.paginate.endIndex + 1);
    //
  }

  // Increase Product Quantity
  public increment(id, stock, qty, quantity: number = 1, ) {
    if (qty === stock) {
      this.toastrService.error('You can not add more items than available. In stock ' + stock + ' items.');
      return;
    }
    // console.log(id, this.shoppingCartItems[0].id_customer);
    this.cartService.updateCartQuantityInc(id).subscribe( result => { this.updateQty(); } );
    /*
    const data = {
      product: id,
      qty: quantity,
      customer: customer
    };
    this.cartService.updateCartQuantity(data);
    */
  }

  updateQty() {
    this.cartService.getItems(this.shoppingCartItems[0].id_customer).subscribe(
      shoppingCartItems => {
        this.shoppingCartItems = shoppingCartItems;
      });
  }

  // Decrease Product Quantity
  public decrement(id, quantity: number = -1) {
    // console.log(this.shoppingCartItems[0].qty);
    this.cartService.updateCartQuantityDec(id).subscribe( result => { this.updateQty(); } );
  }

  // Get Total
  public getTotal(): Observable<number> {
    return this.shoppingCartItems[0].total;
  }

  // Remove cart items
  public removeItem(item: CartItem) {
    this.cartService.removeFromCart(item);
  }

  // Insert cart item
  saveCart(shoppingCartItems) {
    const fill = shoppingCartItems.filter( x => x.stock === 0 );

    if (fill.length > 0) {
      this.toastrService.error('Upss, There are empty products');
    } else {
      this.cartService.saveAddtoCart(shoppingCartItems);
      this.router.navigate(['/home/checkout']);
    }

  }

}
