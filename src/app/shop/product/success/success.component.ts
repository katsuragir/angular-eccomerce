import { Component, OnInit } from '@angular/core';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { ProductsService } from '../../../shared/services/products.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  public orderDetails: any = {};
  public exp = new Date;
  private amount:  number;
  private pay = '';
  private ongkir: number;
  private potongan: number;
  private potongan_ongkir: number;

  constructor(
    private orderService: OrderService,
    public productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.orderDetails = this.orderService.getOrderItems();
      // console.log(this.orderDetails);
      if (this.orderDetails.VR === undefined || !this.orderDetails.VR) {
        this.amount = this.orderDetails.AM + +this.orderDetails.PI;
      } else {
        this.amount = this.orderDetails.AV + +this.orderDetails.PI;
      }
      const amount = +this.orderDetails.PD[0].totalOut + +this.orderDetails.TO.info.cost[0].value;
    if (this.orderDetails.VR) {
      if (this.orderDetails.VR.type === 'pembayaran') {
        this.potongan = this.orderDetails.DS;
      } else {
        this.potongan_ongkir = this.orderDetails.DO;
      }
    }
    this.pay = this.orderDetails.payid;
    this.ongkir = this.orderDetails.totalOngkir;
    // console.log(this.orderDetails);
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (this.orderDetails === undefined && id !== undefined) {
        this.router.navigate(['/pages/dashboard']);
      }
    });
    const tomorrow = new Date(this.exp.setDate(this.exp.getDate() + 1));
    return tomorrow;
  }

}
