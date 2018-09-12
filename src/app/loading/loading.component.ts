import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { RouteService } from '../services/route.service';
import { filter, first } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  constructor(
    private routeService: RouteService,
    private dataService: DataService,
    private router: Router) { }

  ngOnInit() {
    const venueIdObservable = this.routeService.venueId()
      .pipe(filter(venueId => venueId != null))
      .pipe(first());

    const dataAvailableObservable = this.dataService.dataAvailable()
      .pipe(filter(avaliable => avaliable))
      .pipe(first());

    combineLatest(venueIdObservable, dataAvailableObservable)
      .subscribe(values => {
        const venueId = values[0] as string;
        this.router.navigate([venueId, "orders"]);
      });
  }

}
