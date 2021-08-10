import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectPaymentMethodComponent } from './connect-payment-method.component';

describe('ConnectPaymentMethodComponent', () => {
  let component: ConnectPaymentMethodComponent;
  let fixture: ComponentFixture<ConnectPaymentMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectPaymentMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectPaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
