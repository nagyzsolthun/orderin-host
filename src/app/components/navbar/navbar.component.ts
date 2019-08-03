import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  venueId$: Observable<string>;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.venueId$ = this.dataService.venue().pipe(map(venue => venue.id));
  }
}