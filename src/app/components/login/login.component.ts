import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  clickable$: Observable<boolean>;
  apiUrl: string;
  url: string;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.clickable$ = this.dataService.user().pipe(
      map(user => user == null), // clickable only if not authenticated
      startWith(false)  // and not while authentication is in progress
    );

    this.apiUrl = environment.apiUrl;
    this.url = encodeURIComponent(window.location.href);
  }

}