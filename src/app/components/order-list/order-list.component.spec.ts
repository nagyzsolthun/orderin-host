import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListComponent } from './order-list.component';
import Order from 'src/app/domain/Order';
import { of } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockOrderService {
  getOrders() {
    const order1 = Order.fromJson({id:"id1", counter:1, orderItems:[], tableName:{en:"table1"}});
    const order2 = Order.fromJson({id:"id2", counter:2, orderItems:[], tableName:{en:"table2"}});
    return of([order1, order2]);
  }
}

describe('OrderListComponent', () => {
  let fixture: ComponentFixture<OrderListComponent>;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderListComponent ],
      providers: [
        { provide: OrderService, useClass: MockOrderService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListComponent);
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should render orders', () => {
    const orderElements = compiled.querySelectorAll(".order");
    expect(orderElements.length).toBe(2);
    expect(orderElements[0].innerHTML).toBe("001");
    expect(orderElements[1].innerHTML).toBe("002");
  });
});
