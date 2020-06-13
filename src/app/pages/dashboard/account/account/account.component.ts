import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../shared/reducers';
import { currentUser } from '../../../../shared/selectors/auth.selectors';
import { AuthLoginService } from '../../../../shared/services/auth.service';
import { Login } from '../../../../shared/actions/auth.actions';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'account-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  customer$: Observable<Customer>;
  male: boolean;
  customer: Customer;

  constructor(
    private store: Store<AppState>,
    private auth: AuthLoginService) { }

  ngOnInit(): void {
    this.auth.refreshNeeded$.subscribe(() => {
      this.refreshData();
    });
    this.customer$ = this.store.pipe(select(currentUser));
    this.customer$.subscribe(
      res => {
        this.customer = res;
      }
    );
    if (this.customer.gender === '1') {
      this.male = true;
      } else {
      this.male = false;
    }
    // console.log(this.customer);
  }

  refreshData() {
    this.store.dispatch(new Login({authToken: this.customer.accessToken}));
  }

}
