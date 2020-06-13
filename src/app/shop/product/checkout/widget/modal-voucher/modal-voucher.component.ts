import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../../../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../shared/reducers';
import { currentUser } from '../../../../../shared/selectors/auth.selectors';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthLoginService } from '../../../../../shared/services/auth.service';
import { DatePipe } from '@angular/common';
import { ShippingService } from '../../../../../shared/services/shipping.service';
import { Res, District } from '../../../../../shared/classes/district';
import { Province } from '../../../../../shared/classes/province';
import { City } from '../../../../../shared/classes/city';
import { Router } from '@angular/router';
import { CheckoutComponent } from '../../checkout.component';
import { VoucherService } from '../../../../../shared/services/voucher.service';
import { Vouchers } from '../../../../../shared/classes/voucher';
import { ToastrService } from 'ngx-toastr';
import { find } from 'lodash';


declare var $: any;

@Component({
  selector: 'app-voucher',
  templateUrl: './modal-voucher.component.html',
  styleUrls: ['./modal-voucher.component.scss'],
  providers: [ DatePipe ]
})
export class ModalVoucherComponent implements OnInit, OnDestroy {
  customer$: Observable<Customer>;
  voucherForm: FormGroup;
  loading = false;
  vouchers: Vouchers[] = [];
  @Input() customer: any;
  @Input() total: any;
  @Output() voucher = new EventEmitter();
  

// tslint:disable-next-line: no-inferrable-types
  public counter:   number = 1;
  public variantImage:   any = '';
  public selectedColor:   any = '';
  public selectedSize:   any = '';

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private auth: AuthLoginService,
    private datePipe: DatePipe,
    private voucherService: VoucherService,
    private address: CheckoutComponent,
    private toastService: ToastrService
  ) {   }

  ngOnInit() {
    this.voucherService.getAllVouchers().subscribe(
      res => {
        this.vouchers = res;
        // console.log(this.vouchers);
      }
    );
    this.initaccountForm();
  }

  initaccountForm() {
    this.voucherForm = this.fb.group({
    voucher: ['', Validators.compose([
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(320)
      ])
    ],
    });
  }

  ngOnDestroy() {
    $('.quickviewm').modal('hide');
  }

  /**
   * submit form
   */
  voucherUse(customer, total) {
    const control = this.voucherForm.controls;
    const vouc = find(this.vouchers, function(item: Vouchers) {
      return (item.voucherid === control['voucher'].value);
    });

    if (vouc) {
      if (vouc.kouta > 0 && vouc.inuse >= vouc.kouta || vouc.kouta !== null && vouc.inuse >= vouc.kouta) {
        this.toastService.error(`Voucher Can't Be Use`);
        return;
      } else if (vouc.limit_pay > 0 && vouc.limit_pay > total) {
        this.toastService.error(`Sorry you haven't reached the minimum spending limit`);
        return;
      } else {
        this.voucher.emit(vouc);
        this.voucherForm.reset();
        this.toastService.success(`Voucher Can Be Use`);
        this.ngOnDestroy();
      }
    }

    if (!vouc) {
      this.toastService.error(`The Voucher Doesn't Exist`);
    }

    return vouc;
  }
}
