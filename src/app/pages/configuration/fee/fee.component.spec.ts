import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeConfigComponent } from './fee.component';

describe('FeeConfigComponent', () => {
  let component: FeeConfigComponent;
  let fixture: ComponentFixture<FeeConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
