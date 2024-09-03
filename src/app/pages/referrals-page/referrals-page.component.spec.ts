import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralsPageComponent } from './referrals-page.component';

describe('ReferralsPageComponent', () => {
  let component: ReferralsPageComponent;
  let fixture: ComponentFixture<ReferralsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
