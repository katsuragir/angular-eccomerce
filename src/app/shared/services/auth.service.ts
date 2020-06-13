import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Customer } from '../classes/customer';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { find } from 'lodash';
import { Biodata } from '../classes/biodata';
import { Md5 } from 'ts-md5';
import { environment } from '../../../environments/environment';
import { AuthNoticeService } from './auth-notice.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { DomainURL } from '../domainURL';


const API_CUSTOMER = '/api/customer/register';

@Injectable({
  providedIn: 'root'
})
export class AuthLoginService {
  // private currentCustomerSubject: BehaviorSubject<Customer>;
  // public customerLogin: Observable<Customer>;
  private _refreshNeeded$ = new Subject<void>();

  public customers = [];

  private custSubject$: BehaviorSubject<any[]> = new BehaviorSubject(this.customers);

  readonly cust$: Observable<any[]> = this.custSubject$.asObservable();

  // Array
  public SocialLoginDetails;

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }
  public isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient,
    private authNoticeService: AuthNoticeService,
    private translate: TranslateService,
    private router: Router,
    private localUrl: DomainURL) {
    /*
    this.currentCustomerSubject = new BehaviorSubject<Customer>(JSON.parse(localStorage.getItem('customerLogin')));
    this.customerLogin = this.currentCustomerSubject.asObservable();
    */
  }

  getDomain(): string {
    return this.localUrl.domain + API_CUSTOMER;
  }

  public load(): void {
    this.customer().subscribe(
      result => {
          if (result) {
              this.customers = result;

              this.custSubject$.next(this.customers);
          } else {
              this.customers = [];

              this.custSubject$.next(this.customers);
          }
      }
  );
}

  /*
  public get currentCustomerValue(): Customer {
    return this.currentCustomerSubject.value;
  }
  */
  /**
   * Fetch all customer
   */
  customer(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.getDomain());
  }

  /**
   * Fetch all customer email
   */
  allemail(): Observable<any[]> {
    return this.http.get<any[]>(this.getDomain() + '/all/email');
  }

  /**
   * Fetch Biodata customer
   */
  customerInfo(): Observable<Biodata[]> {
    return this.http.get<Biodata[]>(this.getDomain() + '/info/all');
  }

  /**
   * Find Account customer
   */
  findAccount(token: string): Observable<Customer[]> {
    const url = this.localUrl.domain + '/api/customer/register/find/account/';
    return this.http.get<Customer[]>(url + token);
  }

  /**
   * Find Account customer
   */
  GetPassword(token: string): Observable<any> {
    const url = this.localUrl.domain + '/api/customer/register/find/account/';
    return this.http.get<any>(url + token);
  }

  /**
   * Verify customer account
   */
  verifiAccount(accessToken: string) {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    const url = this.localUrl.domain + '/api/customer/register/verify/';
    return this.http.put(url + accessToken, { headers: httpHeaders });
  }

  /**
   * active account
   */
  activeAccount(id: number) {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    // const id = formdata.id;
    const url = this.localUrl.domain + '/api/customer/register/active/';
    return this.http.put(url + id, { headers: httpHeaders });
  }

  /**
   * Register form
   */
  register(customer: Customer): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<Customer>(this.getDomain(), customer, { headers: httpHeaders });
  }

  /**
   * Biodata Form
   */
  biodata(formdata) {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post(this.getDomain() + '/info', formdata, { headers: httpHeaders });
  }

  /**
   * login
   */
  loginReg(email: string, password: string): Observable<Customer> {
    if (!email || !password) {
        return of(null);
    }

    return  this.customer().pipe(
        map((result: Customer[]) => {
            if (result.length <= 0) {
                return null;
            }
            const customer = find(result, function(item: Customer) {
                return (item.email.toLowerCase() === email.toLowerCase() && item.password === password);
            });

            if (!customer) {
              this.authNoticeService.setNotice(this.translate.instant('Login Fail, Email and Password didn`t match'), 'danger');
              return null;
            }

            customer.password = undefined;
            return customer;
        })
    );
  }

  // Authentication/Authorization
  login(email: string, password: string): Observable<any> {
    if (!email || !password) {
        return of(null);
    }
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');

    const data = {
      email: email,
      password: Md5.hashStr(password)
    };

    return this.http.post<any>(this.getDomain() + '/login/customer', data, { headers: httpHeaders });

    /*
    return  this.customer().pipe(
        map((result: Customer[]) => {
            if (result.length <= 0) {
              this.authNoticeService.setNotice(this.translate.instant('Login Fail, This email is not registered'), 'danger');
                return null;
            }
            const _password = Md5.hashStr(password);

            const cemail = find(result, function(item: Customer) {
              return (item.email.toLowerCase() === email.toLowerCase());
            });

            const google = find(result, function(item: Customer) {
              return (item.email.toLowerCase() === email.toLowerCase());
            });

            const customer = find(result, function(item: Customer) {
                return (item.email.toLowerCase() === email.toLowerCase() && item.password === _password);
            });

            if (!cemail) {
              this.authNoticeService.setNotice(this.translate.instant('Login Fail, This email is not registered'), 'danger');
                return null;
            }

            if (google.google === 1) {
              this.authNoticeService.setNotice(this.translate.instant('Please login with google'), 'danger');
              return null;
            }

            if (!customer) {
              this.authNoticeService.setNotice(this.translate.instant('Login Fail, Email and Password didn`t match'), 'danger');
              return null;
            }

            if (customer.verification === 0) {
              // tslint:disable-next-line: max-line-length
              this.authNoticeService.setCustomer(customer);
              this.authNoticeService.setNotice(this.translate.instant(`Login Fail, Please Verification Your Account`), 'danger');
              this.resend(customer);
              return null;
            }

            customer.password = undefined;
            this.authNoticeService.setCustomer(customer);
            return customer;
        })
    );
    */
  }

  loginGoogle(email: string): Observable<Customer> {
    if (!email) {
        return of(null);
    }

    return  this.customer().pipe(
        map((result: Customer[]) => {
            if (result.length <= 0) {
              this.authNoticeService.setNotice(this.translate.instant('Login Fail, This email is not registered'), 'danger');
                return null;
            }

            const customer = find(result, function(item: Customer) {
                return (item.email.toLowerCase() === email.toLowerCase() && item.google === 1);
            });

            if (!customer) {
              this.authNoticeService.setNotice(this.translate.instant('Login Fail, This email is not found'), 'danger');
              return null;
            }

            this.authNoticeService.setCustomer(customer);
            return customer;
        })
    );
  }

  resend(customer) {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post(this.getDomain() + '/resend/verification', customer, { headers: httpHeaders });
  }

  /**
   * Dapatkan User berdasarkan acces token
   */
  getUserByToken(): Observable<Customer> {
    const authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
    const userToken = localStorage.getItem(authTokenKey);
    if (!userToken) {
        return of(null);
    }

    return this.customer().pipe(
        map((result: Customer[]) => {
            if (result.length <= 0) {
                return null;
            }

            const customer = find(result, function(item: Customer) {
                return (item.accessToken === userToken.toString());
            });

            if (!customer) {
                return null;
            }

            customer.password = undefined;
            return customer;
        })
    );
  }

  /**
   * Forget Password
   */
  sendMail(dataAkun) {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    const id = dataAkun.id;
    return this.http.post(this.getDomain() + `/forget/send/${id}`, dataAkun, { headers: httpHeaders });
  }

  /**
   * Account edit address
   */
  accountEditaddress(user): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    const id = user.id;
    return this.http.put(this.getDomain() + `/account/address/${id}`, user, { headers: httpHeaders }).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  /**
   * Account edit info
   */
  accountEditinfo(user): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    const id = user.id;
    return this.http.put(this.getDomain() + `/account/info/${id}`, user, { headers: httpHeaders }).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  /**
   * Account edit info
   */
  accountEditprofile(user): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    const id = user.id;
    return this.http.put(this.getDomain() + `/account/profile/${id}`, user, { headers: httpHeaders }).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  /**
   * Account contact edit
   */
  accountContactedit(user): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    const id = user.id;
    return this.http.put(this.getDomain() + `/account/contact/${id}`, user, { headers: httpHeaders }).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  /**
   * Account change password
   */
  accountChangepassword(data): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    const id = data.id;
    return this.http.put(this.getDomain() + `/account/password/${id}`, data, { headers: httpHeaders });
  }

  /**
   * find customer
   */
  findAccountById(id): Observable<Biodata[]> {
    return this.http.get<Biodata[]>(this.getDomain() + `/account/${id}`);
  }

  /**
   * Add address account
   */
  addAccountaddress(data): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    const id = data.id;
    return this.http.post(this.getDomain() + `/account/address/${id}`, data, { headers: httpHeaders });
  }

  /**
   * Massage Contact Us
   */
  sendMassageEmail(data): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post(this.getDomain() + `/send/massage/contact`, data, { headers: httpHeaders });
  }

}
