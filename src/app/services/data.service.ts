import { Injectable } from '@angular/core';

import { first, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { RouteService } from './route.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataObservable: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private dataAvailableObservable: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient, private routeService: RouteService) {
    this.routeService.venueId()
      .pipe(filter(venueId => venueId != null))
      .pipe(first())
      .subscribe(venueId => this.sendRequest(venueId))
  }

  dataAvailable() {
    return this.dataAvailableObservable;
  }

  private sendRequest(venueId: string) {
    console.log(`subscribing on venueId:${venueId}`);

    const url = `${environment.apiUrl}/host/${venueId}/state`;
    const options = { withCredentials: true };
    const httpObservable = this.http.get(url, options).pipe(first());

    httpObservable.subscribe(data => this.onData(data));
  }

  private onData(data) {
    this.dataObservable.next(data);
    this.dataAvailableObservable.next(true)
  }

}
