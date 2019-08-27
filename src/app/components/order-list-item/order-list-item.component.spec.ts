import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListItemComponent } from './order-list-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import Order from 'src/app/domain/Order';
import { of } from 'rxjs';
import { RouteParamsService } from 'src/app/services/route-params.service';

class MockRouteParamsService {
  venueId() { return of("venueId"); }
}

describe('OrderListItemComponent', () => {
  let fixture: ComponentFixture<OrderListItemComponent>;
  let component: OrderListItemComponent;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ OrderListItemComponent ],
      providers: [
        { provide: RouteParamsService, useClass: MockRouteParamsService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListItemComponent);
    component = fixture.componentInstance;
    component.order = Order.fromJson({id:"id", counter:"001", orderItems:[], tableName:{en:"table"}, state:"ORDERSTATE", host:"host"});
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should show counter, state, host', () => {
    console.log(compiled)
    expect(compiled.querySelector(".counter").textContent).toBe("001");
    expect(compiled.querySelector(".state").textContent).toBe("ORDERSTATE");
    expect(compiled.querySelector(".host").textContent).toBe("host");

  });

  it('should redirect when clicked', () => {
    console.log(compiled.querySelector("a"))
    expect(compiled.querySelector("a").getAttribute("href")).toBe("/venueId/order/001");
  });

});
