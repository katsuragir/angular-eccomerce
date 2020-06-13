import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { LandingFixService } from '../../services/landing-fix.service';
import { CompanyService } from '../../services/company.service';
import { DomainURL } from '../../domainURL';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../../services/windows.service';
import { Router, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
import { AuthLoginService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { Customer } from '../../classes/customer';
import { currentUser } from '../../selectors/auth.selectors';
import { Login } from '../../actions/auth.actions';
declare var $: any;

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {

  company: any;
  imgUrl: string = this.localUrl.domain;
  customer$: Observable<Customer>;
  public customer: Customer;

  constructor(private fix: LandingFixService, private companyService: CompanyService, private localUrl: DomainURL,
    @Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window, private router: Router,
    private store: Store<AppState>, private auth: AuthLoginService) { }

  ngOnInit() {
    $.getScript('assets/js/menu.js');
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      $("html, body").animate({
        scrollTop: 1
      }, 600);
      return false;
    });
    this.auth.refreshNeeded$.subscribe(() => {
      this.refreshData();
    });
    this.customer$ = this.store.pipe(select(currentUser));
    this.customer$.subscribe(
      res => {
        this.customer = res;
        // console.log(this.customer);
      }
    );
    this.companyService.getCompanyProfile().subscribe(
      result => {
        this.company = result;
        // console.log(this.company);
      }
    );

  }

  closeNav() {
     this.fix.removeNavFix();
  }

  refreshData() {
    this.store.dispatch(new Login({authToken: this.customer.accessToken}));
  }

  // @HostListener Decorator
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const number = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
      if (number >= 100) {
        this.document.getElementById('left-header').classList.add('fixed');
      } else {
        this.document.getElementById('left-header').classList.remove('fixed');
      }
  }

}
