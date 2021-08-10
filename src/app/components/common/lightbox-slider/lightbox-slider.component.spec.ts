import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LightboxSliderComponent } from './lightbox-slider.component';

describe('LightboxSliderComponent', () => {
  let component: LightboxSliderComponent;
  let fixture: ComponentFixture<LightboxSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightboxSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightboxSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
