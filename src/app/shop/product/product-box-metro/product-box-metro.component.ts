import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../shared/classes/product';
import { CartItem } from '../../../shared/classes/cart-item';
import { ProductsService } from '../../../shared/services/products.service';
import { WishlistService } from '../../../shared/services/wishlist.service';
import { CartService } from '../../../shared/services/cart.service';
import { Observable, of } from 'rxjs';
import { DomainURL } from '../../../shared/domainURL';
import { environment } from '../../../../environments/environment';
import { AuthLoginService } from '../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-product-box-metro',
  templateUrl: './product-box-metro.component.html',
  styleUrls: ['./product-box-metro.component.scss']
})
export class ProductBoxMetroComponent implements OnInit {

  @Input() product: Product;
  imgUrl: string = this.localUrl.domain;
  private akses: any;
  private customer: any;

  constructor(private router: Router, public productsService: ProductsService,
    private wishlistService: WishlistService, private cartService: CartService,
    private localUrl: DomainURL, private auth: AuthLoginService,
    private toastrService: ToastrService) {
  }

  ngOnInit() {
    $.getScript('assets/js/masonary.js');
  }

   // Add to cart
   public addToCart(product: Product, quantity: number = 1) {
    const authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
    this.akses = localStorage.getItem(authTokenKey);
      if (!this.akses) {
        this.router.navigate(['/pages/login']);
      }
      this.auth.findAccount(this.akses).subscribe(
        result => {
          this.customer = result;
          const data = {
            id_product: product.id,
            harga: product.price,
            quantity: quantity,
            id_customer: result[0].id_customer
          };
          this.cartService.addToCart(data).subscribe();
          // this.setting.ngOnInit();
          this.toastrService.success('This product has been added.');
      });
  }

  // Add to compare
  public addToCompare(product: Product) {
     this.productsService.addToCompare(product);
  }

  // Add to wishlist
  public addToWishlist(product: Product) {
     this.wishlistService.addToWishlist(product);
  }

}
