export class Address {
  id: number;
  coding: string;
  province: number;
  city: number;
  district: number;
  postal: number;

  clear() {
    this.id = undefined;
    this.coding = '';
    this.province = undefined;
    this.city = undefined;
    this.district = undefined;
    this.postal = 0;
  }
}
