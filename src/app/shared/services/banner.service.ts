import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { Product, ProductTags } from '../classes/product';
import { BehaviorSubject, Observable, of, Subscriber, Subject} from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { DomainURL } from '../domainURL';
import { HttpClient } from '@angular/common/http';
import { BannerModel } from '../classes/banner';

// Get banner from Localstorage
const API_BARANG_URL = '/api/catalog/banner/';

@Injectable()

export class BannersService {

  // tslint:disable-next-line: no-inferrable-types
  public currency: string = 'Rp. ';
  public catalogMode: Boolean = false;

  public compareBanners: BehaviorSubject<BannerModel[]> = new BehaviorSubject([]);
  public observer:  Subscriber<{}>;

  public category: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public obserCategory = this.category.asObservable();

  // Initialize
// tslint:disable-next-line: deprecation
  constructor(private http: HttpClient, private toastrService: ToastrService, private localUrl: DomainURL) {
     // tslint:disable-next-line:no-shadowed-variable
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

  // Observable Banner Array
  private banners(): Observable<BannerModel[]> {
    return this.http.get<BannerModel[]>(this.getDomain() + 'banner');
    // return this.http.get(this.getDomain() + 'list').map((res: any) => res.json());
  }

  // Observable Banner Array
  public variantImage(): Observable<any[]> {
    return this.http.get<any[]>(this.getDomain() + 'imageVariant');
    // return this.http.get(this.getDomain() + 'imageVariant').map((res: any) => res.json());
 }

  // Get Banners
  public getBanners(): Observable<BannerModel[]> {
    return this.banners();
  }

  // Get Banners By Id
  public getBanner(id: number): Observable<BannerModel> {
  // tslint:disable-next-line: arrow-return-shorthand
    return this.http.get<BannerModel>(this.getDomain() + `detailpro/${id}`);
    // return this.http.get(this.getDomain() + `detailpro/${id}`).map((res: any) => res.json());
  }

  // Get Banners By brand
  public getBannerByBrand(id: number): Observable<BannerModel[]> {
    return this.getBanners().pipe(map(items =>
      items.filter((item: BannerModel) => {
          return item.id === id;

      })
    ));
  }

   // Get Banners By category
  public getBannerByallCategory(category: string): Observable<BannerModel[]> {
    return this.banners().pipe(map(items =>
       items.filter((item: BannerModel) => {
// tslint:disable-next-line: curly
        if (category === 'all')
        return item;

       })
     ));
  }

  // Get Banner BY Search
  public getBannerBySearch(search): Observable<BannerModel[]> {
    return this.http.get<BannerModel[]>(this.getDomain() + `search/${search}`);
    // return this.http.get(this.getDomain() + `search/${search}`).map((res: any) => res.json());
  }

}
