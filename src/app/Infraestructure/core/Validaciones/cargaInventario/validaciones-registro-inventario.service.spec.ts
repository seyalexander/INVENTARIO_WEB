import { TestBed } from '@angular/core/testing';

import { ValidacionesRegistroInventarioService } from './validaciones-registro-inventario.service';

describe('ValidacionesRegistroInventarioService', () => {
  let service: ValidacionesRegistroInventarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidacionesRegistroInventarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
