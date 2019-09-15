import { TestBed, async } from '@angular/core/testing';

import { OrderService } from './order.service';
import { of, ReplaySubject, empty } from 'rxjs';
import Order from '../domain/Order';
import { DataService } from './data.service';
import { RouteParamsService } from './route-params.service';
import { HttpClient } from '@angular/common/http';
import { first, map } from 'rxjs/operators';
import OrderUpdate from '../domain/OrderUpdate';

class MockRouteParamsService {
  venueId() { return of("venueId") }
}

class MockDataService {
  user$ = new ReplaySubject<string>(1);
  user() { return this.user$; }
}

class MockHttpClient {
  get() {
    const order1 = Order.fromJson({id:"id1", counter:1, orderItems:[], tableName:{en:"table1"}, state:"CREATED"});
    const order2 = Order.fromJson({id:"id2", counter:2, orderItems:[], tableName:{en:"table2"}, state:"CREATED"});
    return of([order1, order2]);
  }
  put() {
    return of(OrderUpdate.fromJson({orderId:"id1", state:"PREPARING", host:"host"}));
  }
  delete() {
    return empty();
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
    window["EventSource"] = MockEventSource as any;
    MockEventSource.lastInstance = null;
  })

  it('waits for authentication before fetching orders', async(() => {
    const dataService = TestBed.get(DataService) as MockDataService;
    const httpClient = TestBed.get(HttpClient) as MockHttpClient;
    spyOn(httpClient, "get").and.callThrough();

    TestBed.get(OrderService) as OrderService;
    expect(httpClient.get).toHaveBeenCalledTimes(0);

    dataService.user$.next(null);
    expect(httpClient.get).toHaveBeenCalledTimes(0);

    dataService.user$.next("user");
    expect(httpClient.get).toHaveBeenCalledTimes(1);
  }));

  it('updates order on orderUpdate', async(() => {
    const httpClient = TestBed.get(HttpClient) as MockHttpClient;
    spyOn(httpClient, "put").and.callThrough();

    const service = TestBed.get(OrderService) as OrderService;
    service.getOrders()
      .pipe(first(), map(orders => orders[0]))
      .subscribe(order => expect(order.state).toBe("CREATED"));

    service.requestOrderUpdate("id", "state");  // parameters irrelevant here
    expect(httpClient.put).toHaveBeenCalled();
    service.getOrders()
      .pipe(first(), map(orders => orders[0]))
      .subscribe(order => expect(order.state).toBe("PREPARING"));
  }));

  it('deletes order on orderDelete', async(() => {
    const httpClient = TestBed.get(HttpClient) as MockHttpClient;
    spyOn(httpClient, "delete").and.callThrough();

    const service = TestBed.get(OrderService) as OrderService;
    service.getOrders().pipe(first()).subscribe(orders => expect(orders.length).toBe(2));

    service.requestOrderDelete("id");  // parameters irrelevant here
    expect(httpClient.delete).toHaveBeenCalled();
    service.getOrders().pipe(first()).subscribe(orders => expect(orders.length).toBe(1));
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
