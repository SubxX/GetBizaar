import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourSalesRentalComponent } from './your-sales-rental.component';

describe('YourSalesRentalComponent', () => {
  let component: YourSalesRentalComponent;
  let fixture: ComponentFixture<YourSalesRentalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourSalesRentalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourSalesRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
