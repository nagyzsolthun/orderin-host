import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { of } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import User from 'src/app/domain/User';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockDataService {
  user() {
    return of(User.fromJson({ id: "id", givenName: "UserGivenName" }));
  }
}

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: DataService, useClass: MockDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
  });

  it('should render the logo', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.logo').src).toContain('assets/logo.svg');  // TODO this doesn't really test it
  }));

  it('should render the givenName', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.user').textContent).toBe('UserGivenName');
  }));

});
