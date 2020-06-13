// mymodal.component.ts
import { Component, OnInit, Input, ViewChild, ViewContainerRef, ElementRef, Inject, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingService } from '../../../../../shared/services/setting.service';
import { OrderService } from '../../../../../shared/services/order.service';

declare var $: any;

@Component({
  selector: 'app-resi',
  templateUrl: './modal-resi.component.html',
  styleUrls: ['./modal-resi.component.scss']
})
export class ModalResiComponent implements OnInit {

  public sortByOrder: String = 'desc';

  constructor(
    public sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ModalResiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private settingService: SettingService,
    private orderService: OrderService) {
  }

  ngOnInit() {
    // console.log(this.data);
  }

  close() {
    this.dialogRef.close();
  }

}
