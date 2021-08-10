import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceRootComponent } from './marketplace-root.component';

describe('MarketplaceRootComponent', () => {
  let component: MarketplaceRootComponent;
  let fixture: ComponentFixture<MarketplaceRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
