import { Component, OnInit } from '@angular/core';
import { RouteParamsService } from 'src/app/services/route-params.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  venueId: String;

  constructor(private routeParamsService: RouteParamsService) { }

  ngOnInit() {
    this.routeParamsService.venueId()
      .subscribe(venueId => this.venueId = venueId)
  }
}
