import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEditorComponent } from './order-editor.component';
import { of, Observable, ReplaySubject } from 'rxjs';
import Order from 'src/app/domain/Order';
import { OrderService } from 'src/app/services/order.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import OrderItem from 'src/app/domain/OrderItem';

class MockRouter {
  navigate() { }
}

class MockRoute {
  paramMap: Observable<Map<string,string>>;
  constructor() {
    const params = new Map<string,string>();
    params.set("counter", "1");
    params.set("venueId", "venueId");
    this.paramMap = of(params);
  }
}

class MockOrderService {
  orders$ = new ReplaySubject<Order[]>(1);
  getOrders() { return this.orders$; }
}

const item1 = OrderItem.fromJson({
  productId: "productId1",
  portionId: "portionId1",
  productName: {en: "product1"},
  portionName: {en: "portion1"},
  price: { HUF: 300 },
  count: 1
});

const item2 = OrderItem.fromJson({
  productId: "productId2",
  portionId: "portionId2",
  productName: {en: "product2"},
  portionName: {en: "portion2"},
  price: { HUF: 600 },
  count: 2
});

describe('OrderEditorComponent', () => {
  let fixture: ComponentFixture<OrderEditorComponent>;
  let compiled: HTMLElement;

  let router: MockRouter;
  let orderService: MockOrderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderEditorComponent ],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockRoute },
        { provide: OrderService, useClass: MockOrderService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    orderService = TestBed.get(OrderService);
    router = TestBed.get(Router);

    fixture = TestBed.createComponent(OrderEditorComponent);
    compiled = fixture.debugElement.nativeElement;
  });

  it('should show the items', () => {
    const order = Order.fromJson({id:"id1", counter:1, orderItems:[item1, item2], tableName:{en:"table1"}});
    orderService.orders$.next([order]);
    fixture.detectChanges();

    const items = compiled.querySelectorAll("app-order-editor-item");
    expect(items.length).toBe(2);
  });

  it('should show the button', () => {
    const order = Order.fromJson({id:"id1", counter:1, orderItems:[item1, item2], tableName:{en:"table1"}});
    orderService.orders$.next([order]);
    fixture.detectChanges();

    const button = compiled.querySelectorAll("app-order-editor-button");
    expect(button).toBeTruthy();
  });

  it('should redirect when non-matching counter', () => {
    spyOn(router, 'navigate');

    const order = Order.fromJson({id:"id1", counter:2, orderItems:[item1, item2], tableName:{en:"table1"}});  // counter doesn't match
    orderService.orders$.next([order]);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(["venueId"]);
  });
});
