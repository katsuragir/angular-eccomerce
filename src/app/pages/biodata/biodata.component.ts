import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthLoginService } from '../../shared/services/auth.service';
import { Customer } from '../../shared/classes/customer';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthNoticeService } from '../../shared/services/auth-notice.service';
import { requiredFileType } from './/file.validator';
import { ShippingService } from '../../shared/services/shipping.service';
import { Province } from '../../shared/classes/province';
import { City } from '../../shared/classes/city';
import { District } from '../../shared/classes/district';
import { of, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { first, map, tap } from 'rxjs/operators';
import { Biodata } from '../../shared/classes/biodata';
import { find } from 'lodash';
import { Store } from '@ngrx/store';
import { AppState } from '../../shared/reducers';
import { Login } from '../../shared/actions/auth.actions';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-biodata',
  templateUrl: './biodata.component.html',
  styleUrls: ['./biodata.component.scss'],
  providers: [ DatePipe ]
})
export class BiodataComponent implements OnInit {
  message: any = [];
  customer: Customer[];
  biodata: Biodata[];
  dataCustomer: Customer;
  model: NgbDateStruct;
  date: {year: number, month: number, day: number};
  registerForm: FormGroup;
  public province: Province[] = [];
  public city: City[] = [];
  public district: District[] = [];
  public selectedValue: Boolean;
  public selectDistrict: Boolean;
  public showPostal: Boolean;
  save: any = [];
  active: any = [];
  gender = [];
  private returnUrl: string;
  loading = false;
  idCus: any = [];

  image = new FormGroup({
    image: new FormControl(null, [Validators.required, requiredFileType('jpg')])
  });

  success = false;
  cek: Customer[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private auth: AuthLoginService,
    private calendar: NgbCalendar,
    private fb: FormBuilder,
    private authNoticeService: AuthNoticeService,
    private shipping: ShippingService,
    private datePipe: DatePipe,
    private router: Router,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit() {
  this.activatedRoute.params.subscribe(params => {
    const token = params['id'];
    this.findAccount(token);
    this.verificationAccount(token);

  });
  this.shipping.getProvinces().subscribe(province => { this.province = province; });
  this.initRegisterForm();
  // redirect back to the returnUrl before login
  this.route.queryParams.subscribe(params => {
    this.returnUrl = params['returnUrl'] || '/home/vapehan';
  });
  this.checkBiodata();
  }

  /**
   * Validate Biodata
   */
  checkBiodata() {
    return this.auth.customerInfo().pipe(
      map((result: Biodata[]) => {
        if (result.length <= 0) {
          return null;
        }

        const bio = find(result, function(item: Biodata) {
          if (item.id_customer === item.id_customer) {
            return console.log(this.customer);
          }
          return bio;
        });
      })
    );
  }

  /**
   * Verification Account
   */
  verificationAccount(token: string) {
    this.auth.findAccount(token).subscribe(
      result => {
        this.cek = result;
        if (this.cek[0].verification === 0) {
          return this.auth.verifiAccount(token).subscribe(
            res => {
              this.message = res;
            }
          );
        } else {
          return console.log('Ok');
        }
      }
    );
  }

  /**
   * Find Account
   */
  findAccount(token: string) {
   return this.auth.findAccount(token).subscribe(
      result => {
        const newCustomer = new Customer();
        newCustomer.clear();
        this.dataCustomer = newCustomer;
        this.customer = result;
      }
    );
  }

  /**
   *  List City
   */
  onOptionsSelected(value: number) {
    this.selectedValue = true;
    return this.shipping.getCities(value).subscribe(city => { this.city = city; });
  }

  /**
   * list district
   */
  onOptionDistrict(value: number) {
    this.selectDistrict = true;
    return this.shipping.getDistrict(value).subscribe(district => { this.district = district; });
  }

  /**
   * show postal
   */
  onShowPostal(value: number) {
    this.showPostal = true;
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
   * form initalization
   * default params, validator
   */
  initRegisterForm() {
    this.registerForm = this.fb.group({
      id : [''],
      firstname: [{value: '{{cus.firstname}}', disabled: true}, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
        ])
      ],
      lastname: [{value: '{{cus.lastname}}', disabled: true}, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
        ])
      ],
      email: [{value: '{{cus.email}}', disabled: true}, Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        Validators.maxLength(320)
        ]),
      ],
      gender: ['', Validators.compose([
        Validators.required
      ])
    ],
    phone: ['', Validators.compose([
      Validators.required
      ])
    ],
    dob: ['', Validators.compose([
      Validators.required
      ])
    ],
    address: ['', Validators.compose([
      Validators.required
      ])
    ],
    province: [''.toString(), Validators.compose([
      Validators.required
      ])
    ],
    city: [''.toString(), Validators.compose([
      Validators.required
      ])
    ],
    district: [''.toString(), Validators.compose([
      Validators.required
      ])
    ],
    postal: [''.toString(), Validators.compose([
      Validators.required
      ])
    ]
    });
  // async gender
  of(this.GetGender()).subscribe(gender => {
    this.gender = gender;
    this.registerForm.controls.gender.patchValue(this.gender[0].id);
  });
  }

  /**
   *
   * validate image
   */
  hasError( field: string, error: string ) {
    const control = this.image.get(field);
    if (!control) {
      return false;
    }
    return control.dirty && control.hasError(error);
  }

  /**
   * Submit Form
   */
  submit() {
    this.success = false;
    if ( !this.image.valid ) {
      this.authNoticeService.setNotice('Only Image.jpg', 'danger');
      markAllAsDirty(this.image);
      return;
    }
    const control = this.registerForm.controls;

    // check form
    if (this.registerForm.invalid) {
      Object.keys(control).forEach(controlName =>
        control[controlName].markAsTouched()
        );
        this.authNoticeService.setNotice('Please, fill correctly', 'danger');
        return;
    }

    this.auth.activeAccount(this.customer[0].id).subscribe(res => {
      this.active = res;
    });

    const creteData = this.prepareBiodata();
    const formData = this.makeFormData(creteData);
    this.saveData(formData);
    return;

  }

  /**
   * PrepareBiodata
   */
  prepareBiodata(): Customer {
    const controls = this.registerForm.controls;
    const formatDate = this.datePipe.transform(controls['dob'].value, 'yyyy-MM-dd');
    const _bioadata = new Customer();
    _bioadata.clear();
    _bioadata.id = this.customer[0].id;
    _bioadata.firstname = controls['firstname'].value;
    _bioadata.lastname = controls['lastname'].value;
    _bioadata.email = controls['email'].value;
    _bioadata.biodata.clear();
    _bioadata.biodata.gender = controls['gender'].value;
    _bioadata.biodata.phone = controls['phone'].value;
    _bioadata.biodata.dob = formatDate;
    _bioadata.biodata.address = controls['address'].value;
    _bioadata.biodata.id_province = controls['province'].value;
    _bioadata.biodata.id_city = controls['city'].value;
    _bioadata.biodata.id_district = controls['district'].value;
    _bioadata.biodata.postal = controls['postal'].value;
    // _bioadata.biodata.image = this.image.value;
    // console.log(_bioadata);
    return _bioadata;
  }

  /**
   * Form Data
   */
  makeFormData(_bioadata) {
    const formData: FormData = new FormData();
    formData.append('id', _bioadata.id);
    for ( const key of Object.keys(this.image.value) ) {
      const value = this.image.value[key];
      formData.append(key, value);
    }
    formData.append('image', _bioadata.biodata.image);
    formData.append('gender', _bioadata.biodata.gender);
    formData.append('phone', _bioadata.biodata.phone);
    formData.append('dob', _bioadata.biodata.dob);
    formData.append('address', _bioadata.biodata.address);
    formData.append('id_province', _bioadata.biodata.id_province);
    formData.append('id_city', _bioadata.biodata.id_city);
    formData.append('id_district', _bioadata.biodata.id_district);
    formData.append('postal', _bioadata.biodata.postal);
    // console.log(formData);
    return formData;
  }

  /**
   * save data to database
   */
  saveData(formData) {

    this.auth.biodata(formData).subscribe(res => {
      this.save = res;
    });
    this.authNoticeService.setNotice(this.translate.instant('Now You Can Login'), 'success');
    return this.router.navigateByUrl('/pages/login');
  }

  /**
   * login
   */
  login() {
    const authData = {
      email: this.customer[0].email,
      password: this.customer[0].password
    };
    // console.log(authData);
    this.loading = true;
    this.auth.loginReg(authData.email, authData.password).pipe(
      tap(customer => {
        if (customer) {
          this.store.dispatch(new Login({authToken: customer.accessToken}));
        }
      })
    ).subscribe();
    return this.router.navigateByUrl('/home/vapehan');
  }

}

export function markAllAsDirty( form: FormGroup ) {
  for ( const control of Object.keys(form.controls) ) {
    form.controls[control].markAsDirty();
  }
}

export function toFormData<T>( formValue: T ) {
  const formData = new FormData();

  for ( const key of Object.keys(formValue) ) {
    const value = formValue[key];
    formData.append(key, value);
  }

  return formData;
}
