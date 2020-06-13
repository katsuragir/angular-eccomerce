import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../../shared/classes/product';
import { ProductsService } from '../../../../shared/services/products.service';
import { DomainURL } from '../../../../shared/domainURL';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {

  public products: Product[] = [];
  imgUrl: string = this.localUrl.domain;

  constructor(private productsService: ProductsService, private localUrl: DomainURL) { }

  ngOnInit() {
// tslint:disable-next-line: indent
  	this.productsService.getBestProducts().subscribe(
      product => {
        this.products = product;
        // console.log(this.products);
      });
  }

}
