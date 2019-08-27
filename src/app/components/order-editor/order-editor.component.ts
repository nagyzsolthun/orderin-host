import { Component, OnInit, OnDestroy } from '@angular/core';
import Order from 'src/app/domain/Order';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { map, distinctUntilChanged, tap, filter, switchMap } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-editor',
  templateUrl: './order-editor.component.html',
  styleUrls: ['./order-editor.component.css']
})
export class OrderEditorComponent implements OnInit, OnDestroy {

  order$: Observable<Order>;
  private redirectSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService
    ) { }

  ngOnInit() {
    const venueId$ = this.route.paramMap.pipe(
      map(params => params.get("venueId")),
      distinctUntilChanged()
    );

    const counter$ = this.route.paramMap.pipe(
      map(params => params.get("counter")),
      distinctUntilChanged()
    );

    const orders$ = this.orderService.getOrders();
    this.order$ = combineLatest(counter$, orders$).pipe(
      map( ([counter, orders]) => orders.find(order => order.counter == counter))
    );

    // navigate when there is no order
    this.redirectSubscription = this.order$.pipe(filter(order => !order), switchMap(_ => venueId$))
      .subscribe( venueId => this.router.navigate([venueId]));
  }

  ngOnDestroy() {
    this.redirectSubscription.unsubscribe();
  }

}
