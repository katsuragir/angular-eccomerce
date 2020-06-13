import { Component, OnInit } from '@angular/core';
import { SettingService } from '../../shared/services/setting.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-donasi-covid',
  templateUrl: './donasi-covid.component.html',
  styleUrls: ['./donasi-covid.component.scss'],
  providers: [DatePipe]
})
export class DonasiCovidComponent implements OnInit {

  public totaldonasi: any;
  public date = new Date();

  constructor(private settingService: SettingService, private datepipe: DatePipe) { }

  ngOnInit() {
    this.settingService.donasicovid().subscribe(
      result => {
        this.totaldonasi = result;
      }
    );
  }

}
