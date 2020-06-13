import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../shared/reducers';
import * as $ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthLoginService } from '../../shared/services/auth.service';
import { Customer } from '../../shared/classes/customer';
import { InvoiceService } from '../../shared/services/invoice.service';
import { CompanyService } from '../../shared/services/company.service';
import { ShippingService } from '../../shared/services/shipping.service';
import { Res } from '../../shared/classes/district';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  private akses: any;
  customer: Customer;
  invoice: any[] = [];
  company: any;
  dateorder: any;
  payment: any;
  invoiceid: any;
  weight: any;
  total: any;
  courier: any;
  service: any;
  ongkir: any;
  totalall: any;
  district: Res;
  payid: any;
  vid: any;
  vname: any;
  amountv: any;
  potongan: any;

  constructor(private store: Store<AppState>, private activatedRoute: ActivatedRoute, private router: Router,
    private authService: AuthLoginService, private invoiceService: InvoiceService, private companyService: CompanyService,
    private shipping: ShippingService) {
      const authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
    this.akses = localStorage.getItem(authTokenKey);
    if (!this.akses) {
      this.router.navigate(['/pages/login']);
    }
    this.authService.findAccount(this.akses).subscribe(
      result => {
        this.customer = result[0];
      }
    );
   }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      this.invoiceService.getOrderItem(id).subscribe(
        result => {
          this.invoice = result;
          this.dateorder = result[0].date_order;
          this.payment = result[0].payment;
          this.invoiceid = result[0].invoice;
          this.weight = result[0].weight;
          this.total = result[0].total;
          this.courier = result[0].namaongkir;
          this.service = result[0].ongkirService;
          this.ongkir = result[0].ongkir;
          this.totalall = result[0].totalall;
          this.payid = result[0].payid;
          this.vid = result[0].voucherid;
          this.vname = result[0].vouchername;
          this.amountv = result[0].amountv;
          this.potongan = result[0].harga_disc;
          // console.log(this.dateorder);
        }
      );
    });
    this.getCompanyInfo();
  }

  getInvoice(id) {

  }

  getCompanyInfo() {
    this.companyService.getCompanyProfile().subscribe(
      result => {
        this.company = result;
        // console.log(this.company);
      }
    );
  }


  print() {
    const popupWin = window.open('', 'width=auto,height=100%');
    const printContents = document.getElementById('print-invoice').innerHTML;
    popupWin.document
        .write(`<html>
         ${$('head').clone().html()}
        <body onload="document.title = '${this.invoice[0].invoice}';window.print();">${printContents}</body></html>`);

    popupWin.document.close();
  }

  /**
   * Returns status string
	 *
	 * @param status: number
	 */
  getItemStatusString(parent): string {
    switch (parent) {
      case '41':
        return 'Mandiri VA';
      case '15':
        return 'Credit Card Visa/Master/JCB';
      case '16':
        return 'Credit Cart';
      case '04':
        return 'Doku Wallet';
      case '33':
        return 'Danamon VA';
      case '32':
        return 'CIMB VA';
      case '26':
        return 'Danamon Internet Banking';
      case '25':
      return 'Muamalat Internet Banking';
      case '19':
        return 'CIMB Clicks';
      case '35':
        return 'Alfa VA';
      case '01':
        return 'BCA Transfer';
    }
    return '';
  }

}
