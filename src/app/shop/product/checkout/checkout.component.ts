import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
import { CartItem } from '../../../shared/classes/cart-item';
import { find } from 'lodash';
import { ProductsService } from '../../../shared/services/products.service';
import { CartService } from '../../../shared/services/cart.service';
import { OrderService } from '../../../shared/services/order.service';
import { Observable, of, BehaviorSubject, Subscription, interval } from 'rxjs';
import { Province } from '../../../shared/classes/province';
import { City } from '../../../shared/classes/city';
import { ShippingService } from '../../../shared/services/shipping.service';
import { District, Res } from '../../../shared/classes/district';
import { Customer } from '../../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../shared/reducers';
import { currentUser } from '../../../shared/selectors/auth.selectors';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Courier } from '../../../shared/classes/couriers';
import { Address } from '../../../shared/classes/address_cost';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthLoginService } from '../../../shared/services/auth.service';
import { DomainURL } from '../../../shared/domainURL';
import { Vouchers } from '../../../shared/classes/voucher';
import { DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';
import { ModalPaymentComponent } from './widget/modal-payment/modal-payment.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingService } from '../../../shared/services/setting.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [DecimalPipe]
})
export class CheckoutComponent implements OnInit, OnDestroy {

  // form group
  public province: Province[] = [];
  public city: City[] = [];
  public district: District[] = [];
  public checkoutForm:  FormGroup;
  public checkoutFormManual:  FormGroup;
  public cartItems:  Observable<CartItem[]> = of([]);
  public checkOutItems:  any[] = [];
  public orderDetails:  any[] = [];
  public amount:  number;
  public amountVoucher:  number;
  public potongan: number;
  public potongan_ongkir: number;
  public weight:  any = '';
  public totweight: number;
  public payPalConfig?:  PayPalConfig;
  public selectedValue: Boolean;
  public selectedDistrict: Boolean;
  customer$: Observable<Customer>;
  public customer: any;
  id_province: number;
  id_city: number;
  id_district: number;
  public dataDist: Res;
  public couriers: any[] = [];
  address: Address[] = [];
  ongkirs: any;
  courier: any = [];
  kurir: any;
  code_dest: string;
  public ongkir: number;
  public total_ongkir: number;
  onOption1: boolean;
  // tslint:disable-next-line: no-inferrable-types
  private onOption2: boolean =  false;
  service: boolean;
  public unique = '';
  public pay = '';
  message: any;
  public dist: Res;
  private akses: any;
  sortByOrder = 'a-z';
  imgUrl = this.localUrl.domain;
  addressCustomer: any;
  private updateSubscription: Subscription;
  voucher: Vouchers;
  requestpay: any = 'test';
  setting$: Observable<any>;
  // Array
  public OrderDetails;
  private Allongkir: any;
  public id_order: any[] = [];
  public donasi: number;

  // Form Validator
  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    public productsService: ProductsService,
    private orderService: OrderService,
    private shipping: ShippingService,
    private store: Store<AppState>,
    private http: HttpClient,
    private router: Router,
    private authService: AuthLoginService,
    private localUrl: DomainURL,
    private _decimalPipe: DecimalPipe,
    private toastrService: ToastrService,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private settingService: SettingService) {
    this.setting$ = this.settingService.setting();
    this.checkoutForm = this.fb.group({
      courier: ['null', Validators.required],
      service: ['', Validators.required],
      payment: ['0', Validators.required],
      weight: [this.weight],
    });
    this.checkoutFormManual = this.fb.group({
      courier: ['null', Validators.required],
      service: ['', Validators.required],
      payment: ['', Validators.required],
      weight: [this.weight],
    });
    const authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
    this.akses = localStorage.getItem(authTokenKey);
    if (!this.akses) {
        this.router.navigate(['/pages/login']);
    }

  }

  ngOnInit(): void {
    this.orderService.getidOrder().subscribe(
      result => {
        this.id_order = result;
      }
    );
    this.voucher = null;
    this.checkoutForm.get('courier').setValue('Select Courier');
    this.checkoutFormManual.get('courier').setValue('Select Courier');
    this.onOption1 = false;
    // this.onOption2 = false;
    this.service = false;
    this.authService.findAccount(this.akses).subscribe(
      result => {
        this.customer = result[0];
        this.updateSubscription = interval(1000).subscribe(
          () => {
          this.getAllCart(result[0].id_customer);
        });
       // console.log(result[0].id_customer);
      }
    );
    // console.log(this.akses);
    this.area();
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    const lengthOfCode = 8;
    if (!this.unique) {
    this.makeRandom(lengthOfCode, possible);
    }
    const unique = '1234567890';
    const lengthOfUnique = 2;
    if (!this.pay) {
      this.makeUnique(lengthOfUnique, unique);
    }
    // console.log(total);
  }

  getOngkir(customer, products) {
    const data = {
      or: '154',
      ort: 'city',
      des: customer.id_city,
      dest: 'city',
      wei: products[0].weight,
      kur: products[0].courier
    };
    // console.log(data);
    this.shipping.getOngkir(data).subscribe(
      res => {
        this.Allongkir = res.rajaongkir;

      }
    );
  }

  ngOnDestroy() {
    return this.updateSubscription.unsubscribe();
  }

  getAllCart(id) {
    this.cartService.getItems(id).subscribe(
      products => {
        this.weight = products[0].totalweight;
        this.totweight = products[0].weight;
        this.amount = products[0].totalOut;
        // console.log(products, this.totweight);
        this.checkOutItems = products;
        this.getOngkir(this.customer, products);
        // this.donasi = 5000 * Math.floor(products[0].totalOut / 100000);
        // console.log(this.donasi);
        return this.ngOnDestroy();
    });
  }

  getCustomerAddress(city, district) {
    return this.shipping.getAddress(city, district).subscribe(
      result => {
        this.addressCustomer = result.result;
        // console.log(this.district);
      }
    );
  }

  makeRandom(lengthOfCode: number, possible: string) {
    for (let i = 0; i < lengthOfCode; i++) {
      this.unique += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    // console.log(this.unique);
    return this.unique;
  }

  makeUnique(lengthOfUnique: number, unique: string) {
    for (let i = 0; i < lengthOfUnique; i++) {
      this.pay += unique.charAt(Math.floor(Math.random() * unique.length));
    }
    // console.log(this.pay);
    return this.pay;
  }

  area() {
   return this.shipping.getCourier().subscribe(
      res => {
        this.couriers = res;
        // console.log(this.couriers);
      }
    );
  }

  findAddress(id_district) {
    return this.shipping.findAddress(id_district).subscribe(
      result => {
        this.address = result;
        // console.log(this.address);
      }
    );
  }

  /**
   * updateCourier()
   */
  updateCourier() {
    if (this.onOption1 === true || this.onOption2 === true || this.service === true) {
      this.onOption1 = false;
      this.onOption2 = false;
      this.service = false;
      this.shipping.getCourier().subscribe(
        res => {
          this.couriers = res;
          // console.log(this.couriers);
        }
      );
    }
  }

  onOptionService(courier, id_city, type, weight) {
    this.ongkirs = null;
    // this.voucher = null;
    this.onOption2 = false;
    this.onOption1 = false;
    if (courier === 'cod') {
      this.onOption2 = true;
      this.service = false;
      this.onOption1 = false;
      this.checkoutForm.get('service').setValue(1);
      this.checkoutFormManual.get('service').setValue(1);
      this.ongkir = 0;
    } else if (courier !== '') {
      this.service = true;
      this.onOption2 = false;
      this.ongkirs = this.Allongkir.results.filter(x => x.code === courier);
      this.kurir = this.Allongkir.results.filter(x => x.code === courier);
      // console.log(this.ongkirs, this.kurir);
    } else {
      // this.voucher = null;
      this.onOption2 = false;
      this.onOption1 = false;
      this.kurir = null;
      this.ongkirs = null;
      this.service = false;
    }
    // console.log(this.onOption2);
    // console.log(courier);
  }

  onOptionTotal(cost, event) {
    const service = event;
    const data = {
      kurir: cost,
      info: service
    };
    this.courier = data;
    // console.log(this.courier);
    this.onOption1 = true;
    this.ongkir = service.cost[0].value;
    // console.log(this.ongkir);
    if (this.voucher) {
      this.getVoucher(this.voucher);
    }

    const total = this.amount + this.ongkir;
    let voucherid: any;
    let amount: any;
    if (!this.voucher) {
      voucherid = '';
    } else {
      voucherid = this.voucher.voucherid;
    }

    if (!this.amountVoucher || this.amountVoucher === 0 || this.amountVoucher === null) {
        amount = +total;
    } else {
      amount = this.amountVoucher;
    }

    const manual = {
      ongkir: this.courier,
      payid: this.pay,
      checkout: this.checkOutItems,
      customer: this.customer,
      unique: this.unique,
      checkoutvalue: this.checkoutFormManual.value,
      address: this.addressCustomer,
      voucher: this.voucher,
      amount: amount,
      amountvoucher: this.amountVoucher
    };
    // console.log(manual);
  }

  onOptionsSelected(value: number) {
    this.selectedValue = true;
    return this.shipping.getCities(value).subscribe(city => { this.city = city; });
  }

  onOptionsDistrict(value: number) {
    this.selectedDistrict = true;
    return this.shipping.getDistrict(value).subscribe(district => { this.district = district;  });
  }

  /**
	 * Returns CSS Class by status
	 *
	 * @param status: number
	 */
  getItemCssClassByStatus(status: number = 0): string {
    switch (status) {
      case 1:
        return 'success';
      case 0:
        return 'metal';
    }
   }

  getItemStatusString(parent: number = 0): string {
    switch (parent) {
      case 1:
        return 'Main';
      case 0:
        return 'Disable';
    }
      return '';
  }



  // Get sub Total
  public getTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }

  instan() {
    const total = this.amount; // + this.ongkir;
   const uniquepay = this.pay;

   const payid = uniquepay;
   const ongkir = this.courier;
   const address = this.addressCustomer;
    // console.log(total + '.' + uniquepay);
    const controls = this.checkoutForm.controls;
// tslint:disable-next-line: whitespace
    this.checkoutForm.get('weight').setValue(this.totweight);
    // console.log(this.checkOutItems, this.customer, this.unique, payid, this.checkoutForm.value, ongkir, address);
    let voucherid: any;
    let amount: any;
    let amountdoku: any;
    if (!this.voucher) {
      voucherid = '';
    } else {
      voucherid = this.voucher.voucherid;
    }

    if (!this.amountVoucher || this.amountVoucher === 0 || this.amountVoucher === null) {
        amount = +total;
        amountdoku = +total + +this.pay + this.ongkir;
    } else {
      amount = this.amountVoucher;
      amountdoku = +this.amountVoucher + +this.pay;
    }
    // tslint:disable-next-line: max-line-length
    const data = {
      checkout: this.checkOutItems,
      customer: this.customer,
      unique: this.unique,
      payid: payid,
      checkoutvalue: this.checkoutForm.value,
      ongkir: ongkir,
      disc_ongkir: this.potongan_ongkir,
      discount: this.potongan,
      address: address,
      voucher: this.voucher,
      amount: amountdoku,
      amountdoku: amount,
      potongan: this.potongan,
      voucherid: voucherid,
      amountvoucher: this.amountVoucher,
      // donasi: this.donasi
    };
    this.requestpay = data;
    // console.log(data);
      this.orderService.createOrder(data).subscribe(
        res => {
           // this.message = res;
           this.cartService.destroyFromCart();
           if (res) {
            this.orderService.generatePaycode(res).subscribe(
              result => {
                // console.log(result);
                this.requestpay = result;

                if (result) {
                  const param = { result };
                  this.orderService.redirectDokuPay(result, 'https://pay.doku.com/Suite/Receive');

                }
              }
            );
          }
       }
     );

    this.cartService.updateCartItem(this.customer.id_customer).subscribe();
    
  }

  // stripe pay gateway
  stripeCheckout(): void {
    this.authService.findAccount(this.akses).subscribe(
      result => {
        this.cartService.getItems(result[0].id_customer).subscribe(
          products => {
            this.checkOutItems = products;
            const fill = products.filter( x => x.stock === 0 );

            if (fill.length > 0) {
              this.toastrService.error('Upss, There are empty products');
              return;
            } else {
              this.instan();
            }
        });
      }
    );
  }

  manual() {
    if (typeof !this.unique) {
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
      const lengthOfCode = 8;
      let unique = '';
      for (let i = 0; i < lengthOfCode; i++) {
        unique += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      const total = this.amount + this.ongkir;
      const uniquepay = this.pay;
      // const amount = total + uniquepay;
      const payid = uniquepay;
      const ongkir = this.courier;
      const address = this.addressCustomer;
      // console.log(total + '.' + uniquepay);
      const controls = this.checkoutForm.controls;
  // tslint:disable-next-line: whitespace
      this.checkoutFormManual.get('weight').setValue(this.totweight);
      this.checkoutFormManual.get('courier').setValue(controls['courier'].value);
      this.checkoutFormManual.get('service').setValue(controls['service'].value);
      this.checkoutFormManual.get('payment').setValue('01');

      // tslint:disable-next-line: max-line-length
      let voucherid: any;
      let amount: any;
      if (!this.voucher) {
        voucherid = '';
      } else {
        voucherid = this.voucher.voucherid;
      }

      if (!this.amountVoucher || this.amountVoucher === 0 || this.amountVoucher === null) {
          amount = +total;
      } else {
        amount = this.amountVoucher;
      }
      const data = {
        checkout: this.checkOutItems,
        customer: this.customer,
        unique: unique,
        payid: payid,
        checkoutvalue: this.checkoutFormManual.value,
        ongkir: ongkir,
        disc_ongkir: this.potongan_ongkir,
        discount: this.potongan,
        address: address,
        voucher: this.voucher,
        amount: amount,
        amountvoucher: this.amountVoucher,
        // donasi: this.donasi
      };
      // console.log(data);
        
      this.orderService.createManualOrder(data).subscribe(
        res => {
            this.message = res;
            this.cartService.destroyFromCart();
            this.router.navigate(['/home/checkout/success/' + this.unique]);
        }
      );
      this.cartService.updateCartItem(this.customer.id_customer).subscribe();
    } else {
      const id_order = find(this.id_order, function(item: any) {
        // console.log(this.unique, item);
        return (this.unique === item.id_order);
      });

      if (id_order) {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        const lengthOfCode = 8;
        for (let i = 0; i < lengthOfCode; i++) {
          this.unique += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        const total = this.amount + this.ongkir;
        const uniquepay = this.pay;
        // const amount = total + uniquepay;
        const payid = uniquepay;
        const ongkir = this.courier;
        const address = this.addressCustomer;
        const controls = this.checkoutForm.controls;
    // tslint:disable-next-line: whitespace
        this.checkoutFormManual.get('weight').setValue(this.totweight);
        this.checkoutFormManual.get('courier').setValue(controls['courier'].value);
        this.checkoutFormManual.get('service').setValue(controls['service'].value);
        this.checkoutFormManual.get('payment').setValue('01');
        // console.log(this.checkOutItems, this.customer, this.unique, payid, this.checkoutForm.value, ongkir, address);

        // tslint:disable-next-line: max-line-length
        let voucherid: any;
        let amount: any;
        if (!this.voucher) {
          voucherid = '';
        } else {
          voucherid = this.voucher.voucherid;
        }

        if (!this.amountVoucher || this.amountVoucher === 0 || this.amountVoucher === null) {
            amount = +total;
        } else {
          amount = this.amountVoucher;
        }
        const data = {
          checkout: this.checkOutItems,
          customer: this.customer,
          unique: this.unique,
          payid: payid,
          checkoutvalue: this.checkoutFormManual.value,
          ongkir: ongkir,
          disc_ongkir: this.potongan_ongkir,
          discount: this.potongan,
          address: address,
          voucher: this.voucher,
          amount: amount,
          amountvoucher: this.amountVoucher
        };
       // console.log(data);
        
        this.orderService.createManualOrder(data).subscribe(
          res => {
              this.message = res;
              this.cartService.destroyFromCart();
              this.router.navigate(['/home/checkout/success/' + this.unique]);
          }
        );
        this.cartService.updateCartItem(this.customer.id_customer).subscribe();
      } else {
        const total = this.amount + this.ongkir;
        const uniquepay = this.pay;
        const payid = uniquepay;
        const ongkir = this.courier;
        const address = this.addressCustomer;
        const controls = this.checkoutForm.controls;
    // tslint:disable-next-line: whitespace
        this.checkoutFormManual.get('weight').setValue(this.totweight);
        this.checkoutFormManual.get('courier').setValue(controls['courier'].value);
        this.checkoutFormManual.get('service').setValue(controls['service'].value);
        this.checkoutFormManual.get('payment').setValue('01');
        // console.log(this.checkOutItems, this.customer, this.unique, payid, this.checkoutForm.value, ongkir, address);

        // tslint:disable-next-line: max-line-length
        let voucherid: any;
        let amount: any;
        if (!this.voucher) {
          voucherid = '';
        } else {
          voucherid = this.voucher.voucherid;
        }

        if (!this.amountVoucher || this.amountVoucher === 0 || this.amountVoucher === null) {
            amount = +total;
        } else {
          amount = this.amountVoucher;
        }
        const data = {
          checkout: this.checkOutItems,
          customer: this.customer,
          unique: this.unique,
          payid: payid,
          checkoutvalue: this.checkoutFormManual.value,
          ongkir: ongkir,
          disc_ongkir: this.potongan_ongkir,
          discount: this.potongan,
          address: address,
          voucher: this.voucher,
          amount: amount,
          amountvoucher: this.amountVoucher
        };
        // console.log(data);

        this.orderService.createManualOrder(data).subscribe(
          res => {
              this.message = res;
              this.cartService.destroyFromCart();
              this.router.navigate(['/home/checkout/success/' + this.unique]);
          }
        );
        this.cartService.updateCartItem(this.customer.id_customer).subscribe();
      }
    }
  }

  // stripe pay gateway
  placeOrder(): void {
    this.authService.findAccount(this.akses).subscribe(
      result => {
        this.cartService.getItems(result[0].id_customer).subscribe(
          products => {
            this.checkOutItems = products;
            const fill = products.filter( x => x.stock === 0 );

            if (fill.length > 0) {
              this.toastrService.error('Upss, There are empty products');
              return;
            } else {
              this.manual();
            }
        });
      }
    );
   }

  // Update price filter
  public getVoucher(voucher: Vouchers) {
    // console.log(voucher);
    this.voucher = voucher;
    const amount = +this.amount + + this.ongkir;
    // console.log(this.ongkir);
    if (voucher.type === 'pembayaran') {
      if (voucher.vouchertab === 'Amount') {
        this.amountVoucher = (amount - voucher.vouchervalue);
        this.potongan = voucher.vouchervalue;
        // console.log(this.amountVoucher = amount - voucher.vouchervalue);
      } else {
        this.amountVoucher = (amount - (amount * (voucher.vouchervalue * 0.01)));
        this.potongan = (amount * voucher.vouchervalue) / 100;
      }
    } else {
      if (voucher.vouchertab === 'Amount') {
        const ongkir = +this.ongkir - voucher.vouchervalue;
        this.amountVoucher = +this.amount + ((ongkir > 0) ? ongkir : 0);
        if (this.ongkir >= voucher.vouchervalue) {
          this.potongan_ongkir = voucher.vouchervalue;
        } else {
          this.potongan_ongkir = +this.ongkir;
        }
        this.total_ongkir = (ongkir > 0) ? ongkir : 0;
      } else {
        const ongkir = (+this.ongkir - (+this.ongkir * (voucher.vouchervalue * 0.01)));
        this.amountVoucher = +this.amount + ((ongkir > 0) ? ongkir : 0);
        this.potongan_ongkir = +this.ongkir * (voucher.vouchervalue * 0.01);
        this.total_ongkir = (ongkir > 0) ? ongkir : 0;
      }
    }
  }

  closeVoucher() {
    this.voucher = null;
    this.potongan_ongkir = null;
    this.potongan = null;
    this.total_ongkir = null;
  }
}
