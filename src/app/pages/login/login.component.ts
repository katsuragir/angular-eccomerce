import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthLoginService } from '../../shared/services/auth.service';
import { AuthNoticeService } from '../../shared/services/auth-notice.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { first, tap, takeUntil, finalize } from 'rxjs/operators';
import { find } from 'lodash';
import { Store } from '@ngrx/store';
import { AppState } from '../../shared/reducers/index';
import { Login } from '../../shared/actions/auth.actions';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AuthService, SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { Customer } from '../../shared/classes/customer';
import { DatePipe } from '@angular/common';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ DatePipe ]
})
export class LoginComponent implements OnInit, OnDestroy {
  message: any = [];
  loginForm: FormGroup;
  loading = false;
  isLoggedIn$: Observable<boolean>;
  errors: any = [];
  private returnUrl: any;
  private akses: any;
  user: SocialUser;
  loggedIn: boolean;
  customer: any = [];
  pesan: any;

  private unsubscribe: Subject<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private auth: AuthLoginService,
    private authNoticeService: AuthNoticeService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService,
    private authService: AuthService,
    private datePipe: DatePipe,
  ) {
    const authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
    this.akses = localStorage.getItem(authTokenKey);
    if (this.akses) {
      this.router.navigate(['/']);
    }
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        return this.auth.verifiAccount(id).subscribe(
          res => {
            if (res) {
              return this.toastrService.success('Activate Account Success');
            } else {
              return this.toastrService.error('Activate Account Fail');
            }
          }
        );
      }
    });
    /*
    // redirect to home if already logged in
    if (this.auth.currentCustomerValue) {
      this.router.navigate(['/']);
    }
    */
   }

  ngOnInit(): void {
    this.auth.allemail().subscribe(
      emails => {
        if (emails.length > 0) {
          this.customer = emails;
        }
      }
    );
    /*
    this.activatedRoute.params.subscribe(params => {
      const token = params['id'];
      this.auth.verifiAccount(token).subscribe(
        res => {
          this.message = res;
        }
      );
    });
    */
    this.authService.authState.subscribe((user) => {
      this.user = user;
      // console.log(this.user);
      this.loggedIn = (user != null);
    });
    this.initLoginForm();
    // redirect back to the returnUrl before login
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
    this.pesan = 'Jika mengalami kesulitan saat Login, Register, maupun Verifikasi. Di mohon untuk menghubungin admin kami melalu fitur chat yang tersedia atau melalui <a href="https://wa.me/6281296551818?text=Hai%20Vapehan%20" target="_blank">link ini</a> agar segera kami proses.';
  }

  /**
	 * On destroy
	 */
  ngOnDestroy(): void {
    this.authNoticeService.setNotice(null);
    this.loading = false;
  }

  /**
   * Form initalization
   * default params, validators
   */
  initLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(10),
        Validators.maxLength(320)
      ])
    ],
    password: ['', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ])
  ]
    });
  }

  /**
   * submit login
   */
  submit() {
    const controls = this.loginForm.controls;

    // check form
    if (this.loginForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.loading = true;

    const authData = {
      email: controls['email'].value,
      password: controls['password'].value
    };

    this.loading = true;
    this.auth.login(authData.email, authData.password).subscribe(
      result => {
        if (result.text === 'Please, Login with google') {
          this.authNoticeService.setNotice(this.translate.instant('Please login with google'), 'danger');
          return;
        }

        if (result.text === 'Email or password does`t match') {
          this.authNoticeService.setNotice(this.translate.instant('Login Fail, Email and Password didn`t match'), 'danger');
          return;
        }

        if (result.text === 'Login Fail, Please Verification Your Account') {
          result.password = undefined;
          // tslint:disable-next-line: max-line-length
          this.authNoticeService.setCustomer(result);
          this.authNoticeService.setNotice(this.translate.instant(`Login Fail, Please Verification Your Account`), 'danger');
          this.auth.resend(result).subscribe();
          return;
        }

        if (!result.text) {
          result.password = undefined;
          this.store.dispatch(new Login({authToken: result.accessToken}));
          this.router.navigateByUrl(this.returnUrl); // home
          location.reload();
        }
      }
    );
  }

  /**
   * Google Sign In
   */
  signinWithGoogle() {
    // console.log('test');
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(() => this.signin());
    // this.router.navigateByUrl('/pages/register');
  }

  signupWithGoogle() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(() => this.signup());
  }

  signup() {
    return this.authService.authState.subscribe((user) => {
      this.user = user;
      this.auth.SocialLoginDetails = user;
      // console.log(this.user);
      this.loggedIn = (user != null);

      const custom = find(this.customer, function(item: any) {
        return (item.kd_e === Md5.hashStr(user.email.toLowerCase()));
      });

      if (custom) {
        this.toastrService.error('Email Already Register', 'danger');
        this.authService.signOut();
        return;
      } else {
        const auth = user.provider;
        localStorage.setItem(auth.toLowerCase(), JSON.stringify(user));
        this.register();
      }

    });
  }

  register() {
    if (localStorage.getItem('google') || this.user) {
      const user = JSON.parse(localStorage.getItem('google')) || this.user;

      const _customer: Customer = new Customer;
      _customer.clear();
      _customer.firstname = user.firstName;
      _customer.lastname = user.lastName;
      _customer.email = user.email;
      _customer.password = null;
      if (this.user || localStorage.getItem('google')) {
        _customer.social = 1;
      } else {
        _customer.social = 0;
      }

      this.auth.register(_customer).subscribe(res => {
        this.message = res;
        if (res.message === 'Success' && _customer.social === 0) {
          this.authNoticeService.setNotice('Register Success, Check Email Or Spam For Activation Account', 'success');
          this.router.navigateByUrl('/pages/login');
        } else if (res.message === 'Success' && _customer.social === 1) {
          this.signin();
          this.toastrService.success('Register Success');
          localStorage.removeItem('google');
        } else {
          this.authNoticeService.setNotice('Register Fail', 'danger');
          return;
        }
      });
    }
  }

  signin() {
    if (localStorage.getItem('google') || this.user) {
      const user = JSON.parse(localStorage.getItem('google')) || this.user;
      this.auth.loginGoogle(user.email)
      .pipe(
        tap(customer => {
          if (customer) {
            this.store.dispatch(new Login({authToken: customer.accessToken}));
            this.router.navigateByUrl(this.returnUrl); // home
            location.reload();
          } // else {
            // this.authNoticeService.setNotice(this.translate.instant('Login Fail'), 'danger');
          // }
        })
      )
      .subscribe();
    }
  }

}
