import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpStepSuccessComponent } from './sign-up-step-success.component';

describe('SignUpStepSuccessComponent', () => {
  let component: SignUpStepSuccessComponent;
  let fixture: ComponentFixture<SignUpStepSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpStepSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpStepSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
