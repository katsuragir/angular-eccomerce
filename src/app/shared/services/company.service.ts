import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../classes/category';
import { BehaviorSubject, Observable, of, Subscriber} from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { DomainURL } from '../domainURL';
import { HttpClient } from '@angular/common/http';

const API_Company_URL = '/api/auth/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  // public compareProducts: BehaviorSubject<Company[]> = new BehaviorSubject([]);
  public observer:  Subscriber<{}>;

  // Initialize
// tslint:disable-next-line: deprecation
  constructor(private http: HttpClient, private toastrService: ToastrService, private localUrl: DomainURL) {}

  getDomain(): string {
    return this.localUrl.domain + API_Company_URL;
  }

   // Observable Company Array
   private company(): Observable<any> {
    return this.http.get<any>(this.getDomain());
 }

 // Get Categories
 public getCompanyProfile(): Observable<any> {
   return this.company();
 }
}
