import { Biodata } from './biodata';

export class Customer {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  verification: number;
  password: string;
  accessToken: string;
  biodata: Biodata;
  status: number;
  id_province: number;
  province: string;
  id_city: number;
  city: string;
  id_district: number;
  subdistrict_name: string;
  type: string;
  dob: string;
  gender: string;
  phone: string;
  id_customer: number;
  address: string;
  postal: number;
  social: number;
  google: number;
  nameReceive: string;
  set: number;

  clear(): void {
    this.id = undefined;
    this.firstname = '';
    this.lastname = '';
    this.email = '';
    this.verification = 0;
    this.password = '';
    this.accessToken = 'access-member-' + Math.random();
    this.biodata = new Biodata();
    this.biodata.clear();
    this.status = 0;
  }
}
