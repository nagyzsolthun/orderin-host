import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { DataService } from './data.service';
import { RouteParamsService } from './route-params.service';

class MockHttpCLient {
  dataObservable = new BehaviorSubject<any>(null);
  get(url, options) {
    return this.dataObservable;
  }
}

class MockRouteParamsService {
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
        { provide: RouteParamsService, useClass: MockRouteParamsService },
      ]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));
});
