import { TestBed } from '@angular/core/testing';

import { MensajesAsignacionService } from './mensajes-asignacion.service';

describe('MensajesAsignacionService', () => {
  let service: MensajesAsignacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensajesAsignacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
