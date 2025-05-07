import { TestBed } from '@angular/core/testing';

import { MensajesListaUsuariosService } from './mensajes-lista-usuarios.service';

describe('MensajesListaUsuariosService', () => {
  let service: MensajesListaUsuariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensajesListaUsuariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
