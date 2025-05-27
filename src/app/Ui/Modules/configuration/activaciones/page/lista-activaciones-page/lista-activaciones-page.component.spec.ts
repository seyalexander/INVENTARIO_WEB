import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaActivacionesPageComponent } from './lista-activaciones-page.component';

describe('ListaActivacionesPageComponent', () => {
  let component: ListaActivacionesPageComponent;
  let fixture: ComponentFixture<ListaActivacionesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaActivacionesPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaActivacionesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
