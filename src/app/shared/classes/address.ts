export class Address {
  province_id: number;
  province: string;
  city_id: number;
  city: string;
  subdistrict_id: number;
  subdistrict_name: string;
  type: string;

  clear() {
    this.province_id = 0;
    this.province = '';
    this.city_id = 0;
    this.city = '';
    this.subdistrict_id = 0;
    this.subdistrict_name = '';
  }
}
