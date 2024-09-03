import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodePageComponent } from './qrcode-page.component';

describe('QrcodePageComponent', () => {
  let component: QrcodePageComponent;
  let fixture: ComponentFixture<QrcodePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
