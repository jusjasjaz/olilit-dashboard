import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpStepSixComponent } from './sign-up-step-six.component';

describe('SignUpStepSixComponent', () => {
  let component: SignUpStepSixComponent;
  let fixture: ComponentFixture<SignUpStepSixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpStepSixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpStepSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
