import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceAvailabilityComponent } from './marketplace-availability.component';

describe('MarketplaceAvailabilityComponent', () => {
  let component: MarketplaceAvailabilityComponent;
  let fixture: ComponentFixture<MarketplaceAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
