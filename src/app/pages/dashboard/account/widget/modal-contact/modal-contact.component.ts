
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../../../../shared/classes/customer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../shared/reducers';
import { currentUser } from '../../../../../shared/selectors/auth.selectors';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthLoginService } from '../../../../../shared/services/auth.service';
import { DatePipe } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-edit-contact',
  templateUrl: './modal-contact.component.html',
  styleUrls: ['./modal-contact.component.scss'],
  providers: [ DatePipe ]
})
export class ModalContactComponent implements OnInit, OnDestroy {
  customer$: Observable<Customer>;
  accountContact: FormGroup;
  loading = false;
  message: any = [];
  customer: Customer;

// tslint:disable-next-line: no-inferrable-types
  public counter:   number = 1;
  public variantImage:   any = '';
  public selectedColor:   any = '';
  public selectedSize:   any = '';

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private auth: AuthLoginService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.customer$ = this.store.pipe(select(currentUser));
    this.customer$.subscribe(
      result => {
        this.customer = result;
        // console.log(this.customer);
      }
    );
    this.initaccountForm();
    this.accountContact.controls['email'].disable();
  }

  phoneNumber(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  initaccountForm() {
    this.accountContact = this.fb.group({
      email: [this.customer.email, Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(10),
        Validators.maxLength(320) ])
      ],
      phone: [this.customer.phone, Validators.compose([
        Validators.required,
        ])
      ],
    });
  }

  ngOnDestroy() {
    $('.quickviewm').modal('hide');
  }

  /**
   * submit form
   */
  submit(id) {
    const controls = this.accountContact.controls;

    // check form
    if (this.accountContact.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
        );
    }

   const editData = this.prepareData(id);
   this.saveData(editData);
   return;
    /*
    const formatDate = this.datePipe.transform(controls['dob'].value, 'yyyy-MM-dd');
    const data = {
      id: id,
      firstname: controls['firstname'].value,
      lastname: controls['lastname'].value,
      dob: formatDate,
      gender: controls['gender'].value
    };
    console.log(data);
    const formData: FormData = new FormData();
    formData.append('id', id);
    formData.append('firstname', data.firstname);
    formData.append('lastname', data.lastname);
    formData.append('dob', data.dob);
    formData.append('gender', data.gender);

    this.auth.accountEditContact(data).subscribe(res => {
      this.message = res;
      this.ngOnDestroy();
    });
    */
  }

  prepareData(id): Customer {
    const controls = this.accountContact.controls;
    // const formatDate = this.datePipe.transform(controls['dob'].value, 'yyyy-MM-dd');
    const _customer = new Customer();
    _customer.clear();
    _customer.id = id;
    _customer.email = controls['email'].value;
    _customer.phone = controls['phone'].value;
    return _customer;
  }

  saveData(_customer) {
    this.auth.accountContactedit(_customer).subscribe(res => {
      this.message = res;
      this.ngOnDestroy();
    });
  }
}
