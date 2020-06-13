import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../../../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../shared/reducers';
import { currentUser } from '../../../../../shared/selectors/auth.selectors';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthLoginService } from '../../../../../shared/services/auth.service';
import { DatePipe } from '@angular/common';
import { ShippingService } from '../../../../../shared/services/shipping.service';
import { Res, District } from '../../../../../shared/classes/district';
import { Province, Prov } from '../../../../../shared/classes/province';
import { City, Hasil } from '../../../../../shared/classes/city';
import { Router } from '@angular/router';
import { CheckoutComponent } from '../../checkout.component';
import { find } from 'lodash';


declare var $: any;

@Component({
  selector: 'app-manual-pay',
  templateUrl: './modal-manual-pay.component.html',
  styleUrls: ['./modal-manual-pay.component.scss'],
  providers: [ DatePipe ]
})
export class ManualPayComponent implements OnInit, OnDestroy {
  customer$: Observable<Customer>;
  accountInfo: FormGroup;
  loading = false;
  message: any = [];
  @Input() customer: any;
  public dist: Res;
  public province: Province[] = [];
  prov: any = [];
  public city: City[] = [];
  cit: any = [];
  public district: District[] = [];
  distr: any = [];
  submitted = false;
  cityId: number;

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
    private shippingService: ShippingService,
    private address: CheckoutComponent
  ) {   }

  ngOnInit() {
    this.cityId = this.customer.id_city;
    this.shippingService.getProvinces().subscribe(province => { this.province = province.rajaongkir.results; });
    this.shippingService.getCities(this.customer.id_province).subscribe(
      res => {
        this.city = res.rajaongkir.results;
        // console.log(res);
    });
    this.shippingService.getDistrict(this.customer.id_city).subscribe(
      res => {
        this.district = res;
        // console.log(this.dist);
    });
    this.initaccountForm();
  }

  initaccountForm() {
    this.accountInfo = this.fb.group({
    address: [this.customer.address, [
      Validators.required,
      ]
    ],
    province: [this.customer.id_province, [
      Validators.required
      ]
    ],
    city: [this.customer.id_city, [
      Validators.required
      ]
    ],
    district: [this.customer.id_district, [
      Validators.required
      ]
    ],
    postal: [this.customer.postal
    ],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.accountInfo.controls; }

  /**
   *  List City
   */
  onOptionsSelected(value: number) {
    // console.log(value);
    this.shippingService.getProvince(value).subscribe(
      res => {
        this.saveProv(res.rajaongkir.results);
      }
    );
    return this.shippingService.getCities(value).subscribe(city => { this.city = city.rajaongkir.results; });
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
        this.shippingService.editLocalProv(data).subscribe();
      }

      if (!provi) {
        // console.log('gx ada sama sekali');
        this.shippingService.saveProv(data).subscribe();
      }
    }
  }

  saveCity(city) {
    // console.log(city);
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
        this.shippingService.editLocalCity(data).subscribe();
      }

      if (!citi) {
        // console.log('gx ada sama sekali');
        this.shippingService.saveCity(data).subscribe();
      }
    }
  }

  saveDist(dist) {
    // console.log(dist);
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
    const dis = find(this.distr, function(item: Res) {
      return (item.subdistrict_id === dist.subdistrict_id && item.province_id === dist.province_id && item.city_id === dist.city_id);
    });

    if (!dis) {
      const distr = find(this.distr, function(item: Res) {
        return (item.subdistrict_id === dist.subdistrict_id);
      });

      if (distr) {
        // console.log('ada');
        this.shippingService.editLocalDist(data).subscribe();
      }

      if (!distr) {
        // console.log('gx ada sama sekali');
        this.shippingService.saveDist(data).subscribe();
      }
    }
  }

  /**
   * list district
   */
  onOptionDistrict(value: number) {
    // this.selectDistrict = true;
    this.shippingService.getCity(value).subscribe(
      res => {
        this.saveCity(res.rajaongkir.results);
      }
    );
    this.cityId = value;
    return this.shippingService.getDistrict(value).subscribe(district => { this.district = district; });
  }

  onOptionDist(value: number) {
    // this.selectDistrict = true;
    const data = {
      city: this.cityId,
      dist: value
    };
    return this.shippingService.getDist(data).subscribe(
      res => {
        this.saveDist(res.result);
      }
    );
  }

  ngOnDestroy() {
    $('.quickviewm').modal('hide');
  }

  /**
   * submit form
   */
  submit(id) {
    this.submitted = true;
    const controls = this.accountInfo.controls;

    // stop here if form is invalid
    if (this.accountInfo.invalid) {
      return;
    }

   const editData = this.prepareData(id);
   this.saveData(editData);
   return;
  }

  prepareData(id): Customer {
    const controls = this.accountInfo.controls;
    // const formatDate = this.datePipe.transform(controls['dob'].value, 'yyyy-MM-dd');
    const _customer = new Customer();
    _customer.clear();
    _customer.id = id;
    _customer.address = controls['address'].value;
    _customer.id_province = controls['province'].value;
    _customer.id_city = controls['city'].value;
    _customer.id_district = controls['district'].value;
    _customer.postal = controls['postal'].value;
    return _customer;
  }

  saveData(_customer) {
    this.auth.accountEditaddress(_customer).subscribe(res => {
      this.message = res;
      this.address.ngOnInit();
      this.ngOnDestroy();
    });
  }

}
