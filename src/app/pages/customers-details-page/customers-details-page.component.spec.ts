import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersDetailsPageComponent } from './customers-details-page.component';

describe('CustomersDetailsPageComponent', () => {
  let component: CustomersDetailsPageComponent;
  let fixture: ComponentFixture<CustomersDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomersDetailsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
