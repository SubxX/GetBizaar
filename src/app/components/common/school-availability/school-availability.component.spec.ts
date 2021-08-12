import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAvailabilityComponent } from './school-availability.component';

describe('MarketplaceAvailabilityComponent', () => {
  let component: SchoolAvailabilityComponent;
  let fixture: ComponentFixture<SchoolAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolAvailabilityComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
