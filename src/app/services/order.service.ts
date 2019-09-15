import { Injectable, NgZone } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import Order from '../domain/Order';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';
import { filter, map, switchMap } from 'rxjs/operators';
import { RouteParamsService } from './route-params.service';
import OrderUpdate from '../domain/OrderUpdate';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orders = new Array<Order>();
  private orders$ = new ReplaySubject<Order[]>(1);

  constructor(
    routeParamsService: RouteParamsService,
    dataService: DataService,
    private http: HttpClient,
    private ngZone: NgZone) {

    dataService.user().pipe(
      filter(user => user != null),
      switchMap(_ => routeParamsService.venueId())
    ).subscribe( venueId => {
      this.subscribeOnOrderEvents(venueId);
      this.fetchOrders(venueId);
    });
  }

  getOrders() {
    return this.orders$;
  }

  requestOrderUpdate(orderId: string, state: string): Observable<any> {
    const url = `${environment.apiUrl}/orders/${orderId}`;
    const params = new HttpParams().set("state", state);
    return this.http.put(url, {}, {params}).pipe(
      map(OrderUpdate.fromJson),
      map(orderUpdate => this.updateOrder(orderUpdate))
    );
  }

  requestOrderDelete(orderId: string): Observable<any> {
    const url = `${environment.apiUrl}/orders/${orderId}`;
    return this.http.delete(url, {}).pipe(
      map(_ => this.deleteOrder(orderId))
    );
  }

  private subscribeOnOrderEvents(venueId) {
    const url = `${environment.apiUrl}/venues/${venueId}/events`;
    const eventSource = new EventSource(url);
    eventSource.onmessage = message => this.onServerEvent(message);
  }

  private fetchOrders(venueId) {
    const url = `${environment.apiUrl}/venues/${venueId}/orders`;
    this.http.get(url).pipe(
      map(orders => orders as any[]),
      map(orders => orders.map(Order.fromJson))
    ).subscribe(orders => orders.forEach(order => this.createOrder(order)));

  }

  private onServerEvent(message: MessageEvent) {
    const data = JSON.parse(message.data);

    // use ngZone, otherwise async in template does not react
    if(data.id) {
      const order = Order.fromJson(data);
      this.ngZone.run(() => this.createOrder(order));
      return;
    }

    if(data.orderId) {
      const orderUpdate = OrderUpdate.fromJson(data);
      this.ngZone.run(() => this.updateOrder(orderUpdate));
      return;
    }

    // otherwise heartbeat
  }

  private createOrder(order: Order) {
    const existing = this.orders.some(o => o.id == order.id);
    if(existing) {
      // race condition, subscribe to events before fetching orders
      return;
    }

    this.orders.push(order);
    this.orders$.next(this.orders);
  }

  private updateOrder(orderEvent: OrderUpdate) {
    const order = this.orders.find(order => order.id == orderEvent.orderId);
    if(order) {
      order.state = orderEvent.state;
      order.host = orderEvent.host;
      this.orders$.next(this.orders);
    }
  }

  private deleteOrder(orderId: string) {
    this.orders = this.orders.filter(o => o.id != orderId);
    this.orders$.next(this.orders);
  }

}
