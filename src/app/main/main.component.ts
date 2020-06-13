import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ProductsService } from '../shared/services/products.service';
import { CartService } from '../shared/services/cart.service';
import { WishlistService } from '../shared/services/wishlist.service';
import { Title, Meta } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [ProductsService, CartService, WishlistService]
})
export class MainComponent implements OnInit {

  public url: any;

  constructor(private router: Router, private title: Title, private meta: Meta) {
    this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.url = event.url;

            if (event.url === '/' || event.url === '/home') {
              this.title.setTitle('Vapehan Vape Store - Toko Vaporizer Jakarta Indonesia');
              this.meta.updateTag({ name: 'title', content: 'Vapehan Vape Store - Toko Vaporizer Jakarta Indonesia' });
              this.meta.updateTag({ name: 'description', content: 'Belanja online aman dan nyaman di vapehan, Duren Sawit, Kota Administrasi Jakarta Timur - One stop vapestore , stop smoking go vaping' });
              this.meta.updateTag({ name: 'keyword', content: 'vapehan vape store, vapehan store, vapehan, toko vape online, vape store indonesia, toko vape, vape store online indonesia vape, vape indonesia, vaporizer jakarta, indonesia vape store, toko vape terdekat, wholesale' });
            }
            // console.log(this.url);
          }
    });
  }

  ngOnInit() {
   $.getScript('assets/js/script.js');
  }

}
