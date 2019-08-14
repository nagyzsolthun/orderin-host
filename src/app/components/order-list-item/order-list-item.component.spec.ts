import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListItemComponent } from './order-list-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import Order from 'src/app/domain/Order';

describe('OrderListItemComponent', () => {
  let fixture: ComponentFixture<OrderListItemComponent>;
  let component: OrderListItemComponent;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderListItemComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListItemComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
  });

  it('should add 2 trailing 0s to 1-digit counters', () => {
    component.order = Order.fromJson({id:"id", counter:1, orderItems:[], tableName:{en:"table"}});
    fixture.detectChanges();
    expect(compiled.querySelector("div").innerText).toBe("001");
  });

  it('should add 1 trailing 0 to 2-digit counters', () => {
    component.order = Order.fromJson({id:"id", counter:11, orderItems:[], tableName:{en:"table"}});
    fixture.detectChanges();
    expect(compiled.querySelector("div").innerText).toBe("011");
  });

  it('should add no trailing 0 to 3-digit counters', () => {
    component.order = Order.fromJson({id:"id", counter:111, orderItems:[], tableName:{en:"table"}});
    fixture.detectChanges();
    expect(compiled.querySelector("div").innerText).toBe("111");
  });

});
