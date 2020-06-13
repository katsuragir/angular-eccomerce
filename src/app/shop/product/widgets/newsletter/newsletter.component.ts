import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingService } from '../../../../shared/services/setting.service';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss'],
  providers: [DatePipe]
})
export class NewsletterComponent implements OnInit, OnDestroy {

  public date = new Date();
  public interval: any;
  public totaldonasi: any;

  constructor(private settingService: SettingService, private datepipe: DatePipe) { }

  ngOnInit() {
    this.settingService.donasicovid().subscribe(
      result => {
        this.totaldonasi = result;
      }
    );
    this.date = new Date();
    const news = JSON.parse(localStorage.getItem('entryState'));
  	if(!news){
      $('.newsletterm').modal({backdrop: 'static', keyboard: false});
    } else {
      if (this.datepipe.transform(new Date(), 'dd/MM/yyyy') > this.datepipe.transform(news.date, 'dd/MM/yyyy')) {
        localStorage.removeItem('entryState');
        this.ngOnInit();
      }
    }
  }

  ngOnDestroy() {

  }

  close() {
    const news = {
      name: 'newsletter',
      date: new Date()
    };
    localStorage.setItem('entryState', JSON.stringify(news));

  }
}
