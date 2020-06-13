import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable()

export class InterceptService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userToken = 'f9530027443a458f45633c83347502506e9382b4f2f49d217bc5313b9f0bf8a9';
    const cloneReq = req.clone({
      headers: req.headers.set('provider', `${userToken}`),
    });
    return next.handle(cloneReq);
  }
}
