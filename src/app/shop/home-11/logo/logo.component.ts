import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../shared/services/products.service';
import { DomainURL } from '../../../shared/domainURL';

@Component({
  selector: 'app-logo-brand',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoElevenComponent implements OnInit {
  public sortByOrder: String = '';

  // Slick slider config
  public logoSlideConfig: any = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 6,
    responsive: [{
        breakpoint: 1367,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true
        }
      }
    ]
  };

  // Logo
  public logo = [{
      image: 'assets/images/logos/1.png',
    }, {
      image: 'assets/images/logos/2.png',
    }, {
      image: 'assets/images/logos/3.png',
    }, {
      image: 'assets/images/logos/4.png',
    }, {
      image: 'assets/images/logos/5.png',
    }, {
      image: 'assets/images/logos/6.png',
    }, {
      image: 'assets/images/logos/7.png',
    }, {
      image: 'assets/images/logos/8.png',
  }];
  public brand: any[] = [];

  imgUrl: string = this.localUrl.domain;

  constructor(
    private productService: ProductsService,
    private localUrl: DomainURL
  ) {
    this.productService.brands().subscribe(
      result => {
        this.brand = result;
        // console.log(this.brand);
      }
    );
   }

  ngOnInit() {
    if (this.sortByOrder === '') {
      this.sortByOrder = 'desc';
    }
  }

}
