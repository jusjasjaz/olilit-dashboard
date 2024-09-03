import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitConfigComponent } from './limit.component';

describe('LimitConfigComponent', () => {
  let component: LimitConfigComponent;
  let fixture: ComponentFixture<LimitConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimitConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
