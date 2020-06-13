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
import { find } from 'lodash';
import { Orders } from '../../../../../shared/classes/orders';
import { AuthNoticeService } from '../../../../../shared/services/auth-notice.service';
import { OrdersListComponent } from '../../order/order-list/order-list.component';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss'],
  providers: [ DatePipe ]
})
export class ModalConfirmComponent implements OnInit, OnDestroy {
  customer$: Observable<Customer>;
  confirmPayment: FormGroup;
  loading = false;
  message: any = [];
  customer: Customer;
  orders: any = [];
  fail: boolean;
  @Input() order: any;
  @Input() total: any;
  submitted = false;

// tslint:disable-next-line: no-inferrable-types
  public counter:   number = 1;
  public variantImage:   any = '';
  public selectedColor:   any = '';
  public selectedSize:   any = '';

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private orderService: OrderService,
    private authNoticeService: AuthNoticeService,
    private OrderCom: OrdersListComponent,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.fail = false;
    // console.log(this.order);
    this.orderService.getOrders().subscribe(
      result => {
        this.orders = result;
        // console.log(this.orders);
      }
    );
    this.customer$ = this.store.pipe(select(currentUser));
    this.customer$.subscribe(
      result => {
        this.customer = result;
        // console.log(this.customer);
      }
    );
    this.initaccountForm();
  }

  initaccountForm() {
    const date = new Date().toISOString().substring(0, 10);
    this.confirmPayment = this.fb.group({
      transaction: [{value: this.order.id_order, disabled: true}, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8) ]
      ],
      total: [{value: this.order.total, disabled: true}, [
        Validators.required,
        ]
      ],
      firstname: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(250)
        ]
      ],
      lastname: [''],
      date: [date, [
        Validators.required,
        ]
      ],
      transfer: ['', [
        Validators.required,
        ]
      ],
      virtual: [''],
      note: [''],
    });
    if (this.order.amountv) {
      this.confirmPayment.controls['total'].setValue(this.order.amountv);
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.confirmPayment.controls; }

  ngOnDestroy() {
    $('.quickviewm').modal('hide');
  }

  /**
   * submit form
   */
  onSubmit() {
    this.submitted = true;
    const controls = this.confirmPayment.controls;
    // stop here if form is invalid
    if (this.confirmPayment.invalid) {
      // console.log(this.confirmPayment.value);
      // console.log('eror');
      return;
    }

    this.loading = true;

   const formatDate = this.datePipe.transform(controls['date'].value, 'yyyy-MM-dd');
   const data = {
    transaction_id: controls['transaction'].value,
    total_amount: controls['total'].value,
    first_name: controls['firstname'].value,
    last_name: controls['lastname'].value,
    date_payment: formatDate,
    payment: controls['transfer'].value,
    virtual_account: controls['virtual'].value,
    note: controls['note'].value
   };
   // console.log(data);
   this.orderService.confirmPayment(data).subscribe(res => {
    this.message = res;
    this.toastrService.success(`Sent Successful.`);
    this.OrderCom.refresh();
    this.ngOnDestroy();
    });
  }

  /**
   * open dialog
   */
  changeConfirm(data) {
    this.ngOnDestroy();
  }
}
