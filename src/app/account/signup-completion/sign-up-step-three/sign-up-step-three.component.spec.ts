import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpStepThreeComponent } from './sign-up-step-three.component';

describe('SignUpStepThreeComponent', () => {
  let component: SignUpStepThreeComponent;
  let fixture: ComponentFixture<SignUpStepThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpStepThreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
