import { Component, OnInit } from '@angular/core';
import { BannersService } from '../../../shared/services/banner.service';
import { BannerModel } from 'src/app/shared/classes/banner';
import { DomainURL } from '../../../shared/domainURL';

@Component({
  selector: 'app-slider-eleven',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderElevenComponent implements OnInit {

  // Slick slider config
  public sliderConfig: any = {
    autoplay: true,
    autoplaySpeed: 7000
  };
  banners: BannerModel[] = [];
  imgUrl: string;

  constructor(private bannnerServer: BannersService, private domainUrl: DomainURL) { }

  ngOnInit() {
    this.imgUrl = this.domainUrl.domain;
    this.bannnerServer.getBanners().subscribe(
      result => {
        this.banners = result;
        // console.log(this.banners);
      }
    );
  }

}
