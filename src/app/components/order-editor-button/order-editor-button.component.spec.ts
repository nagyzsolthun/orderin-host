import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEditorButtonComponent } from './order-editor-button.component';
import { OrderService } from 'src/app/services/order.service';
import { Observable, of, empty, never, throwError } from 'rxjs';
import Order from 'src/app/domain/Order';

class MockOrderService {
  orderUpdate$: Observable<any>;
  orderDelete$: Observable<any>;
  requestOrderUpdate() { return this.orderUpdate$; }
  requestOrderDelete() { return this.orderDelete$; }
}

describe('OrderEditorButtonComponent', () => {
  let fixture: ComponentFixture<OrderEditorButtonComponent>;
  let component: OrderEditorButtonComponent;
  let compiled: HTMLElement;

  let orderService: MockOrderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderEditorButtonComponent ],
      providers: [
        { provide: OrderService, useClass: MockOrderService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    orderService = TestBed.get(OrderService);

    fixture = TestBed.createComponent(OrderEditorButtonComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
  });

  it('should show prepare in CREATED state', () => {
    const order = Order.fromJson({id:"id1", counter:1, orderItems:[], tableName:{en:"table1"}, state:"CREATED"});
    component.order = order;
    fixture.detectChanges();
    expect(compiled.querySelector(".label").classList).toContain("prepare")
  });

  it('should show ready in PREPARING state', () => {
    const order = Order.fromJson({id:"id1", counter:1, orderItems:[], tableName:{en:"table1"}, state:"PREPARING"});
    component.order = order;
    fixture.detectChanges();
    expect(compiled.querySelector(".label").classList).toContain("ready")
  });

  it('should show taken in READY state', () => {
    const order = Order.fromJson({id:"id1", counter:1, orderItems:[], tableName:{en:"table1"}, state:"READY"});
    component.order = order;
    fixture.detectChanges();
    expect(compiled.querySelector(".label").classList).toContain("taken")
  });

  it('should show delete in TAKEN state', () => {
    const order = Order.fromJson({id:"id1", counter:1, orderItems:[], tableName:{en:"table1"}, state:"TAKEN"});
    component.order = order;
    fixture.detectChanges();
    expect(compiled.querySelector(".label").classList).toContain("delete")
  });

  it('should request update in CREATED state', () => {
    orderService.orderUpdate$ = of(null);
    spyOn(orderService, "requestOrderUpdate").and.callThrough();

    const order = Order.fromJson({id:"id1", counter:1, orderItems:[], tableName:{en:"table1"}, state:"CREATED"});
    component.order = order;
    component.click();
    fixture.detectChanges();

    expect(orderService.requestOrderUpdate).toHaveBeenCalled();
  });

  it('should request delete in TAKEN state', () => {
    orderService.orderDelete$ = of(null);
    spyOn(orderService, "requestOrderDelete").and.callThrough();

    const order = Order.fromJson({id:"id1", counter:1, orderItems:[], tableName:{en:"table1"}, state:"TAKEN"});
    component.order = order;
    component.click();
    fixture.detectChanges();

    expect(orderService.requestOrderDelete).toHaveBeenCalled();
  });

  it('should show loading when request is waiting', () => {
    orderService.orderUpdate$ = never();

    const order = Order.fromJson({id:"id1", counter:1, orderItems:[], tableName:{en:"table1"}, state:"CREATED"});
    component.order = order;
    component.click();
    fixture.detectChanges();

    console.log(compiled)
    expect(compiled.querySelector(".loading")).toBeTruthy();
  });

  it('should show error on error', () => {
    orderService.orderUpdate$ = throwError(null);

    const order = Order.fromJson({id:"id1", counter:1, orderItems:[], tableName:{en:"table1"}, state:"CREATED"});
    component.order = order;
    component.click();
    fixture.detectChanges();

    console.log(compiled)
    expect(compiled.querySelector(".error")).toBeTruthy();
  });
});
