import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUpSchoolComponent } from './set-up-school.component';

describe('SetUpSchoolComponent', () => {
  let component: SetUpSchoolComponent;
  let fixture: ComponentFixture<SetUpSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SetUpSchoolComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetUpSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
