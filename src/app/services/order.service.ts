import { Injectable, NgZone } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import Order from '../domain/Order';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';
import { filter, map, switchMap } from 'rxjs/operators';
import { RouteParamsService } from './route-params.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orders = new Array<Order>();
  private orders$ = new ReplaySubject<Order[]>(1);

  constructor(
    routeParamsService: RouteParamsService,
    dataService: DataService,
    private httpClient: HttpClient,
    private ngZone: NgZone) {

    dataService.user().pipe(
      filter(user => user != null),
      switchMap(_ => routeParamsService.venueId())
    ).subscribe( venueId => {
      this.subscribeOnOrderEvents(venueId)
      this.fetchOrders(venueId);
    });
  }

  getOrders() {
    return this.orders$;
  }

  private subscribeOnOrderEvents(venueId) {
    const params = new URLSearchParams({venueId});
    const url = `${environment.apiUrl}/orderEvents?${params.toString()}`;
    const eventSource = new EventSource(url);
    eventSource.onmessage = message => this.onOrderEvent(message);
  }

  private fetchOrders(venueId) {
    const params = new URLSearchParams({venueId});
    const url = `${environment.apiUrl}/fetchOrders?${params.toString()}`;
    this.httpClient.get(url).pipe(
      map(orders => orders as any[]),
      map(orders => orders.map(Order.fromJson))
    ).subscribe(orders => orders.forEach(order => this.updateOrder(order)));

  }

  private onOrderEvent(message: MessageEvent) {
    const order = Order.fromJson(JSON.parse(message.data));
    this.ngZone.run(() => this.updateOrder(order)); // otherwise async in template does not react
  }

  private updateOrder(order: Order) {
    const existing = this.orders.find(o => o.id == order.id);
    if(existing) {
      existing.counter = order.counter;
      existing.tableName = order.tableName;
      existing.orderItems = order.orderItems;
      this.orders$.next(this.orders);
      return;
    }

    this.orders.push(order);
    this.orders$.next(this.orders);
  }

}
