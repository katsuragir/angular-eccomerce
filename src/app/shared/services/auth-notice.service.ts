import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthNotice } from '../classes/auth-notice.interface';
import { Customer } from '../classes/customer';

@Injectable({
  providedIn: 'root'
})
export class AuthNoticeService {
    onNoticeChanged$: BehaviorSubject<AuthNotice>;
    onCustomerChanged$: BehaviorSubject<Customer>;

    constructor() {
      this.onNoticeChanged$ = new BehaviorSubject(null);
      this.onCustomerChanged$ = new BehaviorSubject(null);
    }

    setNotice(message: string, type?: string) {
      const notice: AuthNotice = {
        message: message,
        type: type
      };
      this.onNoticeChanged$.next(notice);
    }


    setCustomer(customer) {
      this.onCustomerChanged$.next(customer);
    }

}
