import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../shared/services/products.service';
import { Product } from '../../shared/classes/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomainURL } from '../../shared/domainURL';
import { trigger, transition, style, animate } from '@angular/animations';
import * as $ from 'jquery';
import { PaginationService } from '../../shared/classes/paginate';
import { SettingService } from '../../shared/services/setting.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Meta, Title } from '@angular/platform-browser';
import { TitleCasePipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [  // angular animation
    trigger('Animation', [
      transition('* => fadeOut', [
        style({ opacity: 0.1 }),
        animate(1000, style({ opacity: 0.1 }))
      ]),
      transition('* => fadeIn', [
         style({ opacity: 0.1 }),
         animate(1000, style({ opacity: 0.1 }))
      ])
    ])
  ],
  providers: [TitleCasePipe, DatePipe]
})
export class SearchComponent implements OnInit, OnDestroy {
  public searchForm: FormGroup;
  public products: Product[] = [];
  private allItems:   Product[] = [];
  private allProduct: Product[] = [];
  imgUrl: any;
  public sortByOrder:   String = '';   // sorting
  public animation:   any;   // Animation
  paginate: any = {};
  page: number;
  public setting: any;
  hide = false;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private domainUrl: DomainURL,
    private paginateService: PaginationService,
    private settingService: SettingService,
    private spinner: NgxSpinnerService,
    private meta: Meta,
    private title: Title,
    private titlecasePipe: TitleCasePipe,
    private datePipe: DatePipe
  ) {
    this.settingService.setting().subscribe(
      result => {
        this.setting = result;
      }
    );
    this.imgUrl = this.domainUrl.domain; }

  ngOnInit() {
    if (!this.allItems || this.allItems.length === 0 || this.allItems === []) {
      /** spinner starts on init */
      this.spinner.show();
    }

    if (this.sortByOrder === '') {
      this.sortByOrder = 'qty';
    }
    this.route.params.subscribe(params => {
      const search = params['id'];
      if (!search) {
        return this.allItems = null;
      } else {

        const name = 'Jual ' + this.titlecasePipe.transform(search) + ' Harga Murah - ' + this.datePipe.transform(new Date(), 'MMMM yyyy') + ' | Vapehan Vape Store';

        // Javascript SEO
        this.title.setTitle(name + ' | Vapehan Vape Store');
        this.meta.updateTag({ name: 'title', content: name + ' | Vapehan Vape Store' });
        // tslint:disable-next-line: max-line-length
        this.meta.updateTag({ name: 'description', content: 'Belanja ' + this.titlecasePipe.transform(search) + ' dengan harga murah dan terbaru ' + this.datePipe.transform(new Date(), 'MMMM yyyy') + ' di Online shop Vapehan Vape Store! Pembelanjaan mudah, pembayaran terjamin & pengiriman cepat.' });
        this.meta.updateTag({ name: 'keyword', content: this.titlecasePipe.transform(search) + ', vape, liquid, coil, mod, pod, vapehan' });
        // this.meta.updateTag({ name: 'url', content: 'https://vapehan.com' });

        /* Sosial SEO */
        this.meta.updateTag({ property: 'og:site_name', content: 'Vapehan Vape Store' });
        this.meta.updateTag({ property: 'og:title', content: name });
        this.meta.updateTag({ property: 'og:description', content: 'Belanja ' + this.titlecasePipe.transform(search) + ' dengan harga murah dan terbaru ' + this.datePipe.transform(new Date(), 'MMMM yyyy') + ' di Online shop Vapehan Vape Store! Pembelanjaan mudah, pembayaran terjamin & pengiriman cepat.' });
        this.meta.addTag({ name: 'robots', content: 'index, follow' });

        this.productsService.getProducts().subscribe(
          result => {
            if (result) {
              this.spinner.hide();
              this.hide = true;
              this.searchProduct(search, result);
            }
          }
        );
      }
    });
    this.initForm();
  }

  ngOnDestroy() {
    this.title.setTitle('Vapehan Vape Store - Toko Vaporizer Jakarta Indonesia');
    this.meta.updateTag({ name: 'title', content: 'Vapehan Vape Store - Toko Vaporizer Jakarta Indonesia' });
    this.meta.updateTag({ name: 'description', content: 'Belanja online aman dan nyaman di vapehan, Duren Sawit, Kota Administrasi Jakarta Timur - One stop vapestore , stop smoking go vaping' });
    this.meta.updateTag({ name: 'keyword', content: 'vapehan vape store, vapehan store, vapehan, toko vape online, vape store indonesia, toko vape, vape store online indonesia vape, vape indonesia, vaporizer jakarta, indonesia vape store, toko vape terdekat, wholesale' });
  }

  // Animation Effect fadeIn
  public fadeIn() {
      this.animation = 'fadeIn';
  }

  // Animation Effect fadeOut
  public fadeOut() {
      this.animation = 'fadeOut';
  }

  // For mobile filter view
  public mobileFilter() {
    $('.collection-filter').css('left', '-15px');
  }

  // sorting type ASC / DESC / A-Z / Z-A etc.
  public onChangeSorting(val) {
    this.sortByOrder = val;
    this.animation === 'fadeOut' ? this.fadeIn() : this.fadeOut(); // animation
 }

  initForm() {
    this.searchForm = this.fb.group({
      search: ['', Validators.required]
    });
   }

  submit() {
    const controls = this.searchForm.controls;

    // check form
    if (this.searchForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
        );
      return;
    }

    this.router.navigate(['/pages/search', controls['search'].value], { relativeTo: this.activatedRoute });
  }

  private searchProduct(search, all) {
    const searchText = search.toLowerCase();
    this.allItems = all.filter( x => x.name.toLowerCase().includes(searchText));
    this.setPage(1);
    // console.log(all, this.allItems, search);
    /*
    this.productsService.getProductBySearch(search).subscribe(
      result => {
        if (result === null) {
          return this.allItems = null;
        }
        this.allItems = result;
        this.setPage(1);
       // console.log(result);
      }
    );
    */
  }

  public setPage(page: number) {
    this.page = page;
    // get paginate object from service
    this.paginate = this.paginateService.getPagerSearch(this.allItems.length, page);
    // get current page of items
    this.products = this.allItems.slice(this.paginate.startIndex, this.paginate.endIndex + 1);
    // console.log(this.products);
    this.toTop();
  }

  toTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

}
