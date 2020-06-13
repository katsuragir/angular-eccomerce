import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../shared/reducers';
import { currentUser } from '../../../../shared/selectors/auth.selectors';
import { HttpClient } from '@angular/common/http';
import { ShippingService } from '../../../../shared/services/shipping.service';
import { Res } from '../../../../shared/classes/district';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { AuthLoginService } from 'src/app/shared/services/auth.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'account-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  customer: any;
  id_province: number;
  id_city: number;
  id_district: number;
  province: any = [];
  city: any = [];
  public district: Res;
  province_url = 'http://api.shipping.esoftplay.com/province/';
  city_url = 'http://api.shipping.esoftplay.com/city/';
  district_url = 'http://api.shipping.esoftplay.com/subdistrict/';
  private akses: any;

  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
    private shipping: ShippingService,
    private router: Router,
    private authService: AuthLoginService) {
      const authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
      this.akses = localStorage.getItem(authTokenKey);
      if (!this.akses) {
        this.router.navigate(['/pages/login']);
      }
    }

  ngOnInit(): void {
    this.authService.findAccount(this.akses).subscribe(
      result => {
        this.customer = result[0];
        // console.log(this.customer);
      }
    );
  }

}
