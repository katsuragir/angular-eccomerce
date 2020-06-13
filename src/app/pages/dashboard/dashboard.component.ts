import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../shared/reducers';
import { currentUser } from '../../shared/selectors/auth.selectors';
import { Logout } from '../../shared/actions/auth.actions';

import * as $ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
// import { TopbarTwoComponent } from '../../shared/header/widgets/topbar/topbar-two/topbar-two.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  customer$: Observable<Customer>;
  overall: boolean;
  address: boolean;
  order: boolean;
  invoice: boolean;
  shipping: boolean;
  account: boolean;
  password: boolean;

  constructor(private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    // private topBar: TopbarTwoComponent,
    private router: Router) {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      switch (id) {
        case 'confirm':
            this.address  = true;
            return this.Orders();
          break;
        case 'cancel':
          this.address  = true;
          return this.Orders();
        break;
        case 'info':
            this.account  = true;
            return this.Account();
          break;
        case 'dash':
            this.overall  = true;
            return this.All();
          break;
        case 'add':
            this.address  = true;
            return this.Address();
          break;
        case 'pass':
            this.password  = true;
            return this.Password();
          break;
        case 'order':
            this.address  = true;
            return this.Orders();
          break;
      }
      this.overall = true;
      return this.All();
    });
   }

  ngOnInit(): void {
    this.customer$ = this.store.pipe(select(currentUser));
  }

  gotoDashboard() {
    const params = 'dash';
    this.router.navigate(['/pages/dashboard', params], { relativeTo: this.activatedRoute });
  }

  /**
   * show overall
   */
  All() {
    this.overall  = true;
    this.address  = false;
    this.order    = false;
    this.invoice  = false;
    this.shipping = false;
    this.account  = false;
    this.password = false;
  }

  /**
   * show address
   */
  Address() {
    this.overall  = false;
    this.address  = true;
    this.order    = false;
    this.invoice  = false;
    this.shipping = false;
    this.account  = false;
    this.password = false;
  }

  /**
   * show order
   */
  Orders() {
    this.overall  = false;
    this.address  = false;
    this.order    = true;
    this.invoice  = false;
    this.shipping = false;
    this.account  = false;
    this.password = false;
  }

  /**
   * show invoice
   */
  Invoice() {
    this.overall  = false;
    this.address  = false;
    this.order    = false;
    this.invoice  = true;
    this.shipping = false;
    this.account  = false;
    this.password = false;
  }

  /**
   * show shipping
   */
  Shipping() {
    this.overall  = false;
    this.address  = false;
    this.order    = false;
    this.invoice  = false;
    this.shipping = true;
    this.account  = false;
    this.password = false;
  }

  /**
   * show Account
   */
  Account() {
    this.overall  = false;
    this.address  = false;
    this.order    = false;
    this.invoice  = false;
    this.shipping = false;
    this.account  = true;
    this.password = false;
  }

  /**
   * Show Password
   */
  Password() {
    this.overall  = false;
    this.address  = false;
    this.order    = false;
    this.invoice  = false;
    this.shipping = false;
    this.account  = false;
    this.password = true;
  }

  /**
	 * Log out
	 */
  logout() {
    this.store.dispatch(new Logout());
    // return this.topBar.destroyAllCart();
  }

}
