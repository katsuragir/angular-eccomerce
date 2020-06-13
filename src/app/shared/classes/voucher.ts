
// Voucher
export class Vouchers {
  id: number;
  voucherid: string;
  vouchername: string;
  description: string;
  fromdate: string;
  todate: string;
  vouchervalue: number;
  vouchertab: string;
  value: string;
  status: number;
  kouta: number;
  text: string;
  inuse: number;
  member: string;
  limit_pay: number;
  type: string;

  clear(): void {
    this.id = undefined;
    this.voucherid = '';
    this.vouchername = '';
    this.description = '';
    this.vouchervalue = 0;
    this.vouchertab = '';
    this.status = 0;
    this.kouta = 0;
  }
}
