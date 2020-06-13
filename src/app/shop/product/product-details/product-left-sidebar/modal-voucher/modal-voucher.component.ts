import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../shared/reducers';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DomainURL } from '../../../../../shared/domainURL';
import { ToastrService } from 'ngx-toastr';
import { VoucherService } from '../../../../../shared/services/voucher.service';
import { Vouchers } from '../../../../../shared/classes/voucher';

declare var $: any;

@Component({
  selector: 'app-view-voucher',
  templateUrl: './modal-voucher.component.html',
  styleUrls: ['./modal-voucher.component.scss'],
  providers: [ DatePipe ]
})
export class ModalViewVoucherComponent implements OnInit, OnDestroy {

  loading = false;
  message: any = [];
  @Input() vouchers: Vouchers[] = [];
  imgUrl: string = this.localUrl.domain;
  cancelPayment: FormGroup;
  submitted = false;
  public pay = '';
  public check: any[] = [];
  @Input() type = 'ongkir';


// tslint:disable-next-line: no-inferrable-types
  public counter:   number = 1;
  public variantImage:   any = '';
  public selectedColor:   any = '';
  public selectedSize:   any = '';

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private voucherService: VoucherService,
    private localUrl: DomainURL,
    private toastService: ToastrService
  ) { }

  ngOnInit() {

  }

  fillterVoucherOfType(vouchers: Vouchers[], type) {
    return vouchers.filter(x => x.type === type);
  }

  ngOnDestroy() {
    $('.quickviewm').modal('hide');
    // location.reload();
  }

}
