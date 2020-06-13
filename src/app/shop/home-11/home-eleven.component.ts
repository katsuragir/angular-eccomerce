import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/classes/product';
import { ProductsService } from '../../shared/services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Customer } from '../../shared/classes/customer';
import { AuthLoginService } from '../../shared/services/auth.service';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../shared/reducers';
import { Login } from '../../shared/actions/auth.actions';

@Component({
  selector: 'app-home-eleven',
  templateUrl: './home-eleven.component.html',
  styleUrls: ['./home-eleven.component.scss']
})
export class HomeElevenComponent implements OnInit {


  cek: Customer[];
  message: any = [];
  customer: Customer[];
  dataCustomer: Customer;
  loading = false;
  successMessage: string;

  pesan: any;


  constructor(
    private productsService: ProductsService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthLoginService,
    private store: Store<AppState>,
    ) {
      /*
      this.activatedRoute.params.subscribe(params => {
        const token = params['id'];
        if (token) {
          this.verificationAccount(token);
        } else {
          return null;
        }
      });
      */
     this.productsService.parameterCategory(false);
       }

  ngOnInit() {

// tslint:disable-next-line: indent

   // console.log(this.customer);
  }

  /**
   * Verification Account
   */
  verificationAccount(token: string) {
    this.auth.findAccount(token).subscribe(
      result => {
        this.cek = result;
        if (this.cek[0].verification === 0) {
          return this.auth.verifiAccount(token).subscribe(
            res => {
              this.message = res;
            }
          );
        } else {
          return console.log('Ok');
        }
      }
    );
    this.login(token);
  }

  /**
   * Find Account
   */
  findAccount(token: string) {
   return this.auth.findAccount(token).subscribe(
      result => {
        const newCustomer = new Customer();
        newCustomer.clear();
        this.dataCustomer = newCustomer;
        this.customer = result;
      }
    );
  }

  /**
   * login
   */
  login(token: string) {
    this.auth.findAccount(token).subscribe(
      result => {
        this.customer = result;
        const authData = {
          email: this.customer[0].email,
          password: this.customer[0].password
        };
        return this.auth.loginReg(authData.email, authData.password).pipe(
          tap(customer => {
            if (customer) {
              this.store.dispatch(new Login({authToken: customer.accessToken}));
            }
          })
        ).subscribe();
      }
    );
  }

  public getMassage(massage) {
    console.log(massage);
    if (massage) {
      this.pesan = 'Mohon Maaf sepertinya terjadi ganguan di server kami dan sedang proses perbaikan, Mohon ketersediannya untuk menunggu. Jika ada kendala pada transaksi anda di mohon untuk menghubungin admin kami melalui fitur chat yang tersedia atau atau melalui <a href="https://wa.me/6281296551818?text=Hai%20Vapehan%20" target="_blank">link ini</a> agar segera kami proses.';
      this.message = 'error';
    } else {
      this.message = null;
    }
  }

}
