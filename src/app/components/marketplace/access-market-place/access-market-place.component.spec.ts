import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessMarketPlaceComponent } from './access-market-place.component';

describe('AccessMarketPlaceComponent', () => {
  let component: AccessMarketPlaceComponent;
  let fixture: ComponentFixture<AccessMarketPlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessMarketPlaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessMarketPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
