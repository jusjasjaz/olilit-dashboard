import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulReferralComponent } from './successful-referral.component';

describe('SuccessfulReferralComponent', () => {
  let component: SuccessfulReferralComponent;
  let fixture: ComponentFixture<SuccessfulReferralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessfulReferralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessfulReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
