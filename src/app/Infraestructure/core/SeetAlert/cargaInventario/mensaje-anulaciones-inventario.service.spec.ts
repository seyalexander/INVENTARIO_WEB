import { TestBed } from '@angular/core/testing';

import { MensajeAnulacionesInventarioService } from './mensaje-anulaciones-inventario.service';

describe('MensajeAnulacionesInventarioService', () => {
  let service: MensajeAnulacionesInventarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensajeAnulacionesInventarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
