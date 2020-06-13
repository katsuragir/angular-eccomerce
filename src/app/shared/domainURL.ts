// Angular
import { Injectable } from '@angular/core';
// import { HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DomainURL {

  // tslint:disable-next-line: no-inferrable-types
  public domain: string = 'https://vp.vapehan.com/api';
  public ongkir: string = 'https://vp.vapehan.com/ongkir';

}
