import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../shared/reducers';
import { currentUser } from '../../../../shared/selectors/auth.selectors';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthLoginService } from '../../../../shared/services/auth.service';
import { DatePipe } from '@angular/common';
import { MustMatch } from './must-match.validator';
import { District, Res } from '../../../../shared/classes/district';
import { ShippingService } from '../../../../shared/services/shipping.service';
import { find } from 'lodash';
import { Hasil } from '../../../../shared/classes/city';
import { Prov } from '../../../../shared/classes/province';

declare var $: any;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './modal-profile.component.html',
  styleUrls: ['./modal-profile.component.scss'],
  providers: [ DatePipe ]
})
export class ModalProfileComponent implements OnInit, OnDestroy {
  customer$: Observable<Customer>;
  accountInfo: FormGroup;
  loading = false;
  message: any = [];
  customer: Customer;
  submitted = false;
  public province: any = [];
  prov: any = [];
  public city: any[] = [];
  cit: any = [];
  public district: District[] = [];
  dist: any = [];
  public selectedValue: Boolean;
  public selectDistrict: Boolean;
  public showPostal: Boolean;
  cityId: number;
  patternHign: any = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$';
  selectedPattern: string;

// tslint:disable-next-line: no-inferrable-types
  public counter:   number = 1;
  public variantImage:   any = '';
  public selectedColor:   any = '';
  public selectedSize:   any = '';

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private auth: AuthLoginService,
    private datePipe: DatePipe,
    private shipping: ShippingService,
  ) { }

  ngOnInit() {
    this.shipping.getLocalCity().subscribe(city => { this.cit = city; });
    this.shipping.getLocalProv().subscribe(prov => { this.prov = prov; });
    this.shipping.getLocalDist().subscribe(dist => { this.dist = dist; });
    this.shipping.getProvinces().subscribe(province => { this.province = province.rajaongkir.results; });
    this.customer$ = this.store.pipe(select(currentUser));
    this.customer$.subscribe(
      result => {
        this.customer = result;
       // console.log(this.customer);
      }
    );
    this.initaccountForm();
  }

  phoneNumber(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  initaccountForm() {
    this.accountInfo = this.fb.group({
      gender: [''.toString(), Validators.compose([
        Validators.required
        ])
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
      }, {
        validator: MustMatch('password', 'confirmPassword')
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.accountInfo.controls; }

  ngOnDestroy() {
    $('.quickviewm').modal('hide');
    location.reload();
  }

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
    // tslint:disable-next-line: max-line-length
    return this.shipping.getDistrict(value).subscribe(district => { this.district = district.rajaongkir.results; console.log(this.district); });
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
    return this.shipping.getDist(value).subscribe(
      res => {
        // console.log(res.rajaongkir.results);
        this.saveDist(res.rajaongkir.results, data);
      }
    );
  }

  /**
   * submit form
   */
  onSubmit() {
    this.submitted = true;
    const controls = this.accountInfo.controls;

    // stop here if form is invalid
    if (this.accountInfo.invalid) {
      return;
    }

   const editData = this.prepareData();
   this.saveData(editData);
   return;
  }

  prepareData(): Customer {
    const controls = this.accountInfo.controls;
    const formatDate = this.datePipe.transform(controls['dob'].value, 'yyyy-MM-dd');
    const _customer = new Customer();
    _customer.clear();
    _customer.id = this.customer.id;
    _customer.password = controls['password'].value;
    _customer.phone = controls['phone'].value;
    _customer.gender = controls['gender'].value;
    _customer.dob = formatDate;
    _customer.nameReceive = controls['receipient'].value;
    _customer.address = controls['address'].value;
    _customer.id_province = controls['province'].value;
    _customer.id_city = controls['city'].value;
    _customer.id_district = controls['district'].value;
    _customer.postal = controls['postal'].value;
    _customer.set = 1;

    return _customer;
  }

  saveData(_customer) {
    // console.log(_customer);
    this.auth.accountEditprofile(_customer).subscribe(res => {
      this.message = res;
      this.ngOnDestroy();
    });
  }
}
