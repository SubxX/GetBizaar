import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourPurchasesComponent } from './your-purchases.component';

describe('YourPurchasesComponent', () => {
  let component: YourPurchasesComponent;
  let fixture: ComponentFixture<YourPurchasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourPurchasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
