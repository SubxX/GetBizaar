import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddEditStatusComponent } from './product-add-edit-status.component';

describe('ProductAddEditStatusComponent', () => {
  let component: ProductAddEditStatusComponent;
  let fixture: ComponentFixture<ProductAddEditStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAddEditStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddEditStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
