import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  login$: Observable<boolean>;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.login$ = this.dataService.user().pipe(
      map(user => user == null), // show only if not authenticated
      startWith(true) // or while authentication is in progress
    );
  }
}
