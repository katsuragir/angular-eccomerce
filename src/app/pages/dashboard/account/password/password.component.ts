import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../shared/reducers';
import { currentUser } from '../../../../shared/selectors/auth.selectors';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from '../../../register/must-match.validator';
import { AuthLoginService } from '../../../../shared/services/auth.service';
import { AuthNoticeService } from '../../../../shared/services/auth-notice.service';
import { ToastrService } from 'ngx-toastr';
import { Md5 } from 'ts-md5';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'account-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  customer$: Observable<Customer>;
  customer: Customer;
  changeForm: FormGroup;
  loading = false;
  message: any[];
  submitted = false;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private auth: AuthLoginService,
    private authNoticeService: AuthNoticeService,
    private toastrService: ToastrService
    ) { }

  ngOnInit(): void {
    this.customer$ = this.store.pipe(select(currentUser));
    this.customer$.subscribe(customer => this.customer = customer);
    // console.log(this.customer$);
    this.initChangeForm();
  }

  initChangeForm() {
    this.changeForm = this.fb.group({
      oldpassword: ['', [
        Validators.required, Validators.minLength(3)
        ]
      ],
      password: ['', [
        Validators.required, Validators.minLength(3)
        ]
      ],
      confirmPassword: ['', [Validators.required, Validators.minLength(3)
      ]
      ]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.changeForm.controls; }

  onSubmit(id) {
    this.submitted = true;
    const controls = this.changeForm.controls;

    // stop here if form is invalid
    if (this.changeForm.invalid) {
      return;
    }

    this.auth.GetPassword(this.customer.accessToken).subscribe(
      result => {
        this.loading = true;
        const oldpassword = Md5.hashStr(controls['oldpassword'].value);
        const newpassword = Md5.hashStr(controls['password'].value);
        // console.log(oldpassword);
        // console.log(result[0].password);
        if (result[0].password === newpassword) {
          this.toastrService.error('New Password is Same With Old Password');
        } else if (result[0].password === oldpassword) {
          const data = {
            id: id,
            password: controls['password'].value
          };
          // console.log(data);
          this.auth.accountChangepassword(data).subscribe(
            res => {
              this.message = res;
              this.submitted = false;
              this.changeForm.reset();
              this.toastrService.success('Change Password Success');
              // this.authNoticeService.setNotice('Success Update Password', 'success');
            }
          );
        } else {
          this.toastrService.error('Password is Wrong');
        }
      }
    );

  }

}
