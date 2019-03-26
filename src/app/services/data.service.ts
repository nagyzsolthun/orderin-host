import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import InitState from '../domain/InitState';
import { HttpCacheService } from './http-cache.service';
import { RouteParamsService } from './route-params.service';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private initState$: Observable<InitState>;

  constructor(private http: HttpCacheService, private routeParamsService: RouteParamsService) {
    this.initState$ = this.routeParamsService.venueId()
      .pipe(switchMap(venueId => this.initState(venueId)))
  }

  venue() {
    return this.initState$.pipe(map(state => state.venue));
  }

  private initState(venueId: string): Observable<InitState> {
    const url = `${environment.apiUrl}/initStateOfHost/${venueId}`;
    return this.http.get(url).pipe(map(json => InitState.fromJson(json)));
  }

}
