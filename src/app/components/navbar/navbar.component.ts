import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { map } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order.service';
import Order from 'src/app/domain/Order';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  venueId$: Observable<string>;
  orders$: Observable<Order[]>;

  constructor(
    private dataService: DataService,
    private orderService: OrderService
    ) { }

  ngOnInit() {
    this.venueId$ = this.dataService.venue().pipe(map(venue => venue.id));
    this.orders$ = this.orderService.getOrders();
  }
}