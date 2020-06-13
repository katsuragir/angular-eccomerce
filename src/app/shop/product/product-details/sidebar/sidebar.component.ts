import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../../shared/services/products.service';

@Component({
// tslint:disable-next-line: component-selector
  selector: 'product-details-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public brand:   any[] = [];
  public tagsFilters:   any[] = [];


  constructor(
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.productsService.brands().subscribe(
      result => {
        this.brand =  result;
        // console.log(this.brand);
      }
     );
  }

}
