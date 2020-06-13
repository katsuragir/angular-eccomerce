import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { Product, ProductTags } from '../classes/product';
import { BehaviorSubject, Observable, of, Subscriber, Subject} from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { DomainURL } from '../domainURL';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Get product from Localstorage
const products = JSON.parse(localStorage.getItem('compareItem')) || [];
const API_BARANG_URL = '/api/catalog/product/';

@Injectable()

export class ProductsService {

  // tslint:disable-next-line: no-inferrable-types
  public currency: string = 'Rp. ';
  public catalogMode: Boolean = false;

  public compareProducts: BehaviorSubject<Product[]> = new BehaviorSubject([]);
  public observer:  Subscriber<{}>;

  public category: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public obserCategory = this.category.asObservable();

  // Initialize
// tslint:disable-next-line: deprecation
  constructor(private http: HttpClient, private toastrService: ToastrService, private localUrl: DomainURL) {
     // tslint:disable-next-line:no-shadowed-variable
     this.compareProducts.subscribe(products => products = products);
  }

  private _refreshNeed$ = new Subject<void>();

  get refreshNeed() {
    return this._refreshNeed$;
  }

  getDomain(): string {
    return this.localUrl.domain + API_BARANG_URL;
  }

  public parameterCategory(ct: boolean) {
    return this.category.next(ct);
  }

  // Observable Product Array
  private products(): Observable<Product[]> {
    return this.http.get<Product[]>(this.getDomain() + 'list');
    // return this.http.get(this.getDomain() + 'list').map((res: any) => res.json());
  }

  // Observable Product Array
  public variantImage(): Observable<any[]> {
    return this.http.get<any[]>(this.getDomain() + 'imageVariant');
    // return this.http.get(this.getDomain() + 'imageVariant').map((res: any) => res.json());
 }

  // Get Products
  public getProducts(): Observable<Product[]> {
    return this.products();
  }


  // Get Products
  public getPromoItems(): Observable<Product[]> {
    return this.getProductsHomeFea();
  }

  // Get Product for home
  public getProductsHomeNew(): Observable<Product[]> {
    return this.http.get<Product[]>(this.getDomain() + 'home/new');
    // return this.http.get(this.getDomain() + 'home/new').map((res: any) => res.json());
  }

  // Get Product for home
  public getProductsHomeBest(): Observable<Product[]> {
    return this.http.get<Product[]>(this.getDomain() + 'home/best');
    // return this.http.get(this.getDomain() + 'home/best').map((res: any) => res.json());
  }

  // Get Product for home
  public getBestProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.getDomain() + 'bestProd');
    // return this.http.get(this.getDomain() + 'home/best').map((res: any) => res.json());
  }

  // Get Product for home
  public getProductsHomeFea(): Observable<Product[]> {
    return this.http.get<Product[]>(this.getDomain() + 'home/feat');
    // return this.http.get(this.getDomain() + 'home/feat').map((res: any) => res.json());
  }

  // Get Products By Id
  public getProduct(id: number): Observable<Product> {
  // tslint:disable-next-line: arrow-return-shorthand
    return this.http.get<Product>(this.getDomain() + `detailpro/${id}`);
    // return this.http.get(this.getDomain() + `detailpro/${id}`).map((res: any) => res.json());
  }

  // Get Products By Id
  public getProductSlug(id: number): Observable<Product> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('provider', 'test');
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http.get<Product>(this.getDomain() + `detailpro/slug/${id}`, {headers: httpHeaders});
    // return this.http.get(this.getDomain() + `detailpro/slug/${id}`).map((res: any) => res.json());
    }

  // Get Products By Id
  public getVariantImage(id): Observable<any[]> {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http.get<any[]>(this.getDomain() + `detailpro/variantImage/${id}`);
    // return this.http.get(this.getDomain() + `detailpro/variantImage/${id}`).map((res: any) => res.json());
  }

  // Observable Product Array
  public getProductCategory(id): Observable<Product[]> {
    return this.http.get<Product[]>(this.getDomain() + `categories/${id}`)
    .pipe(
      map(data => data)
    );
    // return this.http.get(this.getDomain() + `categories/${id}`).map((res: any) => res.json());
 }
 /*
   // Get Products By category
  public getProductByCategory(id: number): Observable<Product[]> {
    return this.getProductCategory().pipe(map(items =>
       items.filter((item: Product) => {
         // console.log(items);
         console.log(item);
           return item.id_category === id || item.id_parent === id;

       })
     ));
  }
  */
   // Get Products By brand
   public getProductByBrand(id: number): Observable<Product[]> {
    return this.getProducts().pipe(map(items =>
       items.filter((item: Product) => {
           return item.id_brand === id;

       })
     ));
  }

   // Get Products By category
  public getProductByallCategory(category: string): Observable<Product[]> {
    return this.products().pipe(map(items =>
       items.filter((item: Product) => {
// tslint:disable-next-line: curly
        if (category === 'all')
        return item;

       })
     ));
  }

  // Get Product BY Search
  public getProductBySearch(search): Observable<Product[]> {
    return this.http.get<Product[]>(this.getDomain() + `search/${search}`);
    // return this.http.get(this.getDomain() + `search/${search}`).map((res: any) => res.json());
  }

  // Get Brand
  public brands(): Observable<ProductTags[]> {
    const URL = this.localUrl.domain + '/api/catalog/brand/';
    return this.http.get<ProductTags[]>(URL);
  }

  // Get Distributor
  public distributors(): Observable<any[]> {
    const URL = this.localUrl.domain + '/api/dist/distributor/list';
    return this.http.get<any[]>(URL);
  }

   /*
      ---------------------------------------------
      ----------  Compare Product  ----------------
      ---------------------------------------------
   */

  // Get Compare Products
  public getComapreProducts(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(products);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  // If item is aleready added In compare
  public hasProduct(product: Product): boolean {
// tslint:disable-next-line: no-shadowed-variable
    const item = products.find(item => item.id === product.id);
    return item !== undefined;
  }

  // Add to compare
  public addToCompare(product: Product): Product | boolean {
    let item: Product | boolean = false;
    if (this.hasProduct(product)) {
// tslint:disable-next-line: no-shadowed-variable
      item = products.filter(item => item.id === product.id)[0];
      const index = products.indexOf(item);
    } else {
      // tslint:disable-next-line:curly
      if (products.length < 4)
        products.push(product);
      // tslint:disable-next-line:curly
      else
        this.toastrService.warning('Maximum 4 products are in compare.'); // toasr services
    }
      localStorage.setItem('compareItem', JSON.stringify(products));
      return item;
  }

  // Removed Product
  public removeFromCompare(product: Product) {
    if (product === undefined) { return; }
    const index = products.indexOf(product);
    products.splice(index, 1);
    localStorage.setItem('compareItem', JSON.stringify(products));
  }

}
