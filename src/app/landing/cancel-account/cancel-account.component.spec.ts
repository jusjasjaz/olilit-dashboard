import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelAccountComponent } from './cancel-account.component';

describe('CancelAccountComponent', () => {
  let component: CancelAccountComponent;
  let fixture: ComponentFixture<CancelAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
