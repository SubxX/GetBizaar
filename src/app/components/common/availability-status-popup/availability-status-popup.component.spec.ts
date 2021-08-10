import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityStatusPopupComponent } from './availability-status-popup.component';

describe('AvailabilityStatusPopupComponent', () => {
  let component: AvailabilityStatusPopupComponent;
  let fixture: ComponentFixture<AvailabilityStatusPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailabilityStatusPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityStatusPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
