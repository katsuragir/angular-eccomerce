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
  selector: 'app-edit-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
  providers: [ DatePipe ]
})
export class ModalInfoComponent implements OnInit, OnDestroy {
  customer$: Observable<Customer>;
  accountInfo: FormGroup;
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
  }

  initaccountForm() {
    const date = this.customer.dob.substring(0, 10);
    this.accountInfo = this.fb.group({
      firstname: [this.customer.firstname, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ])
    ],
    lastname: [this.customer.lastname, Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
      ])
    ],
    dob: [date, Validators.compose([
      Validators.required
      ])
    ],
    gender: [this.customer.gender, Validators.compose([
      Validators.required
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
    const controls = this.accountInfo.controls;

    // check form
    if (this.accountInfo.invalid) {
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

    this.auth.accountEditinfo(data).subscribe(res => {
      this.message = res;
      this.ngOnDestroy();
    });
    */
  }

  prepareData(id): Customer {
    const controls = this.accountInfo.controls;
    const formatDate = this.datePipe.transform(controls['dob'].value, 'yyyy-MM-dd');
    const _customer = new Customer();
    _customer.clear();
    _customer.id = id;
    _customer.firstname = controls['firstname'].value;
    _customer.lastname = controls['lastname'].value;
    _customer.dob = formatDate;
    _customer.gender = controls['gender'].value;
    return _customer;
  }

  saveData(_customer) {
    // console.log(_customer);
    this.auth.accountEditinfo(_customer).subscribe(res => {
      this.message = res;
      this.ngOnDestroy();
    });
  }
}
