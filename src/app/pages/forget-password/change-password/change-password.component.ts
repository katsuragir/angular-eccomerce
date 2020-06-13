import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthLoginService } from '../../../shared/services/auth.service';
import { AuthNoticeService } from '../../../shared/services/auth-notice.service';
import { Customer } from '../../../shared/classes/customer';
import { find } from 'lodash';
import { MustMatch } from '../../register/must-match.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  forgetForm: FormGroup;
  loading = false;
  cus: any = [];
  submitted = false;
  id_customer: any;
  message: any[];

  constructor(
    private fb: FormBuilder,
    private auth: AuthLoginService,
    private authNoticeService: AuthNoticeService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.auth.findAccount(id).subscribe(
        result => {
          if (!result) {
            return this.router.navigate(['/pages/404']);
          }
          this.id_customer = result[0].id_customer;
        }
      );
    });
   }

  ngOnInit() {
    this.initFormControl();
  }

  /**
   * Create Form Group
   */
  initFormControl() {
    this.forgetForm = this.fb.group({
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
  get f() { return this.forgetForm.controls; }

  /**
   * Submit Form
   */
  onSubmit() {
    this.submitted = true;
    const control = this.forgetForm.controls;

   // stop here if form is invalid
   if (this.forgetForm.invalid) {
    return;
    }

    this.loading = true;

      const dataAkun = {
        id: this.id_customer,
        password: control['password'].value
      };
      // console.log(dataAkun);
      return this.auth.accountChangepassword(dataAkun).subscribe(
        res => {
          this.message = res;
          this.submitted = false;
          this.forgetForm.reset();
          this.toastrService.success('Change Password Sucscess');
          this.router.navigateByUrl('/pages/login');
          // this.authNoticeService.setNotice('Success Update Password', 'success');
        }
      );
  }

}
