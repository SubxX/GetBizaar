import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolRootComponent } from './school-root.component';

describe('MarketplaceRootComponent', () => {
  let component: SchoolRootComponent;
  let fixture: ComponentFixture<SchoolRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolRootComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
