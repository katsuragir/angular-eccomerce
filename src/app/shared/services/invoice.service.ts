import { Injectable } from '@angular/core';
import { Product } from '../classes/product';
import { CartItem } from '../classes/cart-item';
import { Order } from '../classes/order';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DomainURL } from '../domainURL';

@Injectable({
  providedIn: 'root'
})

export class InvoiceService {

  // Array
  public OrderDetails;

  constructor(
    private router: Router,
    private http: HttpClient,
    private localUrl: DomainURL) { }

  // Get order items from database
  public getOrderItem(id): Observable<any[]> {
    return this.http.get<any[]>(this.localUrl.domain + '/api/order/invoice/order/' + id);
  }

}
