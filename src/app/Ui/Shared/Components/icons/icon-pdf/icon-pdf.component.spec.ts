import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconPdfComponent } from './icon-pdf.component';

describe('IconPdfComponent', () => {
  let component: IconPdfComponent;
  let fixture: ComponentFixture<IconPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconPdfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
