import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEditorComponent } from './order-editor.component';
import { of, Observable } from 'rxjs';
import Order from 'src/app/domain/Order';
import { OrderService } from 'src/app/services/order.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import OrderItem from 'src/app/domain/OrderItem';

class MockOrderService {
  getOrders() {
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
    
    const order = Order.fromJson({id:"id1", counter:1, orderItems:[item1, item2], tableName:{en:"table1"}});
    return of([order]);
  }
}

class MockRoute {
  paramMap: Observable<Map<string,string>>;
  constructor() {
    const params = new Map<string,string>();
    params.set("counter", "1");
    this.paramMap = of(params);
  }
}

describe('OrderEditorComponent', () => {
  let fixture: ComponentFixture<OrderEditorComponent>;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderEditorComponent ],
      providers: [
        { provide: OrderService, useClass: MockOrderService },
        { provide: ActivatedRoute, useClass: MockRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderEditorComponent);
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should show the items', () => {
    const items = compiled.querySelectorAll("app-order-editor-item");
    expect(items.length).toBe(2);
  });
});
