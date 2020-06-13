import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthLoginService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactForm: FormGroup;
  submitted = false;
  loading = false;
  message: any;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private auth: AuthLoginService
  ) { }

  ngOnInit() {
    this.initContactForm();
  }

   /**
   * Form initalization
   * default params, validators
   */
  initContactForm() {
    this.contactForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3)
      ]
    ],
    phone: ['', [
      Validators.required,
      ]
    ],
    email: ['', [ Validators.required, Validators.email, Validators.minLength(10) ]
    ],
    subject: ['', [
      Validators.required,
      ]
    ],
    massage: ['']
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.contactForm.controls; }

  /**
   * form submit
   */
  onSubmit() {
    this.submitted = true;
    const controls = this.contactForm.controls;

    // stop here if form is invalid
    if (this.contactForm.invalid) {
      return;
    }

    this.loading = true;

    const massage = {
      first: controls['firstname'].value,
      sub: controls['subject'].value,
      phone: controls['phone'].value,
      email: controls['email'].value,
      msg: controls['massage'].value
    };

    this.auth.sendMassageEmail(massage).subscribe(res => {
      if (res) {
        this.toastrService.success('Send Massage Success');
      }
    },
    err => console.error(err));
  }

}
