import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import User from 'src/app/domain/User';
import { ReplaySubject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockDataService {
  user$ = new ReplaySubject<User>(1);
  user() {
    return this.user$;
  }
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let dataService: MockDataService;

  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: DataService, useClass: MockDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    dataService = TestBed.get(DataService);
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should show login until authentication', () => {
    expect(compiled.querySelector("app-login")).toBeTruthy();

    dataService.user$.next(User.fromJson({ id: "id", givenName: "Name" }));
    fixture.detectChanges();
    expect(compiled.querySelector("app-login")).toBeFalsy();
  });
});
