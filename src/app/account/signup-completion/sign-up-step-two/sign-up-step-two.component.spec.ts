import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpStepTwoComponent } from './sign-up-step-two.component';

describe('SignUpStepTwoComponent', () => {
  let component: SignUpStepTwoComponent;
  let fixture: ComponentFixture<SignUpStepTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpStepTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
