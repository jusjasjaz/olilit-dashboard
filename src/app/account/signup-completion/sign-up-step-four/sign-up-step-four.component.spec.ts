import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpStepFourComponent } from './sign-up-step-four.component';

describe('SignUpStepFourComponent', () => {
  let component: SignUpStepFourComponent;
  let fixture: ComponentFixture<SignUpStepFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpStepFourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpStepFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
