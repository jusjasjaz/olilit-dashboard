import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantsPageComponent } from './merchants-page.component';

describe('MerchantsPageComponent', () => {
  let component: MerchantsPageComponent;
  let fixture: ComponentFixture<MerchantsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
