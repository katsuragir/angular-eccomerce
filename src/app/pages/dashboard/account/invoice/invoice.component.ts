import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../shared/reducers';
import { currentUser } from '../../../../shared/selectors/auth.selectors';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'account-invoices',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoicesComponent implements OnInit {
  customer$: Observable<Customer>;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.customer$ = this.store.pipe(select(currentUser));
  }

}
