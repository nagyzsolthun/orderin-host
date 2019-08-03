import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import Venue from 'src/app/domain/Venue';
import { of } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

class MockDataService {
  venue() {
    return of(Venue.fromJson({ id: "id", name: "VenueName" }));
  }
}

describe('NavBarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      providers: [
        { provide: DataService, useClass: MockDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should render Orders', () => {
    const orders = compiled.querySelector(":nth-child(1)");
    expect(orders.textContent).toBe("Orders");
  });

  it('should render Products', () => {
    const orders = compiled.querySelector(":nth-child(2)");
    expect(orders.textContent).toBe("Products");
  });

});
