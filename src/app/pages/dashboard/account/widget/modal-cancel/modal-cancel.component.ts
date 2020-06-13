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
import { OrdersListComponent } from '../../order/order-list/order-list.component';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-cancel-transaction',
  templateUrl: './modal-cancel.component.html',
  styleUrls: ['./modal-cancel.component.scss'],
  providers: [ DatePipe ]
})
export class ModalCancelComponent implements OnInit, OnDestroy {

  loading = false;
  message: any = [];
  @Input() order: any;
  @Input() product: any[] = [];
  @Input() total: any;
  @Input() sumqty: any;
  @Input() stotal: any;
  @Input() weight: any;
  @Input() ongkir: any;
  @Input() parameter: number;
  imgUrl: string = this.localUrl.domain;
  cancelPayment: FormGroup;
  submitted = false;
  public pay = '';
  public check: any[] = [];


// tslint:disable-next-line: no-inferrable-types
  public counter:   number = 1;
  public variantImage:   any = '';
  public selectedColor:   any = '';
  public selectedSize:   any = '';

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private orderService: OrderService,
    private productsService: ProductsService,
    private localUrl: DomainURL,
    private orderComponent: OrdersListComponent,
    private toastService: ToastrService
  ) { }

  ngOnInit() {
    // this.getProduct().subscribe(products => this.product = products);
    // this.total = this.product.total;
    // this.qty = this.product.sumqty;
    // console.log(this.product);
    // console.log(this.total, this.qty);
    if (this.order.resiid && this.parameter === 2 && this.order.statResi === 'On Process') {
      const resi = {
        resi: this.order.resiid,
        courier: this.order.courier
      };
      this.orderService.checkResi(resi).subscribe(
        result => {
          // console.log(result);
          if (!result || result.rajaongkir.status.code === 400) {
             this.check = [];
             return;
          } else {
            this.check = result.rajaongkir.result.manifest;
            // console.log(this.check);
            if (result.rajaongkir.result.delivery_status.status === 'DELIVERED') {
              const data = {
                id_order: this.order.id_order,
                status: 1,
                delivery_at: result.rajaongkir.result.delivery_status
              };
              this.delvery(data);
            } else {
              return;
            }
          }
        }
      );
    }
    this.initaccountForm();
    const unique = '1234567890';
    const lengthOfUnique = 8;
    if (!this.pay) {
      this.makeUnique(lengthOfUnique, unique);
    }
  }

  delvery(data) {
    this.orderService.updateResi(data).subscribe(
      res => {
        console.log(res);
        this.orderComponent.ngOnInit();
      }
    );
  }

  makeUnique(lengthOfUnique: number, unique: string) {
    for (let i = 0; i < lengthOfUnique; i++) {
      this.pay += unique.charAt(Math.floor(Math.random() * unique.length));
    }
    // console.log(this.pay);
    return this.pay;
  }

  public getProduct(): Observable<any> {
    return this.orderService.getProduct(this.order.id_order);
  }

  initaccountForm() {
    this.cancelPayment = this.fb.group({
      reason: ['', [
        Validators.required,
        ]
      ],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.cancelPayment.controls; }


  ngOnDestroy() {
    $('.quickviewm').modal('hide');
    // location.reload();
  }

  /**
   * submit form
   */
  submit(order) {
    this.submitted = true;
    const controls = this.cancelPayment.controls;
    // stop here if form is invalid
    if (this.cancelPayment.invalid) {
      // console.log(this.confirmPayment.value);
      // console.log('eror');
      return;
    }

    this.loading = true;
    // console.log(id);
    let amount = '';
    if (!order.amountv) {
      amount = order.total;
    } else {
      amount = order.amountv;
    }
    const uniquepay = this.pay;
    if (order.payment !== '15' || order.payment !== '16') {
      const cancel = {
        // tslint:disable-next-line: object-literal-shorthand
        id_order: order.id_order,
        st: 6,
        reason: controls['reason'].value,
      };
      this.orderService.CancelTransactionNonCC(cancel).subscribe(
        result => {
          const res = result;
          this.toastService.success(`Cancel Successful.`);
          setTimeout(() => {
            this.orderComponent.refresh();
          }, 1000);
          this.ngOnDestroy();
        }
      );
    } else {
      const data = {
        id_order: order.id_order,
        payment_code: order.payment_code,
        words: order.words,
        sessionid: order.sessionid,
        amount: 1000,
        reason: controls['reason'].value,
        unique: uniquepay,
        payment: order.payment
      };
      // console.log(data);

      this.orderService.voidTransactionByID(data).subscribe(
        result => {
          this.message = result;
          this.toastService.success(`Cancel Successful.`);
          // location.reload();
          // this.orderComponent.refresh();
          this.orderComponent.refresh();
          this.ngOnDestroy();
        }
      );
    }
  }

  /**
   * item received
   */
  Received(order: any) {
    const done = {
      id: order.id_order,
      order: 3,
      shipping: 1
    };
    this.orderService.updateDelivery(done).subscribe(
      result => {
        const message = result;
        this.orderComponent.refresh();
        this.ngOnDestroy();
      }
    );
  }

}
