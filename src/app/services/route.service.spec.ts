import { TestBed, inject } from '@angular/core/testing';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { RouteService } from './route.service';
import { Navigation } from 'selenium-webdriver';


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

    router.events.next(new NavigationEnd(1, "url", "url"));
    service.venueId().subscribe(venueId => expect(venueId).toBeNull);

    route.firstChild.params.next({ venueId: "venueId" });
    service.venueId().subscribe(venueId => expect(venueId).toBe("venueId"));

  }));
});
