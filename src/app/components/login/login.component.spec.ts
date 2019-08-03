import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ReplaySubject } from 'rxjs';
import User from 'src/app/domain/User';
import { DataService } from 'src/app/services/data.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockDataService {
  user$ = new ReplaySubject<User>(1);
  user() {
    return this.user$;
  }
}

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let compiled: HTMLElement;

  let dataService: MockDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        { provide: DataService, useClass: MockDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    dataService = TestBed.get(DataService);

    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should render the logo', () => {
    expect(compiled.querySelector('img').src).toContain('assets/logo.svg');  // TODO this doesn't check the validity of the url
  });

  it('should show clickable button only once auth is done', () => {
    const a1 = compiled.querySelector("a");
    expect(!a1.classList.contains("clickable"));

    dataService.user$.next(null); // auth finished with no success
    fixture.detectChanges();

    const a2 = compiled.querySelector("a");
    expect(a2.classList.contains("clickable"));
    expect(a2.getAttribute("href")).toContain("/redirect");
  });
});
