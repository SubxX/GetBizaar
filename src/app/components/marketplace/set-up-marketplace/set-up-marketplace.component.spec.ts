import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUpMarketplaceComponent } from './set-up-marketplace.component';

describe('SetUpMarketplaceComponent', () => {
  let component: SetUpMarketplaceComponent;
  let fixture: ComponentFixture<SetUpMarketplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetUpMarketplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetUpMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
