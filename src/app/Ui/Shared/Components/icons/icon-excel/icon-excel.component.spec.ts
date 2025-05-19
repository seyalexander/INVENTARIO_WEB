import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconExcelComponent } from './icon-excel.component';

describe('IconExcelComponent', () => {
  let component: IconExcelComponent;
  let fixture: ComponentFixture<IconExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconExcelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
