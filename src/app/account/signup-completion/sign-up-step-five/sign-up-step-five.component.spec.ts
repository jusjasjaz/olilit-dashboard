import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpStepFiveComponent } from './sign-up-step-five.component';

describe('SignUpStepFiveComponent', () => {
  let component: SignUpStepFiveComponent;
  let fixture: ComponentFixture<SignUpStepFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpStepFiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpStepFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
