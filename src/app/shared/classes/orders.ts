
// Order
export class Orders {
    id: number;
    id_order: string;
    id_customer: number;
    id_ongkir: number;
    total: number;
    payment: number;
    status: number;
    amountv: string;

    clear(): void {
      this.id = undefined;
      this.id_order = '';
      this.id_customer = undefined;
      this.id_ongkir = undefined;
      this.total = 0;
      this.payment = 0;
      this.status = 0;
    }
}
