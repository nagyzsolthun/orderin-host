import { Component, Input } from '@angular/core';
import Order from 'src/app/domain/Order';

@Component({
  selector: 'app-order-list-item',
  templateUrl: './order-list-item.component.html',
  styleUrls: ['./order-list-item.component.css']
})
export class OrderListItemComponent {

  @Input() order: Order;

  constructor() { }

}
