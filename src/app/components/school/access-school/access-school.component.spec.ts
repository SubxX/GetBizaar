import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessSchoolComponent } from './access-school.component';

describe('AccessSchoolComponent', () => {
  let component: AccessSchoolComponent;
  let fixture: ComponentFixture<AccessSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccessSchoolComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
