import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { SettingService } from './shared/services/setting.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DatePipe]
})
export class AppComponent {

  deviceInfo = null;
  visitor: any;
  ip: any;

   constructor(
     translate: TranslateService,
     public router: Router,
     private settingService: SettingService,
     private deviceService: DeviceDetectorService,
     private datePipe: DatePipe) {
      translate.setDefaultLang('en');
      translate.addLangs(['en', 'fr']);
      this.settingService.getIpAddress().subscribe(
        res => {
            this.deviceInfo = this.deviceService.getDeviceInfo();
            const isMobile = this.deviceService.isMobile();
            const isTablet = this.deviceService.isTablet();
            const isDesktopDevice = this.deviceService.isDesktop();
            // console.log(this.deviceInfo);
            // console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
            // console.log(isTablet);  // returns if the device us a tablet (iPad etc)
            // console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.

            // const visitor = JSON.parse(localStorage.getItem('sessionid'));

            this.ip = res.ip;

            const name = 'sessionid';
            let token = '';

            if (!localStorage.getItem('authce9d77b308c149d5992a80073637e4d5')) {
              token = 'Visitor';
            } else {
              token = localStorage.getItem('authce9d77b308c149d5992a80073637e4d5');
            }
            this.deviceInfo = this.deviceService.getDeviceInfo();
            const visit = {
              ip: res.ip,
              token: token,
              static: this.deviceInfo,
              date: new Date(),
              ket: 'visitor'
            };

            this.settingService.traffic(visit).subscribe(
              result => {
                console.log(result);

              }
            );
          /*
          if (JSON.parse(localStorage.getItem('sessionid')) !== res.ip) {
              const name = 'sessionid';
              let token = '';

                if (!localStorage.getItem('authce9d77b308c149d5992a80073637e4d5')) {
                  token = 'Visitor';
                } else {
                  token = localStorage.getItem('authce9d77b308c149d5992a80073637e4d5');
                }

                const visit = {
                  ip: res.ip,
                  token: token
                };
              localStorage.setItem(name, JSON.stringify(visit));
          }
          */
        }
      );

   }



}
