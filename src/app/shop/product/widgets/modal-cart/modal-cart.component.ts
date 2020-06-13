import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../../../shared/classes/product';
import { ProductsService } from '../../../../shared/services/products.service';
import { DomainURL } from '../../../../shared/domainURL';
declare var $: any;

@Component({
  selector: 'app-modal-cart',
  templateUrl: './modal-cart.component.html',
  styleUrls: ['./modal-cart.component.scss']
})
export class ModalCartComponent implements OnInit, OnDestroy {

  public products: Product[] = [];
  imgUrl: string = this.localUrl.domain;

  constructor(private productsService: ProductsService, private localUrl: DomainURL) { }

  ngOnInit() {
    this.productsService.getProducts().subscribe(product => {
      this.products = product;
    });
  }

  ngOnDestroy() {
    $('.addTocartModal').modal('hide');
  }

  relatedProducts(pro) {
     const relatedItems = this.products.filter(function(products) {
        if (products.id !== pro.id) {
        return products.id_category === pro.category;
        }
    });
    return relatedItems;
  }

}
