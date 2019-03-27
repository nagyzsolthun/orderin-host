import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, of, throwError } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import InitState from '../domain/InitState';
import Venue from '../domain/Venue';
import { HttpCacheService } from './http-cache.service';
import { RouteParamsService } from './route-params.service';
import User from '../domain/User';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private initState$: Observable<InitState>;

  constructor(private http: HttpCacheService, private routeParamsService: RouteParamsService) {
    this.initState$ = this.routeParamsService.venueId().pipe(
      switchMap(venueId => this.initState(venueId))
    );
  }

  user(): Observable<User> {
    return this.initState$.pipe(
      map(state => state.user),
      catchError(err => of(null))  // definition of unauthenticated TODO check for 401
    );
  }

  venue(): Observable<Venue> {
    return this.initState$.pipe(map(state => state.venue));
  }

  private initState(venueId: string): Observable<InitState> {
    const url = `${environment.apiUrl}/initStateOfHost/${venueId}`;
    return this.http.get(url).pipe(map(json => InitState.fromJson(json)));
  }

}
