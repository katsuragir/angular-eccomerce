import { Component, OnInit } from '@angular/core';
import { Menu } from './left-menu-items';
import { Category } from '../../../../shared/classes/category';
import { CategoryService } from '../../../../shared/services/category.service';
import { LandingFixService } from '../../../../shared/services/landing-fix.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
declare var $: any;

export const MENUITEMS: Menu[] = [

  {
    title: 'combo package', path: '/home/product/collection/22', type: 'link', megaMenu: false
  },
  {
    title: 'starter kits', path: '/home/product/collection/23', type: 'link'

  },
  {
    title: 'atomizers', path: '/home/product/collection/16', type: 'link', megaMenu: false, children: [
      { path: '/home/product/collection/24', title: 'RDA (rebuildable dripping atomizer)', type: 'link' },
      { path: '/home/product/collection/25', title: 'RBA (rebuildable atomizer)', type: 'link' },
      { path: '/home/product/collection/26', title: 'RTA (rebuildable tank atomizer)', type: 'link' },
      { path: '/home/product/collection/27', title: 'clearomizer', type: 'link'}
    ]
  },
  {
    path: '/home/product/collection/28', title: 'mechanical mod', type: 'link'
  },
  {
    path: '/home/product/collection/29', title: 'electrical mod', type: 'link'
  },
  {
    title: 'battery & charger', path: '/home/product/collection/20', type: 'link', children: [
      { path: '/home/product/collection/30', title: 'battery', type: 'link' },
      { path: '/home/product/collection/31', title: 'charger', type: 'link' }
      ]
  },
  {
    title: 'e-liquid', path: '/home/product/collection/02', type: 'link', children: [
      { path: '/home/product/collection/32', title: 'local juices', type: 'link' },
      { path: '/home/product/collection/33', title: 'malaysia juices', type: 'link' },
      { path: '/home/product/collection/34', title: 'USA juices', type: 'link' }
      ]
  },
  {
    title: 'accessories', path: '/home/product/collection/21', type: 'link', children: [
      { path: '/home/product/collection/35', title: 'coil head and protank', type: 'link' },
      { path: '/home/product/collection/36', title: 'case vape', type: 'link' },
      { path: '/home/product/collection/37', title: 'drip tip', type: 'link' },
      { path: '/home/product/collection/38', title: 'display stand', type: 'link' },
      { path: '/home/product/collection/39', title: 'wire & cotton', type: 'link' },
      { path: '/home/product/collection/40', title: 'general accessories', type: 'link' }
      ]
  },
  {
    title: 'diy (do it yourself)', path: '/home/product/collection/41', type: 'link', children: [
      { path: '/home/product/collection/42', title: 'flavor/essence', type: 'link' },
      { path: '/home/product/collection/41', title: 'accessories', type: 'link' },
      ]
  },
];

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent implements OnInit {

  public categories: Category[] = [];

  public categories$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  public menuItems: Menu[];

  interval: any;

  discount = false;

  constructor(private fix: LandingFixService,
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

      this.categoryService.categories().subscribe(category => {
        // console.log(category);
        if (category[0].discount === "ada") {
          this.discount = true;
        } else {
          this.discount = false;
        }
        this.categories = category.filter(x => x.id_parent === 1);
        this.categories.forEach(function (value, key) {
          return value.children = category.filter(x => x.id_parent === value.id);
        });
        const authTokenKey = 'listing';
        localStorage.setItem(authTokenKey, JSON.stringify(this.categories));
        this.categories$.next(JSON.parse(localStorage.getItem('listing')) || []);
      // console.log(this.categories);
      });

  }

  ngOnInit() {
    /*
    this.categoryService.getCategories().subscribe(category => {
      // console.log(category);
      this.categories = category.filter(x => x.id_parent === 1);
      this.categories.forEach(function (value, key) {
        return value.children = category.filter(x => x.id_parent === value.id);
      });
      console.log(this.categories);
    });
    */

     this.menuItems = MENUITEMS.filter(menuItem => menuItem);
     // console.log(this.menuItems);
     // this.categories$ =  this.categoryService.getCategories();
    // console.log(this.categories$);

    // this.allCategories();
    this.categories$.next(JSON.parse(localStorage.getItem('listing')) || []);
  }

  get allCategories() {
    this.categories$.next(JSON.parse(localStorage.getItem('listing')) || []);
    // console.log(this.categories$);
    return this.categories$;

  }

  parentFilter() {
    const menu =  this.categories.filter(x => x.id_parent === 1);
    // console.log(menu);
  }

  closeLeft(id) {
    this.router.navigate(['/home/product/collection', id], { relativeTo: this.activatedRoute });
    this.fix.removeNavFix();
 }

  closeNav() {
    this.fix.removeNavFix();
 }

}
