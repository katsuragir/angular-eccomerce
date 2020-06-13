import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MustMatch } from './must-match.validator';
import { Customer } from '../../shared/classes/customer';
import { AuthLoginService } from '../../shared/services/auth.service';
import { AuthNoticeService } from '../../shared/services/auth-notice.service';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { find } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { Subject, of } from 'rxjs';
import { ShippingService } from '../../shared/services/shipping.service';
import { Province, Prov } from '../../shared/classes/province';
import { City, Hasil } from '../../shared/classes/city';
import { District, Res } from '../../shared/classes/district';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SocialUser } from 'angularx-social-login';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/reducers';
import { Login } from 'src/app/shared/actions/auth.actions';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [ DatePipe ]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  message: any = [];
  customer: any = [];
  public province: any = [];
  prov: any = [];
  public city: any[] = [];
  cit: any = [];
  public district: District[] = [];
  dist: any = [];
  public selectedValue: Boolean;
  public selectDistrict: Boolean;
  public showPostal: Boolean;
  gender = [];
  submitted = false;
  cityId: number;
  patternHign: any = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$';
  selectedPattern: string;
  socialLogin: SocialUser;
  pesan: any;

  private unsubscribe: Subject<any>;
  private returnUrl: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private auth: AuthLoginService,
    private datePipe: DatePipe,
    private shipping: ShippingService,
    private authNoticeService: AuthNoticeService,
    private toastrService: ToastrService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.initRegisterForm();
    // console.log(this.auth.SocialLoginDetails);
    /*
    if (this.auth.SocialLoginDetails) {
      this.socialLogin = this.auth.SocialLoginDetails;
      this.registerForm.controls['firstname'].setValue(this.socialLogin.firstName);
      this.registerForm.controls['lastname'].setValue(this.socialLogin.lastName);
      this.registerForm.controls['email'].setValue(this.socialLogin.email);
      this.registerForm.controls['email'].disable();
    } else if (localStorage.getItem('google')) {
      this.socialLogin = JSON.parse(localStorage.getItem('google'));
      this.registerForm.controls['firstname'].setValue(this.socialLogin.firstName);
      this.registerForm.controls['lastname'].setValue(this.socialLogin.lastName);
      this.registerForm.controls['email'].setValue(this.socialLogin.email);
      this.registerForm.controls['email'].disable();
    }
    */
    this.shipping.getLocalCity().subscribe(city => { this.cit = city; });
    this.shipping.getLocalProv().subscribe(prov => { this.prov = prov; });
    this.shipping.getLocalDist().subscribe(dist => { this.dist = dist; });
    this.shipping.getProvinces().subscribe(province => { this.province = province.rajaongkir.results; });
    this.auth.allemail().subscribe(
      res => {
        if (res.length > 0) {
          this.customer = res;
        }
        // console.log(this.customer);
      }
    );
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
    this.pesan = 'Jika mengalami kesulitan saat melakukan Register maupun Verifikasi. Di mohon untuk menghubungin admin kami melalu fitur chat yang tersedia atau melalui <a href="https://wa.me/6281296551818?text=Hai%20Vapehan%20" target="_blank">link ini</a> agar segera kami proses.';
  }

  phoneNumber(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  name(event: any) {
    const pattern = /[a-zA-Z\ \ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  initRegisterForm() {
    const phoneNumber = '^(\+\d{1,3}[- ]?)?\d{10}$';
    this.registerForm = this.fb.group({
    firstname: ['', [Validators.required, Validators.minLength(3)
      ]
    ],
    lastname: ['',
    ],
    email: ['', [ Validators.required, Validators.email, Validators.minLength(10) ]
    ],
    gender: [''.toString(), [
      Validators.required
      ]
    ],
    phone: ['', [
      Validators.required,
      ]
    ],
    dob: ['', [
      Validators.required
      ]
    ],
    receipient: ['', [
      Validators.required
      ]
    ],
    address: ['', [
      Validators.required
      ]
    ],
    province: [''.toString(), [
      Validators.required
      ]
    ],
    city: [''.toString(), [
      Validators.required
      ]
    ],
    district: [''.toString(), [
      Validators.required
      ]
    ],
    postal: [''.toString(), [
      Validators.required
      ]
    ],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
    ]
    ],
    confirmPassword: ['', [
      Validators.required
     ]
    ],
    social : [''],
    agree: [false, [Validators.required]]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  /**
   *  List City
   */
  onOptionsSelected(value: number) {
    this.selectedValue = true;
    this.shipping.getProvince(value).subscribe(
      res => {
        this.saveProv(res.rajaongkir.results);
      }
    );
    return this.shipping.getCities(value).subscribe(city => { this.city = city.rajaongkir.results; });
  }

  saveProv(province) {
    // console.log(province);
    const data = {
      provi_id: province.province_id,
      provi: province.province
    };
    // console.log(data);
    const prov = find(this.prov, function(item: Prov) {
      return (item.province_id === province.province_id && item.province === province.province);
    });

    if (!prov) {
      const provi = find(this.prov, function(item: Prov) {
        return (item.province_id === province.province_id || item.province === province.province);
      });

      if (provi) {
        // console.log('ada');
        this.shipping.editLocalProv(data).subscribe();
      }

      if (!provi) {
        // console.log('gx ada sama sekali');
        this.shipping.saveProv(data).subscribe();
      }
    }
  }

  saveCity(city) {
    // console.log('test');
    const data = {
      cit_id: city.city_id,
      cit_name: city.city_name,
      type: city.type,
      pos: city.postal_code,
      provi_id: city.province_id,
      provi: city.province
    };
    // console.log(data);
    const cit = find(this.cit, function(item: Hasil) {
      return (item.city_id === city.city_id && item.province_id === city.province_id);
    });

    if (!cit) {
      const citi = find(this.cit, function(item: Hasil) {
        return (item.city_id === city.city_id);
      });

      if (citi) {
        // console.log('ada');
        this.shipping.editLocalCity(data).subscribe();
      }

      if (!citi) {
        // console.log('gx ada sama sekali');
        this.shipping.saveCity(data).subscribe();
      }
    }
  }

  saveDist(dist, cValue) {
    // console.log(dist, cValue);
    const data = {
      dist_id: dist.subdistrict_id,
      provi_id: dist.province_id,
      provi: dist.province,
      cit_id: dist.city_id,
      cit: dist.city,
      type: dist.type,
      dist_name: dist.subdistrict_name
    };
    // console.log(data);

    const local_dist = find(this.dist, function(item: Res) {
      return (item.subdistrict_id === dist.subdistrict_id && item.province_id === dist.province_id && item.city_id === dist.city_id);
    });

    // console.log(local_dist, this.dist);

    if (!local_dist) {
      // const distr = find(this.dist, function(item: Res) {
        // return (item.subdistrict_id === dist.subdistrict_id);
      // });

      // if (distr) {
        // console.log('ada');
        // this.shipping.editLocalDist(data).subscribe();
      // }
      /*
      if (!distr) {

        if (!dist || dist === undefined || dist.subdistrict_id === null) {
          const finddis = find(this.district, function(item: Res) {
            return (cValue.dist === item.subdistrict_id && cValue.city === item.city_id);
          });

          if (finddis) {

            const Newdata = {
              dist_id: finddis.subdistrict_id,
              provi_id: finddis.province_id,
              provi: finddis.province,
              cit_id: finddis.city_id,
              cit: finddis.city,
              type: finddis.type,
              dist_name: finddis.subdistrict_name
            };
            console.log(Newdata);
            this.shipping.saveDist(Newdata).subscribe();
          }
        } else {
          */
          this.shipping.saveDist(data).subscribe();
        // }
      // }
    } else {
      this.shipping.editLocalDist(data).subscribe();
    }
  }

  /**
   * list district
   */
  onOptionDistrict(value: number) {
    this.selectDistrict = true;
    this.shipping.getCity(value).subscribe(
      res => {
        this.saveCity(res.rajaongkir.results);
      }
    );
    this.cityId = value;
    return this.shipping.getDistrict(value).subscribe(district => { this.district = district.rajaongkir.results; });
  }

  /**
   * show postal
   */
  onShowPostal(value: number) {
    this.showPostal = true;
    const data = {
      city: this.cityId,
      dist: value
    };
    // console.log(data);
    return this.shipping.getDist(value).subscribe(
      res => {
        // console.log(res.rajaongkir.results);
        this.saveDist(res.rajaongkir.results, data);
      }
    );
  }

  /**
   * Gender
   */
  GetGender() {
    return [
      {
        id: '1', name: 'male'
      },
      {
        id: '2', name: 'female'
      }
    ];
  }

  /**
   * form submit
   */
  onSubmit() {
    this.submitted = true;
    const controls = this.registerForm.controls;
    /*
    this.selectedPattern = 'patternHign';

    if (this.selectedPattern === this.patternHign) {
      this.toastrService.error('Minimum 6 characters, at least one uppercase letter, one lowercase letter and one number');
    }
    */

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    if (!controls['agree'].value) {
      // you must agree the terms and conditions
      this.authNoticeService.setNotice('You must agree the term and condition & privacy policy', 'danger');
      return;
    }

    const custom = find(this.customer, function(item: any) {
      return (item.kd_e === Md5.hashStr(controls['email'].value));
    });

    if (custom) {
      this.toastrService.error('Email Already Register');
      return;
    }

    if (controls['phone'].value.substring(0, 1) !== '0') {
      this.toastrService.error('Invalid Phone Format');
      return;
    }

    const formatDate = this.datePipe.transform(controls['dob'].value, 'yyyy-MM-dd');

    const _customer: Customer = new Customer;
    _customer.clear();
    _customer.firstname = controls['firstname'].value;
    _customer.lastname = controls['lastname'].value;
    _customer.email = controls['email'].value;
    _customer.password = controls['password'].value;
    _customer.nameReceive = controls['receipient'].value;
    _customer.biodata.gender = controls['gender'].value;
    _customer.biodata.phone = controls['phone'].value;
    _customer.biodata.dob = formatDate;
    _customer.biodata.nameReceive = controls['receipient'].value;
    _customer.biodata.address = controls['address'].value;
    _customer.biodata.id_province = controls['province'].value;
    _customer.biodata.id_city = controls['city'].value;
    _customer.biodata.id_district = controls['district'].value;
    _customer.biodata.postal = controls['postal'].value;
    if (this.auth.SocialLoginDetails || localStorage.getItem('google')) {
      _customer.social = 1;
    } else {
      _customer.social = 0;
    }
    _customer.set = 1;

    this.auth.register(_customer).subscribe(res => {
      this.message = res;
      if (res.message === 'Success' && _customer.social === 0) {
        this.authNoticeService.setNotice('Register Success, Check Email Or Spam For Activation Account', 'success');
        this.router.navigateByUrl('/pages/login');
      } else if (res.message === 'Success' && _customer.social === 1) {
        this.router.navigateByUrl('/pages/login');
        this.toastrService.success('Register Success');
        localStorage.removeItem('google');
      } else {
        this.authNoticeService.setNotice('Register Fail', 'danger');
        return;
      }
    });
  }

  /**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.registerForm.controls[controlName];
      if (!control) {
        return false;
      }

      const result = control.hasError(validationType) && (control.dirty || control.touched);
      // console.log(result);
      return result;
  }

}
