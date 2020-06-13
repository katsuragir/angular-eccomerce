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

export class OrderService {

  // Array
  public OrderDetails;

  constructor(
    private router: Router,
    private http: HttpClient,
    private localUrl: DomainURL) { }

  // Get order items
  public getOrderItems(): any {
    return this.OrderDetails;
  }

  // Get id order items from database
  public getidOrder(): Observable<any[]> {
    return this.http.get<any[]>(this.localUrl.domain + '/api/order/orders/getIdorder'); // rubah url
  }

  // Get order items from database
  public getOrderItem(id, meter: number): Observable<any[]> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    const data = {meter};
    return this.http.post<any[]>(this.localUrl.domain + '/api/order/orders/' + id, data, { headers: httpHeaders }); // rubah url
  }

  // Create order
  public tempoOrder(data) {
    let voucherid: any;
    if (!data.voucher) {
      voucherid = '';
    } else {
      voucherid = data.voucher.voucherid;
    }

    const order = {
      SD: data.customer,
      PD: data.checkout,
      OI: data.unique,
      PI: data.payid,
      PT: data.checkoutvalue,
      TO: data.ongkir,
      AS: data.address,
      VRI: voucherid,
      VR: data.voucher,
      AV: data.amountvoucher,
      AMPT: data.potongan,
      AM: data.amount,
      AMD: data.amountdoku,
      DV: data.device,
      IP: data.ip,
      KY: data.key
  };
    // console.log(item);
    // console.log(item);
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post(this.localUrl.domain + '/api/order/orders/tempo', order, { headers: httpHeaders }); // ubah url
    // this.router.navigate(['/home/checkout/success']);
  }

  // Create order
  public createOrder(data) {
    let voucherid: any;
    if (!data.voucher) {
      voucherid = '';
    } else {
      voucherid = data.voucher.voucherid;
    }
    const item = {
      SD: data.customer,
      PD: data.checkout,
      OI: data.unique,
      PI: data.payid,
      PT: data.checkoutvalue,
      TO: data.ongkir,
      DO: data.disc_ongkir,
      DS: data.discount,
      AS: data.address,
      VRI: voucherid,
      VR: data.voucher,
      AV: data.amountvoucher,
      AMPT: data.potongan,
      AM: data.amount,
      AMD: data.amountdoku
    };

    const order = {
      SD: data.customer,
      PD: data.checkout,
      OI: data.unique,
      PI: data.payid,
      PT: data.checkoutvalue,
      TO: data.ongkir,
      DO: data.disc_ongkir,
      DS: data.discount,
      AS: data.address,
      VRI: voucherid,
      VR: data.voucher,
      AV: data.amountvoucher,
      AMPT: data.potongan,
      AM: data.amount,
      AMD: data.amountdoku,
      // DN: data.donasi
  };
    // console.log(item);
    // console.log(item);
    this.OrderDetails = item;
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post(this.localUrl.domain + '/api/order/orders', order, { headers: httpHeaders }); // ubah url
    // this.router.navigate(['/home/checkout/success']);
  }

  // Create order
  public createManualOrder(data) {
    let voucherid: any;
    if (!data.voucher) {
      voucherid = '';
    } else {
      voucherid = data.voucher.voucherid;
    }
    const item = {
        SD: data.customer,
        PD: data.checkout,
        OI: data.unique,
        PI: data.payid,
        PT: data.checkoutvalue,
        TO: data.ongkir,
        DO: data.disc_ongkir,
        DS: data.discount,
        AS: data.address,
        VR: data.voucher,
        AV: data.amountvoucher,
        AM: data.amount
    };

    const order = {
      SD: data.customer,
      PD: data.checkout,
      OI: data.unique,
      PI: data.payid,
      PT: data.checkoutvalue,
      TO: data.ongkir,
      DO: data.disc_ongkir,
      DS: data.discount,
      AS: data.address,
      VRI: voucherid,
      VR: data.voucher,
      AV: data.amountvoucher,
      AM: data.amount,
      // DN: data.donasi
  };
    // console.log(item);
    // console.log(item);
    this.OrderDetails = item;
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post(this.localUrl.domain + '/api/order/orders/manual', order, { headers: httpHeaders });
    // this.router.navigate(['/home/checkout/success']);
  }

  public generatePaycode(data): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<any>('https://vapehan.com/api/src/rest_api/request.php', data, { headers: httpHeaders });
  }

  public checkPayment(data): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<any>('http://vapehan.com:2000', data, { headers: httpHeaders });
  }

  public redirectDokuPay(obj, url) {
    const mapForm = document.createElement('form');
    mapForm.target = '_self';
    mapForm.method = 'POST';
    mapForm.action = url;
    Object.keys(obj).forEach(function(param) {
      const mapInput = document.createElement('input');
      mapInput.type = 'hidden';
      mapInput.name = param;
      mapInput.value = obj[param];
      // mapInput.setAttribute('value', obj[param]);
      mapForm.appendChild(mapInput);
      // this.checkPayment(obj);
    });
    document.body.appendChild(mapForm);

    mapForm.submit();
  }

  public confirmPayment(data) {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post(this.localUrl.domain + '/api/order/confirm/confirm', data, { headers: httpHeaders });
  }

  public getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.localUrl.domain + '/api/order/orders');
  }

  /**
   * Check Resi
   */
  public checkResi(resi): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<any>(this.localUrl.ongkir + '/ongkir/cekresi', resi, { headers: httpHeaders });
  }

  public updateResi(data): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<any>(this.localUrl.domain + '/api/order/orders/updateResi', data, { headers: httpHeaders });
  }

  /**
   * Cacncel Transaction without credit card
   */
  public CancelTransactionNonCC(data) {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    const id = data.id_order;
    return this.http.post(this.localUrl.domain + '/api/order/orders/cancel/' + id, data, { headers: httpHeaders });
  }

  /**
   * Void Transaction
   */
  public voidTransactionByID(data) {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post('https://vapehan.com/api/src/rest_api/voidPay.php', data, { headers: httpHeaders });
  }

  /**
   * Check Transaction
   */
  public checkTransactionByID(data) {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post('https://vapehan.com/api/src/rest_api/checkstat.php', data, { headers: httpHeaders });
  }

  /**
   * get Product
   */
  public getProduct(id_order): Observable<any[]> {
    return this.http.get<any[]>(this.localUrl.domain + '/api/order/orders/getProduct/' + id_order);
  }

  /**
   * get Product total
   */
  public getProductTotal(id_order): Observable<any[]> {
    return this.http.get<any[]>(this.localUrl.domain + '/api/order/orders/getProductTotal/' + id_order);
  }

  /**
   * Send Email
   */
  public resendEmailOrder(data) {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post(this.localUrl.domain + '/api/order/orders/re/send/order/' + data.orders.id_order, data, { headers: httpHeaders });
  }

  public sendInvoice(data) {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post(this.localUrl.domain + '/api/order/orders/send/invoice/' + data.orders.id_order, data, { headers: httpHeaders });
  }

  // UPDATE => PUT: update the delivery on the server
  public updateDelivery(delivery): Observable<any> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    const id = delivery.id;
    return this.http.put(this.localUrl.domain + `/api/order/delivery/done/${id}`, delivery, { headers: httpHeaders });
  }

}
