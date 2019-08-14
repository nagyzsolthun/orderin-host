import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import Venue from 'src/app/domain/Venue';
import { of } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import Order from 'src/app/domain/Order';
import { OrderService } from 'src/app/services/order.service';

class MockDataService {
  venue() {
    return of(Venue.fromJson({ id: "id", name: "VenueName" }));
  }
}

class MockOrderService {
  getOrders() {
    const order1 = Order.fromJson({id:"id1", counter:1, orderItems:[], tableName:{en:"table1"}});
    const order2 = Order.fromJson({id:"id2", counter:2, orderItems:[], tableName:{en:"table2"}});
    return of([order1, order2]);
  }
}

describe('NavBarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: OrderService, useClass: MockOrderService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should render Orders', () => {
    const orders = compiled.querySelector(":nth-child(1)");
    expect(orders.textContent).toBe("Orders");
  });

  it('should render Products', () => {
    const orders = compiled.querySelector(":nth-child(2)");
    expect(orders.textContent).toBe("Products");
  });

  it('should render Orders', () => {
    const order1 = compiled.querySelector(":nth-child(3)");
    const order2 = compiled.querySelector(":nth-child(4)");
    expect(order1.textContent).toBe("1");
    expect(order2.textContent).toBe("2");
  });

});
