import { Component, Input, HostListener, HostBinding, OnChanges, SimpleChanges } from '@angular/core';
import Order from 'src/app/domain/Order';
import { OrderService } from 'src/app/services/order.service';
import { Observable } from 'rxjs';
import { ReplaceSource } from 'webpack-sources';

@Component({
  selector: 'app-order-editor-button',
  templateUrl: './order-editor-button.component.html',
  styleUrls: ['./order-editor-button.component.css']
})
export class OrderEditorButtonComponent {
  @Input() order: Order;
  loading: boolean;
  error: boolean;

  constructor(private orderService: OrderService) { }

  calcAction(state: string) {
    switch(state) {
      case "CREATED":   return "prepare";
      case "PREPARING": return "ready";
      case "READY":     return "taken";
      case "TAKEN":     return "delete";
    }
  }

  @HostListener("click")
  click() {
    const state = this.nextState();
    if(!state) {
      const response$ = this.orderService.requestOrderDelete(this.order.id);
      this.animateProgress(response$);
      return;
    }

    const response$ = this.orderService.requestOrderUpdate(this.order.id, state);
    this.animateProgress(response$);
  }

  private nextState() {
    switch(this.order.state) {
      case "CREATED":   return "PREPARING";
      case "PREPARING": return "READY";
      case "READY":     return "TAKEN";
      default:          return null;
    }
  }

  private animateProgress(observable: Observable<any>) {
    this.loading = true;
    this.error = false;

    const next = _ => { };
    const complete = () => {
      this.loading = false;
      this.error = false;
    };
    const error = _ => {
      console.log("error");
      this.loading = false;
      this.error = true;
    }

    observable.subscribe({next, complete, error});
  }

}
