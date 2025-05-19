import { TestBed } from '@angular/core/testing';

import { MensajeGenerarReporteExcelService } from './mensaje-generar-reporte-excel.service';

describe('MensajeGenerarReporteExcelService', () => {
  let service: MensajeGenerarReporteExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensajeGenerarReporteExcelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
