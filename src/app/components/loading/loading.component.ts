import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { RouteParamsService } from 'src/app/services/route-params.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  url: string;

  constructor(
    private routeParamsService: RouteParamsService,
    private dataService: DataService,
    private router: Router) { }

  ngOnInit() {
    const venueIdObservable = this.routeParamsService.venueId().pipe(first());
    const dataAvailableObservable = this.dataService.venue().pipe(first());

    combineLatest(venueIdObservable, dataAvailableObservable)
      .subscribe(values => {
        const venueId = values[0] as string;
        this.router.navigate([venueId, "orders"]);
      });

    this.url = encodeURIComponent(window.location.href);
  }

}
