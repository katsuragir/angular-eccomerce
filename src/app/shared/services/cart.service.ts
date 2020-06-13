import { Injectable } from '@angular/core';
import { Product } from '../classes/product';
import { CartItem } from '../classes/cart-item';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscriber, Subject } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomainURL } from '../domainURL';
import { CartModel } from '../classes/cart.models';
import { find } from 'lodash';

// Get product from Localstorage
// const products = JSON.parse(localStorage.getItem('cartItem')) || [];
const products = JSON.parse(localStorage.getItem('cartItem')) || [];

@Injectable({
  providedIn: 'root'
})

export class CartService {

  // Array
  public cartItems:  BehaviorSubject<CartModel[]> = new BehaviorSubject([]);
  public observer:  Subscriber<{}>;
  id_prod: number;

  constructor(private toastrService: ToastrService, private http: HttpClient, private localUrl: DomainURL) {
      // tslint:disable-next-line:no-shadowed-variable
      this.getItems(this.id_prod).subscribe(products => products = products);
  }

  private _refreshNeed$ = new Subject<void>();

  get refreshNeed() {
    return this._refreshNeed$;
  }

  public getItemLocal(): Observable<CartModel[]> {
    const itemsStream = new Observable(observer => {
      observer.next(products);
      observer.complete();
    });
    return <Observable<CartModel[]>>itemsStream;
  }

  public TransferItem(id) {
   return this.getItems(id).subscribe(
      result => {
        if (result.length < 0) {
          console.log('nihil');
        }
        products.push(result);
        localStorage.setItem('cartItem', JSON.stringify(products));
      }
    );
    // localStorage.setItem('cartItem', JSON.stringify(products));
  }

  public getcCarts(id): Observable<CartModel[]> {
    this.id_prod = id;
    // console.log(id);
    const url = this.localUrl.domain + `/api/order/cart/getCartCust/${id}`; // ubah url
    return this.http.get<CartModel[]>(url);
  }

  // Get Products
  public getItems(id): Observable<CartModel[]> {
    this.id_prod = id;
    // console.log(id);
    const url = this.localUrl.domain + `/api/order/cart/getCart/${id}`; // ubah url
    return this.http.get<CartModel[]>(url);
  }

  // Get cart
  getCarts(id) {
    this.id_prod = id;
    // console.log(id);
    const url = this.localUrl.domain + `/api/order/cart/getCart/${id}`; // ubah url
    return this.http.get(url);
  }

  public updateCartItem(id): Observable<CartModel[]> {
    this.id_prod = id;
    // console.log(id);
    const url = this.localUrl.domain + `/api/order/cart/getCart/${id}`; // ubah url
    return this.http.get<CartModel[]>(url).pipe(
      tap(() => {
        this._refreshNeed$.next();
      })
    );
  }

  public saveCart(data) {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    const url = this.localUrl.domain + `/api/order/cart/createCart`; // ubah url
    return this.http.post(url, data, { headers: httpHeaders })
    .pipe(
      tap(() => {
        this._refreshNeed$.next();
      })
    );
  }

  // Add to cart
  public addToCart(data) {
    // console.log(data.id_customer);
    return this.getItems(data.id_customer).pipe(
      map((result: CartModel[]) => {
        // console.log(result);
        if (result.length <= 0) {
          return this.saveCart(data).subscribe(
            () => {
              this.toastrService.success('This product has been added.');
              }
          );
        }
        const cart = find(result, function(item: CartModel) {
          return (item.id_product === data.id_product);
        });

        // console.log(cart);
        if (cart) {
          if (cart.qty === cart.stock) {
            this.toastrService.error('You can not add more items than available. In stock ' + cart.stock + ' items.');
            return;
          }
          return this.updateCartQuantityInc(cart.id).subscribe(
            () => {
              this.toastrService.success('This product has been added.');
              }
          );
        } else {
          return this.saveCart(data).subscribe(
            () => {
            this.toastrService.success('This product has been added.');
            }
          );
        }
        /*
        // console.log(cart);
        if (cart) {
          // console.log(cart);
          return this.updateCartQuantityInc(cart.id).subscribe();
        }
        */

        return cart;
      })
    );
  }

  // Update Cart Value
  public updateCartQuantityInc(id) {
    const url = this.localUrl.domain + `/api/order/cart/updateqtyCartinc/${id}`; // ubah url
    return this.http.get(url)
    .pipe(
      tap(() => {
        this._refreshNeed$.next();
      })
    );
  }

  public updateCartQuantityDec(id) {
    const url = this.localUrl.domain + `/api/order/cart/updateqtyCartdec/${id}`; // ubah url
    return this.http.get(url)
    .pipe(
      tap(() => {
        this._refreshNeed$.next();
      })
    );
  }

  // Calculate Product stock Counts
  public calculateStockCounts(product: CartItem, quantity): CartItem | Boolean {
    const qty   = product.quantity + quantity;
    const stock = product.product.stock;
    if (stock < qty) {
      this.toastrService.error('You can not add more items than available. In stock ' + stock + ' items.');
      return false;
    }
    return true;
  }

  // Removed in cart
  public removeFromCart(id): Observable<any> {
    const url = this.localUrl.domain + `/api/order/cart/deleteCart/${id}`; // ubah url
    return this.http.delete<any>(url)
    .pipe(
      tap(() => {
        this._refreshNeed$.next();
      })
    );
  }

  // destroy cart
  public destroyFromCart() {
    localStorage.removeItem('cartItem');
  }

  // Total amount
  public getTotalAmount(): Observable<number> {
    return;
    /*
    return this.cartItems.pipe(map((product: CartItem[]) => {
      return products.reduce((prev, curr: CartItem) => {
        return prev + curr.product.price * curr.quantity;
      }, 0);
    }));
    */
  }

  // total weight
  public getTotalWeight(): Observable<number> {
    return;
    /*
    return this.cartItems.pipe(map((product: CartItem[]) => {
      return products.reduce((prev, curr: CartItem) => {
        return prev + curr.product.weight * curr.quantity;
      }, 0);
    }));
    */
  }

  // add to database
  public saveAddtoCart(item): Observable<CartItem> {
    const url = this.localUrl.domain + '/api/order/cart/';
    return this.http.post<CartItem>(url, item);
  }


}
