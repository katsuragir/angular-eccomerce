import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PriceComponent implements OnInit {

  // Using Output EventEmitter
  @Output() priceFilters = new EventEmitter();

  // define min, max and range
  // tslint:disable-next-line: no-inferrable-types
  public min: number = 1500;
  // tslint:disable-next-line: no-inferrable-types
  public max: number = 4500000;
  public range = [1500, 4500000];

  constructor() { }

  ngOnInit() {  }

  // rangeChanged
  priceChanged(event: any) {
    setInterval(() => {
      this.priceFilters.emit(event);
    }, 1000);
  }

}
