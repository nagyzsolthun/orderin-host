import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { RouteService } from './route.service';
import { DataService } from './data.service';

class MockHttpCLient {
  dataObservable = new BehaviorSubject<any>(null);
  get(url, options) {
    return this.dataObservable;
  }
}

class MockRouteService {
  venueIdObservable = new BehaviorSubject<string>(null);
  venueId() {
    return this.venueIdObservable;
  }
}

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataService,
        { provide: HttpClient, useClass: MockHttpCLient },
        { provide: RouteService, useClass: MockRouteService },
      ]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));
});
