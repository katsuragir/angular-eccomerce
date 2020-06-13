// mymodal.component.ts
import { Component, OnInit, Input, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-payment',
  templateUrl: './modal-payment.component.html',
  styleUrls: ['./modal-payment.component.scss']
})
export class ModalPaymentComponent implements OnInit {

  @Input() customer: any;
  @Input() request: any;
  @ViewChild('payment', {static: true}) payment: ElementRef;
  public demoEndpoint: any;
  akses: any;
  urlSafe: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer) {
    this.demoEndpoint = 'https://staging.doku.com/Suite/Receive';
    const authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
    this.akses = localStorage.getItem(authTokenKey);
  }

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(`http://192.168.1.160:4200/v1/payment/${this.akses}`);
  }

  midtrans() {

  }

  close() {
    $('.quickviewm').modal('hide');
  }



}
