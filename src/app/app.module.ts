import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { Http, HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShopModule } from './shop/shop.module';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
// import { rootRouterConfig } from './app-routing.module';
import { AppRoutingModule } from './app-routing.module';
// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EmbedVideo } from 'ngx-embed-video';
import { DeviceDetectorModule } from 'ngx-device-detector';
import {
  MatDialogModule
} from '@angular/material/dialog';
// State
import { metaReducers, reducers } from './shared/reducers';
// components
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HomeElevenComponent } from './shop/home-11/home-eleven.component';
import * as $ from 'jquery';
// Auth
import { PagesModule } from './pages/pages.module';
import { AuthLoginService } from './shared/services/auth.service';
import { InterceptService } from './shared/services/interception.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    MatDialogModule,
// tslint:disable-next-line: deprecation
    HttpModule,
    BrowserAnimationsModule,
    ShopModule,
    SharedModule,
    HttpClientModule,
    DeviceDetectorModule.forRoot(),
    EmbedVideo.forRoot(),
    StoreModule.forRoot(reducers, {metaReducers}),
    // StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([]),
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    PagesModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: false,
      enableHtml: true,
    }),
  ],
  providers: [
    AuthLoginService,
    Title,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
