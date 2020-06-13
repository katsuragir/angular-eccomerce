import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthLoginService } from '../../shared/services/auth.service';
import { AuthNoticeService } from '../../shared/services/auth-notice.service';
import { Customer } from '../../shared/classes/customer';
import { find } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgetForm: FormGroup;
  loading = false;
  cus: any = [];
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthLoginService,
    private authNoticeService: AuthNoticeService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initFormControl();
    this.auth.customer().subscribe(
      res => {
        this.cus = res;
        // console.log(this.customer);
      }
    );
  }

  /**
   * Create Form Group
   */
  initFormControl() {
    this.forgetForm = this.fb.group({
      email: ['', [
        Validators.required, Validators.email
        ]
      ]
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

    const email = control['email'].value;

    // console.log(email);

    const checkEmail = find(this.cus, function(item: Customer) {
      return (item.email.toLowerCase() === email.toLowerCase());
    });

    if (!checkEmail) {
        this.toastrService.error('Email Is Not Register');
      return;
    }

    if (checkEmail) {
      const dataAkun = {
        id: checkEmail.id_customer,
        accessToken: checkEmail.accessToken,
        email: checkEmail.email,
        firstname: checkEmail.firstname,
        lastname: checkEmail.lastname
      };
      // console.log(dataAkun);
      return this.auth.sendMail(dataAkun).subscribe(
        res => {
          this.toastrService.success(`Send Email To ${dataAkun.email} Success`);
          this.router.navigateByUrl('/pages/login');
        }
      );
    }

    return checkEmail;
  }

}
