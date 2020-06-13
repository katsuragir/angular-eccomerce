import { Component, OnInit, ViewChild, Injectable, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Product } from '../../../../shared/classes/product';
import { ProductsService } from '../../../../shared/services/products.service';
import { WishlistService } from '../../../../shared/services/wishlist.service';
import { CartService } from '../../../../shared/services/cart.service';
import { Observable, of, BehaviorSubject, Subscription, Subject } from 'rxjs';
import * as $ from 'jquery';
import { DomainURL } from '../../../../shared/domainURL';
import { environment } from 'src/environments/environment';
import { AuthLoginService } from '../../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { EmbedVideoService } from 'ngx-embed-video';
import { DomSanitizer, SafeResourceUrl, Meta, Title } from '@angular/platform-browser';
import { SettingService } from '../../../../shared/services/setting.service';
import { Customer } from '../../../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../shared/reducers';
import { currentUser } from '../../../../shared/selectors/auth.selectors';
import { Login } from '../../../../shared/actions/auth.actions';
import { TitleCasePipe, DOCUMENT } from '@angular/common';
import { VoucherService } from '../../../../shared/services/voucher.service';
import { Vouchers } from '../../../../shared/classes/voucher';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-product-left-sidebar',
  templateUrl: './product-left-sidebar.component.html',
  styleUrls: ['./product-left-sidebar.component.scss'],
  providers: [TitleCasePipe]
})
export class ProductLeftSidebarComponent implements OnInit, OnDestroy {

  public product:   Product ;
  public products:   Product[] = [];
  // tslint:disable-next-line: no-inferrable-types
  public counter:   number = 1;
  public selectedSize:   any = '';
  youtubeUrl: SafeResourceUrl;
  youtubeId: string;
  authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
  public type: string;

  imgUrl: string = this.localUrl.domain;
  private akses: any;
  private customer: any;
  returnURL: string;
  id_product: number;
  private images: any;
  hideScrollbar;
  disabled;
  xDisabled;
  yDisabled;
  leftNavDisabled = false;
  rightNavDisabled = false;
  index = 0;
  imagePreview: string;
  ctname: boolean;
  public vouchers: Vouchers[] = [];

  public slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
  };

  public slideNavConfig = {
    vertical: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.product-slick',
    arrows: false,
    dots: false,
    focusOnSelect: true
  };

  detailProd: string;
  descProd: string;
  show = true;
  setup: any;
  setting$: Observable<any>;
  customer$: Observable<Customer>;
  post: any;
  interval: any;
  ongkir = false;
  payment = false;
  // @ViewChild('nav', { read: DragScrollComponent, static: true }) ds: DragScrollComponent;

  // Get Product By Id
  constructor(private route: ActivatedRoute, private router: Router, private embedService: EmbedVideoService,
    public productsService: ProductsService, private wishlistService: WishlistService, private store: Store<AppState>,
    private cartService: CartService, private localUrl: DomainURL, private auth: AuthLoginService,
    private sanitizer: DomSanitizer, private meta: Meta, private title: Title, private titlecasePipe: TitleCasePipe,
    private toastrService: ToastrService, private settingService: SettingService, private voucherService: VoucherService, @Inject(DOCUMENT) private document) {
      this.setting$ = this.settingService.setting();
      this.productsService.obserCategory.subscribe(
        result => this.ctname = result
      );
      this.settingService.setting$.subscribe( res => { this.setup = res; });
    }

  ngOnInit() {
    this.voucherService.getAllVouchers().subscribe(
      res => {
        this.vouchers = res;
        const ongkir: any[] = res.filter(x => x.type === 'ongkir');
        const pay: any[] = res.filter(x => x.type === 'pembayaran');

        if (ongkir.length > 0) {
          this.ongkir = true;
        }

        if (pay.length > 0) {
          this.payment = true;
        }
      }
    );
    const postId = this.route.snapshot.paramMap.get('id');

    fetch(`https://api.vapehan.com/api/api/catalog/product/detailpro/slug/${postId}`)
      .then(response => response.json())
      .then(post => {
        this.post = post;
        // console.log(post);

        let name = '';

        if (!this.post.nic || this.post.nic === 'null' || this.post.nic === null ||  this.post.nic === '') {
          name = 'Jual ' + this.titlecasePipe.transform(this.post.name) + ' ' + this.titlecasePipe.transform(this.post.color);
        } else if (!this.post.color || this.post.color === 'null' || this.post.color === null ||  this.post.color === '') {
          name = 'Jual Liquid ' + this.titlecasePipe.transform(this.post.name) + ' ' + this.post.nic;
        } else {
          name = 'Jual ' + this.titlecasePipe.transform(this.post.name);
        }

        /* Temporary SEO */
        this.title.setTitle(name + ' | Vapehan Vape Store');
        this.meta.updateTag({ name: 'title', content: name + ' | Vapehan Vape Store' });
        this.meta.updateTag({ name: 'description', content: post.descr });
        this.meta.updateTag({ name: 'keyword', content: post.name + ', ' + post.color + ', ' + post.nic + ', vape, liquid, coil, mod, pod' });
        this.meta.addTag({ name: 'image', content: this.imgUrl + '/images/product/' + post.image });
        this.meta.addTag({ name: 'url', content: 'https://vapehan.com/home/product/' + post.slug });

        /* Sosial SEO */
        this.meta.updateTag({ property: 'og:site_name', content: 'Vapehan Vape Store' });
        this.meta.updateTag({ property: 'og:url', content: 'https://vapehan.com/home/product/' + post.slug });
        this.meta.updateTag({ property: 'og:title', content: name + ' | Vapehan Vape Store' });
        this.meta.updateTag({ property: 'og:description', content: post.descr });
        this.meta.updateTag({ property: 'og:image', content: 'https://api.vapehan.com/api/api/images/' + post.image });
        this.meta.updateTag({ property: 'og:image:secure_url', content: 'https://api.vapehan.com/api/api/images/' + post.image });
      });

    this.auth.refreshNeeded$.subscribe(() => {
      this.refreshData();
    });
    this.customer$ = this.store.pipe(select(currentUser));
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.productsService.getProductSlug(id).subscribe(product => {
        if (!product) {
          this.router.navigate(['/pages/404']);
        }
        let name = '';

        if (!product.nic || product.nic === 'null' || product.nic === null ||  product.nic === '') {
          name = 'Jual ' + this.titlecasePipe.transform(product.name) + ' ' + this.titlecasePipe.transform(product.color);
        } else if (!product.color || product.color === 'null' || product.color === null ||  product.color === '') {
          name = 'Jual Liquid ' + this.titlecasePipe.transform(product.name) + ' ' + product.nic;
        } else {
          name = 'Jual ' + this.titlecasePipe.transform(product.name);
        }

        // Javascript SEO
        this.title.setTitle(name + ' | Vapehan Vape Store');
        // tslint:disable-next-line: no-angle-bracket-type-assertion
        const link = <HTMLLinkElement> (
          this.document.head.querySelector('link[rel=\'canonical\']')
          ) || this.document.head.appendChild(this.document.createElement('link'));
        link.rel = 'canonical';
        link.href = this.document.URL;
        this.meta.updateTag({ name: 'title', content: name + ' | Vapehan Vape Store' });
        this.meta.updateTag({ name: 'description', content: this.titlecasePipe.transform(name) + ' ' + product.descr });
        this.meta.updateTag({ name: 'keyword', content: name + ', vape, liquid, coil, mod, pod, vapehan' });
        // this.meta.updateTag({ name: 'url', content: 'https://vapehan.com' });

        /* Sosial SEO */
        this.meta.updateTag({ property: 'og:site_name', content: 'Vapehan Vape Store' });
        this.meta.updateTag({ property: 'og:url', content: 'https://vapehan.com/home/product/' + product.slug });
        this.meta.updateTag({ property: 'og:title', content: name + ' | Vapehan Vape Store' });
        this.meta.updateTag({ property: 'og:description', content: this.titlecasePipe.transform(product.name) + ' ' + product.descr });
        this.meta.updateTag({ property: 'og:image', content: this.imgUrl + '/images/product/' + product.image });
        this.meta.updateTag({ property: 'og:image:secure_url', content: this.imgUrl + '/images/product/' + product.image });
        this.meta.addTag({ property: 'og:type', content: 'product' });
        this.meta.addTag({ property: 'product:price:amount', content: product.price.toString() });
        this.meta.addTag({ property: 'product:price:currency', content: 'Rp ' });
        // tslint:disable-next-line: max-line-length
        this.meta.addTag({ name: 'branch:deeplink:$ios_deeplink_path', content: 'https://vapehan.com/home/product/' + product.slug });
        // tslint:disable-next-line: max-line-length
        this.meta.addTag({ name: 'branch:deeplink:$android_deeplink_path', content: 'https://vapehan.com/home/product/' + product.slug });
        this.meta.addTag({ name: 'branch:deeplink:$desktop_url', content: 'https://vapehan.com/home/product/' + product.slug });
        this.meta.addTag({ name: 'robots', content: 'index, follow' });
        this.meta.addTag({ itemprop: 'ratingValue', content: '5.0' });
        this.meta.addTag({ itemprop: 'bestRating', content: '5' });
        this.meta.addTag({ itemprop: 'worstRating', content: '1' });
        this.meta.addTag({ itemprop: 'ratingCount', content: '10' });
        this.meta.addTag({ itemprop: 'reviewCount', content: '10' });

        if (product.video === null || product.video === '' || product.video === 'null') {
          this.show = false;
        }
        this.imagePreview =  this.imgUrl + '/images/product/' + product.image;
        this.product = product;
        this.detailProd = product.summary;
        this.descProd = product.description;
        this.id_product = product.id;
        // console.log(this.product);
        this.youtubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + product.video);
        this.youtubeId = product.video;
        this.productsService.getVariantImage(product.id).subscribe(
        image => {
          this.images = image;
          // console.log(this.images);
        }
      );
      });
    });
    this.productsService.getProducts().subscribe(product => this.products = product);
    // console.log(this.ctname);
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
    this.ongkir = false;
    this.payment = false;
  }

  refreshData() {
    this.store.dispatch(new Login({authToken: this.customer.accessToken}));
  }

  clickItem(item) {
    this.imagePreview =  this.imgUrl + '/images/product/' + item;
    // console.log('item clicked' + item);
  }

  leftBoundStat(reachesLeftBound: boolean) {
    this.leftNavDisabled = reachesLeftBound;
  }

  rightBoundStat(reachesRightBound: boolean) {
    this.rightNavDisabled = reachesRightBound;
  }

  onSnapAnimationFinished() {
    // console.log('snap animation finished');
  }

  onIndexChanged(idx) {
    this.index = idx;
    // console.log('current index: ' + idx);
  }

  onDragScrollInitialized() {
    // console.log('first demo drag scroll has been initialized.');
  }

  onDragStart() {
    // console.log('drag start');
  }

  onDragEnd() {
    // console.log('drag end');
  }

  // product zoom
  onMouseOver(): void {
    document.getElementById('p-zoom').classList.add('product-zoom');
  }

  onMouseOut(): void {
    document.getElementById('p-zoom').classList.remove('product-zoom');
  }

  public increment(product: Product) {
      this.counter += 1;
      if (this.counter >= product.stock) {
        this.toastrService.error('Not Enough Stock');
        return;
      }
  }

  public decrement() {
      if (this.counter > 1 ) {
         this.counter -= 1;
      }
  }

  // For mobile filter view
  public mobileSidebar() {
    $('.collection-filter').css('left', '-15px');
  }

  // Add to cart
  public addToCart(product: Product, quantity) {
    if (product.stock <= 0) {
      return;
    }
    if (product.stock < quantity) {
      this.toastrService.error('Not Enough Stock');
      return;
    }
    this.akses = localStorage.getItem(this.authTokenKey);
    this.returnURL = this.route.snapshot.queryParams['returnURL'] || '/home/product/' + this.id_product;
      if (!this.akses) {
        this.router.navigate(['/pages/login'], { queryParams: { returnUrl: this.returnURL }});
      }
      // tslint:disable-next-line: curly
      if (quantity === 0) return false;
      this.customer$.subscribe(
        result => {
          this.customer = result;
          let harga: number;
          if (product.discount) {
            harga = product.harga_disc;
          } else {
            harga = product.price;
          }
          const data = {
            id_product: product.id,
            harga: harga,
            quantity: quantity,
            id_customer: result.id_customer
          };
          this.cartService.addToCart(data).subscribe();
          // this.setting.ngOnInit();
          // this.toastrService.success('This product has been added.');
      });

// tslint:disable-next-line: radix
   // console.log(product);
    // tslint:disable-next-line: radix
    // this.cartService.addToCart(product, parseInt(quantity));
  }

  // Add to cart
  public buyNow(product: Product, quantity) {
    if (product.stock <= 0) {
      return;
    }
    if (product.stock < quantity) {
      this.toastrService.error('Not Enough Stock');
      return;
    }
    this.akses = localStorage.getItem(this.authTokenKey);
    this.returnURL = this.route.snapshot.queryParams['returnURL'] || '/home/product/' + this.id_product;
      if (!this.akses) {
        this.router.navigate(['/pages/login'], { queryParams: { returnUrl: this.returnURL }});
      }
      // tslint:disable-next-line: curly
      if (quantity > 0)
        this.customer$.subscribe(
          result => {
            this.customer = result;
            let harga: number;
            if (product.discount) {
              harga = product.harga_disc;
            } else {
              harga = product.price;
            }
            const data = {
              id_product: product.id,
              harga: harga,
              quantity: quantity,
              id_customer: result.id_customer
            };
            this.cartService.addToCart(data).subscribe();
            // this.setting.ngOnInit();
            // this.toastrService.success('This product has been added.');
        });

     // tslint:disable-next-line:curly
     // if (quantity > 0)
       // tslint:disable-next-line:radix
      //  this.cartService.addToCart(product, parseInt(quantity));
       this.router.navigate(['/home/checkout']);
  }

  // Add to wishlist
  public addToWishlist(product: Product) {
     this.wishlistService.addToWishlist(product);
  }


  // Change size variant
  public changeSizeVariant(variant) {
     this.selectedSize = variant;
  }

}
