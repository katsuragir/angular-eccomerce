import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { Product } from '../../../shared/classes/product';
import { PaginationService } from '../../../shared/classes/paginate';
import { ProductsService } from 'src/app/shared/services/products.service';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { SettingService } from '../../../shared/services/setting.service';
declare var $: any;

@Component({
  selector: 'app-feature-product-home',
  templateUrl: './feature-product.component.html',
  styleUrls: ['./feature-product.component.scss']
})
export class FeatureProductHomeComponent implements OnInit {
  public products:   Product[] = [];
  // public productsNew: Product[] = [];
  // public productsBest: Product[] = [];
  public productsFea: Product[] = [];
  public sortByOrder: String = '';
  paginate: any = {};
  page: number;
  public setting: any;
  @Output() massage = new EventEmitter();

  constructor(
    private paginateService: PaginationService, private productsService: ProductsService, private _scrollToService: ScrollToService,
    private settingService: SettingService
  ) {
    this.settingService.setting().subscribe(
      result => {
        this.setting = result;
      }
    );
  this.productsService.getProductsHomeFea().subscribe(product => {
    if (product || product.length > 0) {
      this.productsFea = product;
      this.setPage(1, 'first');
    } else {
      this.massage.emit(true);
    }
  });
 }

  ngOnInit() {
    if (this.sortByOrder === '') {
      this.sortByOrder = 'desc';
    }
    // tab js
    $('#tab-1').css('display', 'Block');
    $('.default').css('display', 'Block');
    $('.tabs li a').on('click', function() {
      // tslint:disable-next-line: deprecation
      event.preventDefault();
      $(this).parent().parent().find('li').removeClass('current');
      $(this).parent().addClass('current');
      // tslint:disable-next-line: prefer-const
      let currunt_href = $(this).attr('href');
      $('#' + currunt_href).show();
      $(this).parent().parent().parent().find('.tab-content').not('#' + currunt_href).css('display', 'none');
    });
  }

  public setPage(page: number, params: string) {
    // console.log(params);
    this.page = page;
    // get paginate object from service
    this.paginate = this.paginateService.getPagerFeature(this.productsFea.length, page);
    // get current page of items
    this.products = this.productsFea.slice(this.paginate.startIndex, this.paginate.endIndex + 1);
    if (params === 'page') {
      this.toTop();
    }
  }

  toTop() {
    const config: ScrollToConfigOptions = {
      target: 'promo'
    };

    this._scrollToService.scrollTo(config);
  }

}
