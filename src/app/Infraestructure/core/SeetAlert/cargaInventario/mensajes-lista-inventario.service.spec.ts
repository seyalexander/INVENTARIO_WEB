import { TestBed } from '@angular/core/testing';

import { MensajesListaInventarioService } from './mensajes-lista-inventario.service';

describe('MensajesListaInventarioService', () => {
  let service: MensajesListaInventarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensajesListaInventarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
