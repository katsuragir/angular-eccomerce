import { Component, OnInit } from '@angular/core';
import { DomainURL } from '../../../shared/domainURL';

@Component({
  selector: 'app-services-eleven',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesElevenComponent implements OnInit {

  imgUrl: string = this.localUrl.domain;
  constructor(private localUrl: DomainURL) { }

  ngOnInit() {
  }

}
