import { Component, Input, OnInit } from '@angular/core';
import Order from 'src/app/domain/Order';
import { Observable } from 'rxjs';
import { RouteParamsService } from 'src/app/services/route-params.service';

@Component({
  selector: 'app-order-list-item',
  templateUrl: './order-list-item.component.html',
  styleUrls: ['./order-list-item.component.css']
})
export class OrderListItemComponent implements OnInit{

  @Input() order: Order;
  venueId$: Observable<string>;

  constructor(private routeParamsService: RouteParamsService) { }

  ngOnInit() {
    this.venueId$ = this.routeParamsService.venueId();
  }

}
