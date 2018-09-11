import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { RouteService } from '../services/route.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  venueId: String;

  constructor(private routeService: RouteService) { }

  ngOnInit() {
    this.routeService.venueId()
      .pipe(filter(id => id != null))
      .subscribe(venueId => this.venueId = venueId)
  }
}
