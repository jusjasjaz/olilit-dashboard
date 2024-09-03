import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UmAddRolesComponent } from './um-add-roles.component';

describe('UmAddRolesComponent', () => {
  let component: UmAddRolesComponent;
  let fixture: ComponentFixture<UmAddRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UmAddRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UmAddRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
