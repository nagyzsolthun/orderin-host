import { TestBed, inject } from '@angular/core/testing';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { RouteService } from './route.service';


class MockRouter {
  events = new BehaviorSubject<NavigationEnd>(null);
}

class MockRoute {
  firstChild = {
    params: new BehaviorSubject<any>(null)
  }
}

describe('RouteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RouteService,
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockRoute },
      ]
    });
  });

  it('should return venueId when available', inject([RouteService, Router, ActivatedRoute], (
    service: RouteService,
    router: MockRouter,
    route: MockRoute) => {

    // TODO this does not test anything
    const spy = spyOn(service, "venueId").and.returnValue(Observable.create("venueId"));
    router.events.next({} as NavigationEnd);
    route.firstChild.params.next({ venueId: "venueId" });

  }));
});
