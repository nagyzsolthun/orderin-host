import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Observable, ReplaySubject } from 'rxjs';
import Order from 'src/app/domain/Order';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit {

  orders$: Observable<Order[]>;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orders$ = this.orderService.getOrders();
  }

  formatCounter(counter: number): string {
    if(counter > 99) return counter.toString();
    if(counter > 9) return "0" + counter;
    if(counter > 0) return "00" + counter;
    return counter.toString(); // negative, should never reach
  }

}
