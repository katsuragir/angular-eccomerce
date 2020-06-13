import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../../../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../shared/reducers';
import { currentUser } from '../../../../../shared/selectors/auth.selectors';
import { OrderService } from '../../../../../shared/services/order.service';
import { ProductsService } from '../../../../../shared/services/products.service';
import { environment } from '../../../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthLoginService } from '../../../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from '../../../../../shared/classes/paginate';
import { ShippingService } from '../../../../../shared/services/shipping.service';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { SettingService } from '../../../../../shared/services/setting.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ModalResiComponent } from '../../widget/modal-resi/modal-resi.component';
declare var $: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'orders-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrdersListComponent implements OnInit {
  customer$: Observable<Customer>;
  customer: Customer;
  @Input() parameter: number;
  private allItems:   any[] = [];
  public orders: any[] = [];
  public products: any [] = [];
  public total: any [] = [];
  public qty: any;
  public sumTotal: any;
  public weight: any;
  public totalongkir: any;
  private akses: any;
  paginate: any = {};
  page: number;
  private district: any;
  setting$: Observable<any>;
  public sizewidth: any;

  constructor(
    private store: Store<AppState>,
    private orderService: OrderService,
    private router: Router,
    public productsService: ProductsService,
    private authService: AuthLoginService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private paginateService: PaginationService,
    private shipping: ShippingService,
    private _scrollToService: ScrollToService,
    private settingService: SettingService,
    public dialog: MatDialog) {
      this.setting$ = this.settingService.setting();
      const authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
      this.akses = localStorage.getItem(authTokenKey);
      if (!this.akses) {
        this.router.navigate(['/pages/login']);
      }
     }

  ngOnInit(): void {
    this.sizewidth = window.innerWidth;
    // tab js
    $('#tab-1').css('display', 'Block');
    $('.default').css('display', 'Block');
    $('.tabs li a').on('click', function() {
      // tslint:disable-next-line: deprecation
      event.preventDefault();
      $(this).parent().parent().find('li').removeClass('current');
      $(this).parent().addClass('current');
      const currunt_href = $(this).attr('href');
      $('#' + currunt_href).show();
      $(this).parent().parent().parent().find('.tab-content').not('#' + currunt_href).css('display', 'none');
    });
    this.authService.findAccount(this.akses).subscribe(
      result => {
        this.customer = result[0];
        return this.orderService.getOrderItem(result[0].id_customer, this.parameter).subscribe(
          res => {
            this.allItems = res;
            this.setPage(1, 'first');
            // console.log(this.allItems);
          }
        );
      }
    );
  }

  public setPage(page: number, params: string) {
    // console.log(params);
    this.page = page;
    // get paginate object from service
    this.paginate = this.paginateService.getPagerNew(this.allItems.length, page);
    // get current page of items
    this.orders = this.allItems.slice(this.paginate.startIndex, this.paginate.endIndex + 1);
    if (params === 'page') {
      this.toTop();
    }
  }

  toTop() {
    const config: ScrollToConfigOptions = {
      target: 'order'
    };

    this._scrollToService.scrollTo(config);
  }

  hellow(id_order) {
    // console.log(id_order);
    this.orderService.getProduct(id_order).subscribe(
      result => {
        this.qty = result[0].sumqty;
        this.sumTotal = result[0].total;
        this.products = result;
        this.weight = result[0].weight;
        this.totalongkir = result[0].ongkir;
      }
    );

    this.orderService.getProductTotal(id_order).subscribe(
      result => {
        this.total = result;
      }
    );
  }

  public refresh() {
    window.location.reload();
  }

  successPay(id) {
    this.toastrService.success(`${id} Payment Has Been Sent Successful.`);
  }

  getInvoice(id) {
    this.router.navigate(['/pages/invoice', id], { relativeTo: this.activatedRoute });
  }

  /**
   * get payment method
   */
  getPaymentMethod(payment): string {
    switch (payment) {
      case '41':
        return 'Mandiri VA';
      case '15':
        return 'Credit Card Visa/Master/JCB';
      case '16':
        return 'Credit Cart';
      case '04':
        return 'Doku Wallet';
      case '33':
        return 'Danamon VA';
      case '32':
        return 'CIMB VA';
      case '26':
        return 'Danamon Internet Banking';
      case '25':
      return 'Muamalat Internet Banking';
      case '19':
        return 'CIMB Clicks';
      case '35':
        return 'Alfa VA';
    }
    return '';
  }

  /**
   * get Status order
   */
  getStatusOrder(status: number): string  {
    switch (status) {
      case 0:
        return 'Waiting Payment...';
      case 1:
        return 'On Process';
      case 2:
        return 'Sending';
      case 3:
        return 'Delivered';
      case 4:
        return 'Verification Payment';
      case 5:
        return 'Accept Payment';
      case 6:
        return 'Cancel Order';
    }
    return '';
  }

  /**
   * Send Email
   */
  SendEmail(order: any, id) {

    const data = {
      orders: order,
      address: this.district
    };
    switch (id) {
      case 1:

        return this.orderService.resendEmailOrder(data).subscribe(
          res => {
            const rest = res;
            this.toastrService.success(`Resend Email Order Successful.`);
          }
        );
        break;
      case 2:

        return this.orderService.sendInvoice(data).subscribe(
          res => {
            const rest = res;
            this.toastrService.success(`Send Email Invoice Successful.`);
          }
        );
        break;
    }

  }

  /**
   *
   * @param order check status order
   */
  checkStatus(order) {
    const data = {
      id_order: order.id_order,
      sessionid: order.sessionid,
    };
    // console.log(data);
    this.orderService.checkTransactionByID(data).subscribe(
      result => {
       const message = result;
        // console.log(message);
        // location.reload();
        // this.refresh();
      }
    );
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
        this.refresh();
      }
    );
  }

  /**
   * Check Resi
   */
  checkResi(order) {
    const resi = {
      resi: order.resiid,
      courier: order.courier
    };

    let height = '';

    if (this.sizewidth > 480) {
      height = '650px';
    } else {
      height = '350px';
    }

    this.orderService.checkResi(resi).subscribe(
      result => {
        // console.log(result);
        if (!result || result.rajaongkir.status.code === 400) {
          const dialogConfig = new MatDialogConfig();
          // The user can't close the dialog by clicking outside its body
          dialogConfig.disableClose = false;
          dialogConfig.id = 'modal-component';
          dialogConfig.height = height;
          dialogConfig.width = '650px';
          dialogConfig.data = result;
          // https://material.angular.io/components/dialog/overview
          this.dialog.open(ModalResiComponent, dialogConfig);
           return;
        } else {
          const dialogConfig = new MatDialogConfig();
          // The user can't close the dialog by clicking outside its body
          dialogConfig.disableClose = false;
          dialogConfig.id = 'modal-component';
          dialogConfig.height = height;
          dialogConfig.width = '650px';
          dialogConfig.data = result;
          // https://material.angular.io/components/dialog/overview
          this.dialog.open(ModalResiComponent, dialogConfig);

          if (result.rajaongkir.result.delivery_status.status === 'DELIVERED') {
            const data = {
              id_order: order.id_order,
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

  delvery(data) {
    this.orderService.updateResi(data).subscribe(
      res => {
        console.log(res);
      }
    );
  }

  @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.sizewidth = window.innerWidth;
      // console.log(this.sizewidth);
    }

}
