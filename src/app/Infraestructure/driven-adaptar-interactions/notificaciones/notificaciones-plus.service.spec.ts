import { TestBed } from '@angular/core/testing';

import { NotificacionesPlusService } from './notificaciones-plus.service';

describe('NotificacionesPlusService', () => {
  let service: NotificacionesPlusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionesPlusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
