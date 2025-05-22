import { TestBed } from '@angular/core/testing';

import { MensajeActualizarUsuarioService } from './mensaje-actualizar-usuario.service';

describe('MensajeActualizarUsuarioService', () => {
  let service: MensajeActualizarUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensajeActualizarUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
