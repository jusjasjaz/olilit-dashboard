import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpStepOneComponent } from './sign-up-step-one.component';

describe('SignUpStepOneComponent', () => {
  let component: SignUpStepOneComponent;
  let fixture: ComponentFixture<SignUpStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpStepOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
