import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Observable } from 'rxjs';
import User from 'src/app/domain/User';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userGivenName$: Observable<string>;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.userGivenName$ = this.dataService.user().pipe(
      filter(user => user != null),
      map(user => user.givenName)
    );
  }

}