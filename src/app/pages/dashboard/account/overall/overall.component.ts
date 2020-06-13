import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../shared/reducers';
import { currentUser } from '../../../../shared/selectors/auth.selectors';
import { ShippingService } from '../../../../shared/services/shipping.service';
import { Res } from '../../../../shared/classes/district';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthLoginService } from '../../../../shared/services/auth.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'account-overall',
  templateUrl: './overall.component.html',
  styleUrls: ['./overall.component.scss']
})
export class OverallComponent implements OnInit {
  customer$: Observable<Customer>;
  customer: any;
  id_province: number;
  id_city: number;
  id_district: number;
  public district: Res;
  overall: boolean;
  address: boolean;
  order: boolean;
  invoice: boolean;
  account: boolean;
  password: boolean;
  province: any;
  private akses: any;

  constructor(
    private store: Store<AppState>,
    private shipping: ShippingService,
    private router: Router,
    private authService: AuthLoginService,
    private activatedRoute: ActivatedRoute) {
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
      }
    );
  }

  gotoInfo() {
    const params = 'info';
    this.router.navigate(['/pages/dashboard', params], { relativeTo: this.activatedRoute });
  }

  gotoAddress() {
    const params = 'add';
    this.router.navigate(['/pages/dashboard', params], { relativeTo: this.activatedRoute });
  }

  gotoPassword() {
    const params = 'pass';
    this.router.navigate(['/pages/dashboard', params], { relativeTo: this.activatedRoute });
  }

  gotoOrder() {
    const params = 'order';
    this.router.navigate(['/pages/dashboard', params], { relativeTo: this.activatedRoute });
  }

}
