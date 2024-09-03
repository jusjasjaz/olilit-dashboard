import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpTicketsComponent } from './help-tickets.component';

describe('HelpTicketsComponent', () => {
  let component: HelpTicketsComponent;
  let fixture: ComponentFixture<HelpTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
