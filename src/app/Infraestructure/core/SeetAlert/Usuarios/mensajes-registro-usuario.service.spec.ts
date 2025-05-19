import { TestBed } from '@angular/core/testing';

import { MensajesRegistroUsuarioService } from './mensajes-registro-usuario.service';

describe('MensajesRegistroUsuarioService', () => {
  let service: MensajesRegistroUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensajesRegistroUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
