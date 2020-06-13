import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../classes/category';
import { BehaviorSubject, Observable, of, Subscriber} from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { DomainURL } from '../domainURL';
import { HttpClient } from '@angular/common/http';

const API_CATEGORY_URL = '/api/catalog/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // public compareProducts: BehaviorSubject<Category[]> = new BehaviorSubject([]);
  public observer:  Subscriber<{}>;

  // Initialize
// tslint:disable-next-line: deprecation
  constructor(private http: HttpClient, private toastrService: ToastrService, private localUrl: DomainURL) {}

  getDomain(): string {
    return this.localUrl.domain + API_CATEGORY_URL;
  }

   // Observable Category Array
   public categories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.getDomain() + '/listing');
 }

 // Get Categories
 public getCategories(): Observable<Category[]> {
   return this.categories();
 }

 /*
 // Get Categories
 public getAllCategories() {
  return this.http.get(this.getDomain() + '/listing');
} */

 public getCategory(id): Observable<any[]> {
  return this.http.get<any[]>(this.getDomain() + '/category/' + id);
}
}
