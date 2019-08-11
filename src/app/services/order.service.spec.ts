import { TestBed, async } from '@angular/core/testing';

import { OrderService } from './order.service';
import { of, ReplaySubject } from 'rxjs';
import Order from '../domain/Order';
import { DataService } from './data.service';
import { RouteParamsService } from './route-params.service';
import { HttpClient } from '@angular/common/http';
import { NgZone } from '@angular/core';
import { first } from 'rxjs/operators';

class MockRouteParamsService {
  venueId() { return of("venueId") }
}

class MockDataService {
  user$ = new ReplaySubject<string>(1);
  user() { return this.user$; }
}

class MockHttpClient {
  get() {
    const order1 = Order.fromJson({id:"id1", counter:1, orderItems:[], tableName:{en:"table1"}});
    const order2 = Order.fromJson({id:"id2", counter:2, orderItems:[], tableName:{en:"table2"}});
    return of([order1, order2]);
  }
}

class MockEventSource {
  static lastInstance: MockEventSource;
  constructor(url: string) {
    MockEventSource.lastInstance = this;
  }

  onmessage: (message: any) => any;
}


describe('OrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderService,
        { provide: RouteParamsService, useClass: MockRouteParamsService },
        { provide: DataService, useClass: MockDataService },
        { provide: HttpClient, useClass: MockHttpClient },
      ]
    });
  });

  beforeEach(() => {
    window["EventSource"] = MockEventSource;
    MockEventSource.lastInstance = null;
  })

  it('waits for authentication before fetching orders', async(() => {
    const dataService = TestBed.get(DataService) as MockDataService;
    const httpClient = TestBed.get(HttpClient) as MockHttpClient;
    spyOn(httpClient, "get").and.callThrough();

    const service = TestBed.get(OrderService) as OrderService;
    expect(httpClient.get).toHaveBeenCalledTimes(0);

    dataService.user$.next(null);
    expect(httpClient.get).toHaveBeenCalledTimes(0);

    dataService.user$.next("user");
    expect(httpClient.get).toHaveBeenCalledTimes(1);
  }));

  it('adds orders coming from SSE', async(() => {
    const dataService = TestBed.get(DataService) as MockDataService;
    const service = TestBed.get(OrderService) as OrderService;

    dataService.user$.next("user");
    service.getOrders().pipe(first()).subscribe(orders => {
      expect(orders.length).toBe(2);
      expect(orders[0].id).toBe("id1");
      expect(orders[1].id).toBe("id2");
    });

    const order3 = Order.fromJson({id:"id3", counter:3, orderItems:[], tableName:{en:"table3"}});
    const orderEventsSource = MockEventSource.lastInstance;
    orderEventsSource.onmessage({ data: JSON.stringify(order3) });
    service.getOrders().pipe(first()).subscribe(orders => {
      expect(orders.length).toBe(3);
      expect(orders[0].id).toBe("id1");
      expect(orders[1].id).toBe("id2");
      expect(orders[2].id).toBe("id3");
    });

  }));
});
