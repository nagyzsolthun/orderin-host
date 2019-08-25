import { Component, OnInit } from '@angular/core';
import Order from 'src/app/domain/Order';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-editor',
  templateUrl: './order-editor.component.html',
  styleUrls: ['./order-editor.component.css']
})
export class OrderEditorComponent implements OnInit {

  order$: Observable<Order>;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
    ) { }

  ngOnInit() {
    const counter$ = this.route.paramMap.pipe(
      map(params => params.get("counter")),
      distinctUntilChanged()
    );
    const orders$ = this.orderService.getOrders();
    this.order$ = combineLatest(counter$, orders$).pipe(map( ([counter, orders]) => orders.find(order => order.counter == counter)));
  }

}
