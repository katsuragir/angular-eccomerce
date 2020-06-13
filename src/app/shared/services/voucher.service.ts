import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Province } from '../classes/province';
import { City } from '../classes/city';
import { District } from '../classes/district';
import { Courier } from '../classes/couriers';
import { Address } from '../classes/address_cost';
import { DomainURL } from '../domainURL';
import { Vouchers } from '../classes/voucher';


@Injectable({
  providedIn: 'root'
})

export class VoucherService {

  constructor(private http: HttpClient, private localUrl: DomainURL) { }

  getDomain(): string {
    return this.localUrl.domain + '/api/catalog/voch';
  }

  // READ
  getAllVouchers(): Observable<Vouchers[]> {
    return this.http.get<Vouchers[]>(this.getDomain() + '/getActive');
  }

// get address for ongkir
public findVoucher(data): Observable<Vouchers> {
  const httpHeaders = new HttpHeaders();
  httpHeaders.set('Content-Type', 'application/json');
  return this.http.post<Vouchers>(this.localUrl.domain + '/api/catalog/voch/find', data, { headers: httpHeaders });
}

// get courier
public getCourier(): Observable<any[]> {
  return this.http.get<any[]>(this.localUrl.domain + '/api/shipping/courier');
}

// get ongkir
public getOngkir(data): Observable<any[]> {
  const httpHeaders = new HttpHeaders();
  httpHeaders.set('Content-Type', 'application/json');
  return this.http.post<any[]>(this.localUrl.domain + '/api/shipping/ongkir', data, { headers: httpHeaders });
}

// get harga ongkir
public getHargaOngkir(id): Observable<any> {
  return this.http.get<any>(this.localUrl.domain + '/api/shipping/ongkir/' + id);
}

}
