
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../../../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../shared/reducers';
import { currentUser } from '../../../../../shared/selectors/auth.selectors';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthLoginService } from '../../../../../shared/services/auth.service';
import { DatePipe } from '@angular/common';
import { OrderService } from '../../../../../shared/services/order.service';
import { ProductsService } from '../../../../../shared/services/products.service';
import { DomainURL } from '../../../../../shared/domainURL';
import { CartService } from '../../../../../shared/services/cart.service';
import { CartComponent } from '../../cart.component';

declare var $: any;

@Component({
  selector: 'app-delete-cart',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.scss'],
  providers: [ DatePipe ]
})
export class ModalDeleteComponent implements OnInit, OnDestroy {

  loading = false;
  message: any = [];
  @Input() product: any;
  imgUrl: string = this.localUrl.domain;


// tslint:disable-next-line: no-inferrable-types
  public counter:   number = 1;
  public variantImage:   any = '';
  public selectedColor:   any = '';
  public selectedSize:   any = '';

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private cartService: CartService,
    private productsService: ProductsService,
    private localUrl: DomainURL,
    private cart: CartComponent
  ) {  }

  ngOnInit() {
    // console.log(this.product);
    // this.getProduct().subscribe(products => this.product = products);
    // this.total = this.product.total;
    // this.qty = this.product.sumqty;
    // console.log(this.product);
    // console.log(this.total, this.qty);
  }




  ngOnDestroy() {
    $('.quickviewm').modal('hide');
  }

  /**
   * submit form
   */
  submit(product) {
    // console.log(id);
    this.cartService.removeFromCart(product).subscribe(
      result => {
        this.message = result;
        this.cart.ngOnInit();
        this.ngOnDestroy();
      }
    );

  }

}
