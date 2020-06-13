import { ChangeDetectionStrategy, Component, OnInit, Injectable, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { Product, ColorFilter, TagFilter } from '../../../../shared/classes/product';
import { ProductsService } from '../../../../shared/services/products.service';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { PaginationService } from '../../../../shared/classes/paginate';
import { DomainURL } from '../../../../shared/domainURL';
import { CategoryService } from '../../../../shared/services/category.service';
import { SettingService } from '../../../../shared/services/setting.service';
import { Observable } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { TitleCasePipe, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-collection-left-sidebar',
  templateUrl: './collection-left-sidebar.component.html',
  styleUrls: ['./collection-left-sidebar.component.scss'],
  providers: [TitleCasePipe],
  // changeDetection: ChangeDetectionStrategy.OnPush,
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
  ]
})
export class CollectionLeftSidebarComponent implements OnInit, OnDestroy {

  public products:   Product[] = [];
  public items:   Product[] = [];
  public allItems:   Product[] = [];
  private allProduct:   Product[] = [];
  public colorFilters:   ColorFilter[] = [];
  public tagsFilters:   any[] = [];
  public brand:   any[] = [];
  public colors:   any[] = [];
  // tslint:disable-next-line: no-inferrable-types
  public sortByOrder:   string = '';   // sorting
  public animation:   any;   // Animation
  paginate: any = {};
  page: number;
  imgCat: any;
  imgUrl: string = this.localUrl.domain;
  lastKey = '';     // key to offset next query from
  finished = false;  // boolean when end of data is reached
  parameter: any;
  public nameCat: any;
  public desCat: any;
  public category: boolean;
  catChil = false;
  public categoryChil: any[] = [];
  public setting: any;
  public parentChild: any;

  interval: any;

  constructor(private route: ActivatedRoute, private router: Router, private localUrl: DomainURL, private activatedRoute: ActivatedRoute,
    private productsService: ProductsService, private paginateService: PaginationService,
    private categoryService: CategoryService, private title: Title, private meta: Meta,
    private settingService: SettingService, private titlecasePipe: TitleCasePipe, @Inject(DOCUMENT) private document) {
      this.settingService.setting().subscribe(
        result => {
          this.setting = result;
        }
      );
       this.route.params.subscribe(params => {
        const id = params['id'];
        // console.log(id);
        this.parameter = id;
        if (id !== 'BestSeller' && id !== 'promoitem') {
          this.categoryService.getCategory(id).subscribe(
            result => {
              this.categoryChil = result;
              // console.log(this.categoryChil);
            }
          );
        }
        switch (id) {
          case 'BestSeller':
            return this.productsService.getProductsHomeBest().subscribe(products => {
              this.allItems = products;  // all products
              this.nameCat = 'Best Seller';
              this.imgCat = null;
              // console.log(this.allItems);
              this.category = true;
              this.setPage(1);
              });
              break;

          case 'all':
            return this.productsService.getProducts().subscribe(products => {
              this.allItems = products;  // all products
              // console.log(this.allItems);
              this.category = true;
              this.setPage(1);
              });
              break;
          
          case 'promoitem':
            return this.productsService.getPromoItems().subscribe(products => {
              this.allItems = products;
              this.category = true;
              this.nameCat = 'Promo Items This Month';
              this.imgCat = null;
              this.setPage(1);
            });
            break;

        default :
          return this.productsService.getProductCategory(id).subscribe(products => {
            this.title.setTitle(this.titlecasePipe.transform(products[0].nameCat) + ' | Vapehan Vape Store');
            // tslint:disable-next-line: no-angle-bracket-type-assertion
            const link = <HTMLLinkElement> (
              this.document.head.querySelector('link[rel=\'canonical\']')
              ) || this.document.head.appendChild(this.document.createElement('link'));
              link.rel = 'canonical';
              link.href = this.document.URL;
            this.meta.updateTag({ name: 'description', content: this.titlecasePipe.transform(products[0].desCat) });
            this.meta.updateTag({ name: 'keyword', content: this.titlecasePipe.transform(products[0].nameCat) + ', vape, liquid, coil, mod, pod' });
            this.meta.updateTag({ name: 'image', content: this.imgUrl + '/images/categories/' + products[0].imageCat });
            // tslint:disable-next-line: max-line-length
            this.meta.updateTag({ name: 'url', content: 'https://vapehan.com/home/product/collection/' + products[0].nameCat.replace(products[0].nameCat, products[0].nameCat.toLocaleLowerCase()).replace(' ', '-')});

            /* Sosial SEO */
            this.meta.updateTag({ property: 'og:site_name', content: 'Vapehan Vape Store' });
            // tslint:disable-next-line: max-line-length
            this.meta.updateTag({ property: 'og:url', content: 'https://vapehan.com/home/product/collection/' + products[0].nameCat.replace(products[0].nameCat, products[0].nameCat.toLocaleLowerCase()).replace(' ', '-')});
            this.meta.updateTag({ property: 'og:title', content: products[0].nameCat + ' | Vapehan Vape Store' });
            this.meta.updateTag({ property: 'og:description', content: products[0].desCat });
            this.meta.updateTag({ property: 'og:image', content: this.imgUrl + '/images/product/' + products[0].imageCat });
            this.meta.updateTag({ property: 'og:image:secure_url', content: this.imgUrl + '/images/product/' + products[0].imageCat });

            this.meta.addTag({ property: 'og:type', content: 'product' });
            // tslint:disable-next-line: max-line-length
            this.meta.addTag({ name: 'branch:deeplink:$ios_deeplink_path', content: 'https://vapehan.com' });
            // tslint:disable-next-line: max-line-length
            this.meta.addTag({ name: 'branch:deeplink:$android_deeplink_path', content: 'https://vapehan.com' });
            this.meta.addTag({ name: 'branch:deeplink:$desktop_url', content: 'https://vapehan.com' });
            this.meta.addTag({ name: 'robots', content: 'index, follow' });

          this.allItems = products;  // all products
          this.nameCat = products[0].nameCat;
          this.imgCat = products[0].imageCat;
          this.desCat = products[0].desCat;
          this.category = true;
          this.categoryService.getCategories().subscribe(
            result => {
              const fill = result.filter(x => x.name === products[0].nameCat);
              const parent = result.filter(x => x.id === fill[0].id_parent);
              this.parentChild = parent[0];
              // console.log(this.parentChild);
            }
          );
          // console.log(this.allItems);
          this.setPage(1);
        });

        }
       });
  }


  ngOnInit() {
    // console.log(this.parameter);
    if (this.sortByOrder === '') {
      this.sortByOrder = 'qty';
    }
    // console.log(this.allItems);
    return this.category = true;
  }

  ngOnDestroy() {
    this.title.setTitle('Vapehan Vape Store - Toko Vaporizer Jakarta Indonesia');
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    const link = <HTMLLinkElement> (
      this.document.head.querySelector('link[rel=\'canonical\']')
      ) || this.document.head.appendChild(this.document.createElement('link'));
      link.rel = 'canonical';
      link.href = 'https://vapehan.com/';
    this.meta.updateTag({ name: 'title', content: 'Vapehan Vape Store - Toko Vaporizer Jakarta Indonesia' });
    this.meta.updateTag({ name: 'description', content: 'Belanja online aman dan nyaman di vapehan, Duren Sawit, Kota Administrasi Jakarta Timur - One stop vapestore , stop smoking go vaping' });
    this.meta.updateTag({ name: 'keyword', content: 'vapehan vape store, vapehan store, vapehan, toko vape online, vape store indonesia, toko vape, vape store online indonesia vape, vape indonesia, vaporizer jakarta, indonesia vape store, toko vape terdekat, wholesale' });
    clearInterval(this.interval);
  }

  // Animation Effect fadeIn
  public fadeIn() {
      this.animation = 'fadeIn';
  }

  // Animation Effect fadeOut
  public fadeOut() {
      this.animation = 'fadeOut';
  }

  redirect(slug) {
    this.router.navigate(['/home/product/collection', slug], { relativeTo: this.activatedRoute });
  }

  // Update price filter
  public updatePriceFilters(price: any) {
    // console.log(price);
      const items: any[] = [];
      this.allItems.filter((item: Product) => {
       // console.log(item.price);
          if (item.price >= price[0] && item.price <= price[1] )  {
             items.push(item); // push in array
          }
      });
      // console.log(items);
      this.allProduct = items;
      this.paginate = this.paginateService.getPager(items.length, this.page);
      this.products = items.slice(this.paginate.startIndex, this.paginate.endIndex + 1);
  }

  public twoCol() {
    if ($('.product-wrapper-grid').hasClass('list-view')) {} else {
      $('.product-wrapper-grid').children().children().children().removeClass();
      $('.product-wrapper-grid').children().children().children().addClass('col-lg-6');
    }
  }

  public threeCol() {
    if ($('.product-wrapper-grid').hasClass('list-view')) {} else {
      $('.product-wrapper-grid').children().children().children().removeClass();
      $('.product-wrapper-grid').children().children().children().addClass('col-lg-4');
    }
  }

  public fourCol() {
    if ($('.product-wrapper-grid').hasClass('list-view')) {} else {
      $('.product-wrapper-grid').children().children().children().removeClass();
      $('.product-wrapper-grid').children().children().children().addClass('col-lg-3');
    }
  }

  public sixCol() {
    if ($('.product-wrapper-grid').hasClass('list-view')) {} else {
      $('.product-wrapper-grid').children().children().children().removeClass();
      $('.product-wrapper-grid').children().children().children().addClass('col-lg-2');
    }
  }

  // For mobile filter view
  public mobileFilter() {
    $('.collection-filter').css('left', '-15px');
  }

  // For mobile filter view
  public mobileFilterclose() {
    $('.collection-filter').css('left', '-350px');
  }

  // sorting type ASC / DESC / A-Z / Z-A etc.
  public onChangeSorting(val) {
     this.sortByOrder = val;
     this.animation === 'fadeOut' ? this.fadeIn() : this.fadeOut(); // animation
  }

  public setPage(page: number) {
    this.page = page;
    // get paginate object from service
    this.paginate = this.paginateService.getPager(this.allItems.length, page);
    // get current page of items
    this.products = this.allItems.slice(this.paginate.startIndex, this.paginate.endIndex + 1);
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
