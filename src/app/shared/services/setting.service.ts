import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Customer } from '../classes/customer';
import { Observable, of, BehaviorSubject, Subject, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { find } from 'lodash';
import { Biodata } from '../classes/biodata';
import { Md5 } from 'ts-md5';
import { environment } from '../../../environments/environment';
import { AuthNoticeService } from './auth-notice.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { DomainURL } from '../domainURL';


const API_SETTING = '/api/setting';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  // private currentCustomerSubject: BehaviorSubject<Customer>;
  // public customerLogin: Observable<Customer>;
  private _refreshNeeded$ = new Subject<void>();
  get refreshNeeded$() {
    return this._refreshNeeded$;
  }
  public setting$: Observable<any>;
  public isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient,
    private translate: TranslateService,
    private router: Router,
    private localUrl: DomainURL) {
      this.setting$ = this.setting();
  }

  getDomain(): string {
    return this.localUrl.domain + API_SETTING;
  }


  /**
   * Get All Setting
   */
  setting(): Observable<any> {
    return this.http.get<any>(this.getDomain());
  }

  donasicovid(): Observable<any> {
    return this.http.get<any>(this.getDomain() + '/count/donasi/covid');
  }

  /**
   * Traffic
   */
  traffic(visitor): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    // console.log(visitor);
    return this.http.post<any>(this.getDomain() + '/new/visitor', visitor, { headers: httpHeaders });
  }

  getIptrafic(visit): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<any>(this.getDomain() + '/get/visitor', visit, { headers: httpHeaders });
  }


  /**
   * GET IP PUBLIC
   */
  getIpAddress(): Observable<any> {
    return this.http.get<any>('https://api.ipify.org/?format=json').pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

}
