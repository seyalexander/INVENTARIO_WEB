import { TestBed } from '@angular/core/testing';

import { MensajesRegistroInventarioService } from './mensajes-registro-inventario.service';

describe('MensajesRegistroInventarioService', () => {
  let service: MensajesRegistroInventarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensajesRegistroInventarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
