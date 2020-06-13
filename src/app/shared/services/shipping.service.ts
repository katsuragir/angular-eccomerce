import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Province } from '../classes/province';
import { City } from '../classes/city';
import { District } from '../classes/district';
import { Courier } from '../classes/couriers';
import { Address } from '../classes/address_cost';
import { DomainURL } from '../domainURL';


const province = 'https://api.rajaongkir.com/starter/province/';
const city = 'https://api.rajaongkir.com/starter/city';
const cost = 'https://api.rajaongkir.com/starter/cost';

const params = new HttpHeaders();
  params.set('Content-Type', 'da7cc79acbd28cd89a803c5a6438f298');

  const httpOptions = {
    headers: new HttpHeaders({
      'keys' : 'da7cc79acbd28cd89a803c5a6438f298'
    })
  };

@Injectable({
  providedIn: 'root'
})

export class ShippingService {

  constructor(private http: HttpClient, private localUrl: DomainURL) { }


 // Get Province
 public getProvinces(): Observable<any> {
   return this.http.get<any>(this.localUrl.ongkir + '/province'); // rubah url
 }

// get detail province
public getProvince(id): Observable<any> {
  return this.http.get<any>(this.localUrl.ongkir + '/province/' + id);
}

 // get local province
 public getLocalProv(): Observable<any[]> {
  return this.http.get<any[]>(this.localUrl.domain + '/api/shipping/address/province'); // rubah url
 }

 // save province
 public saveProv(province): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    // console.log(province);
   return this.http.post<any>( this.localUrl.domain + '/api/shipping/address/saveProv', province, {headers: httpHeaders}); // rubah url
 }

 // edit province
 public editLocalProv(province): Observable<any> {
  const httpHeaders = new HttpHeaders();
  httpHeaders.set('Content-Type', 'application/json');
 // tslint:disable-next-line: max-line-length
 return this.http.put<any>(this.localUrl.domain + '/api/shipping/address/editProv/' + province.province_id, province, {headers: httpHeaders}); // rubah url
}
// tslint:disable-next-line: max-line-length
// ==================================================================================================================================================================
// Get City
// tslint:disable-next-line: no-shadowed-variable
public getCities(province: number): Observable<any> {
 return this.http.get<any>(this.localUrl.ongkir + '/city' + `/${province}/`); // rubah url
}

public getCity(city: number): Observable<any> {
  return this.http.get<any>(this.localUrl.ongkir + '/dtlcity' + `/${city}/`); // rubah url
}

// get local City
public getLocalCity(): Observable<any[]> {
  return this.http.get<any[]>(this.localUrl.domain + '/api/shipping/address/citys/'); // rubah url
}

 // save city
 public saveCity(city): Observable<any> {
  const httpHeaders = new HttpHeaders();
  httpHeaders.set('Content-Type', 'application/json');
  // console.log(province);
 return this.http.post<any>(this.localUrl.domain + '/api/shipping/address/saveCity', city, {headers: httpHeaders}); // rubah url
}

// edit city
public editLocalCity(city): Observable<any> {
const httpHeaders = new HttpHeaders();
httpHeaders.set('Content-Type', 'application/json');
// tslint:disable-next-line: max-line-length
return this.http.put<any>(this.localUrl.domain + '/api/shipping/address/editCity/' + city.city_id, city, {headers: httpHeaders}); // rubah url
}

// tslint:disable-next-line: max-line-length
// =====================================================================================================================================================================

// Get District
// tslint:disable-next-line: no-shadowed-variable
public getDistrict(city: number): Observable<any> {
  return this.http.get<any>(this.localUrl.ongkir + `/district/${city}`);
  // return this.http.get<District[]>('http://api.shipping.esoftplay.com/subdistrict' + `/${city}/`);
}

public getDist(id): Observable<any> {

  return this.http.get<any>(this.localUrl.ongkir + `/district/dtl/${id}`);
  // return this.http.get<any>('http://api.shipping.esoftplay.com/subdistrict' + `/${city}/${dist}`);
}

// get local district
public getLocalDist(): Observable<any[]> {
  return this.http.get<any[]>(this.localUrl.domain + '/api/shipping/address/district'); // rubah url
}

// save district
public saveDist(dist): Observable<any> {
  const httpHeaders = new HttpHeaders();
  httpHeaders.set('Content-Type', 'application/json');
  // console.log(province);
 return this.http.post<any>(this.localUrl.domain + '/api/shipping/address/saveDist', dist, {headers: httpHeaders}); // rubah url
}

// edit district
public editLocalDist(dist): Observable<any> {
const httpHeaders = new HttpHeaders();
httpHeaders.set('Content-Type', 'application/json');
// tslint:disable-next-line: max-line-length
return this.http.put<any>(this.localUrl.domain + '/api/shipping/address/editDist/' + dist.dist_id, dist, {headers: httpHeaders}); // rubah url
}

// tslint:disable-next-line: no-shadowed-variable
public getAddress(city, district): Observable<any> {
  const url = 'http://api.shipping.esoftplay.com/subdistrict/';
  return this.http.get<any>(url + `${city}/${district}`);
}

public getDistrictById(id_city: number, id_district: number): Observable<District> {
  return this.http.get<District>('http://api.shipping.esoftplay.com/subdistrict/' + `${id_city}/${id_district}`);
}

public getDistrictsById(id_city: number, id_district: number): Observable<District[]> {
  return this.http.get<District[]>('http://api.shipping.esoftplay.com/subdistrict/' + `${id_city}/${id_district}`);
}

// get address for ongkir
public findAddress(id: number): Observable<Address[]> {
  return this.http.get<Address[]>(this.localUrl.domain + '/api/shipping/address/' + id);
}

// get courier
public getCourier(): Observable<any[]> {
  return this.http.get<any[]>(this.localUrl.domain + '/api/shipping/courier');
}

// get ongkir
public getOngkir(data): Observable<any> {
  const httpHeaders = new HttpHeaders();
  httpHeaders.set('Content-Type', 'application/json');
  // return this.http.post<any[]>(this.localUrl.domain + '/api/shipping/ongkir', data, { headers: httpHeaders });
  return this.http.post<any>(this.localUrl.ongkir + '/ongkir/ongkir', data, { headers: httpHeaders }); // rubah url
}

// get harga ongkir
public getHargaOngkir(id): Observable<any> {
  return this.http.get<any>(this.localUrl.domain + '/api/shipping/ongkir/' + id);
}

}
