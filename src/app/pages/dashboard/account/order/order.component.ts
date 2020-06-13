import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../shared/reducers';
import { currentUser } from '../../../../shared/selectors/auth.selectors';
import { OrderService } from '../../../../shared/services/order.service';
import { ProductsService } from '../../../../shared/services/products.service';
import { environment } from '../../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthLoginService } from '../../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from '../../../../shared/classes/paginate';
import { ShippingService } from '../../../../shared/services/shipping.service';
import { SettingService } from '../../../../shared/services/setting.service';
declare var $: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'account-orders',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrdersComponent implements OnInit {
  customer$: Observable<Customer>;
  customer: Customer;
  public allItems: any[] = [];
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
  @ViewChild('wait-pay', {static: true}) waitpay;
  @ViewChild('cancel', {static: true}) cancel;
  setting$: Observable<any>;

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
    private settingService: SettingService) {
      this.setting$ = this.settingService.setting();
      const authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
      this.akses = localStorage.getItem(authTokenKey);
      if (!this.akses) {
        this.router.navigate(['/pages/login']);
      }
     }

  ngOnInit(): void {
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

      }
    );

  }

}
