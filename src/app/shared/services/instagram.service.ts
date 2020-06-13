import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { BehaviorSubject, Observable, of} from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class InstagramService {

  // Initialize
// tslint:disable-next-line: deprecation
  constructor(private http: Http) { }

  // Instagram Array
  public getInstagramData() {
    // tslint:disable-next-line: max-line-length
    return this.http.get('https://api.instagram.com/v1/users/self/media/recent/?access_token=IGQVJYbFY1eXlUSzJUWEExZA0dORWxWVUEtZAUlmUVFRMWtQS21uLXlUdGZAWYkI5aU94X0I3dmtjRjlCSFRkVDd1VWtVcTh4b3NMOVFHQXVGanJ2TGZAoR3R5VnJuSGlRR1NYOVBwUkJfZAU1oOGk5a1RSOTFoRXhURFVSN1o4&count=15');
  }

}
