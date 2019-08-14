import { Component, OnInit, Input } from '@angular/core';
import Order from 'src/app/domain/Order';

@Component({
  selector: 'app-order-list-item',
  templateUrl: './order-list-item.component.html',
  styleUrls: ['./order-list-item.component.css']
})
export class OrderListItemComponent implements OnInit {

  @Input() order: Order;
  formattedCounter: string;

  constructor() { }

  ngOnInit() {
    this.formattedCounter = this.formatCounter(this.order.counter);
  }

  formatCounter(counter: number): string {
    if(counter > 99) return counter.toString();
    if(counter > 9) return "0" + counter;
    if(counter > 0) return "00" + counter;
    return counter.toString(); // negative, should never reach
  }

}
