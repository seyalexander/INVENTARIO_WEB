import { TestBed } from '@angular/core/testing';

import { MensajeGenerarReportePdfService } from './mensaje-generar-reporte-pdf.service';

describe('MensajeGenerarReportePdfService', () => {
  let service: MensajeGenerarReportePdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensajeGenerarReportePdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
