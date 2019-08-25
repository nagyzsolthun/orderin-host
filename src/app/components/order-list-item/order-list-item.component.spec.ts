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

  it('should show counter', () => {
    component.order = Order.fromJson({id:"id", counter:"001", orderItems:[], tableName:{en:"table"}});
    fixture.detectChanges();
    expect(compiled.querySelector("div").innerText).toBe("001");
  });

});
