import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InventariosGateway } from '../../models/inventarios/gateway/inventarios-gateway';
import { inventariosModel } from '../../models/inventarios/inventarios.models';

@Injectable({
  providedIn: 'root'
})

export class InventariosFiltroUseCases {
  constructor(
    private readonly _getInventariosGateWay: InventariosGateway,
  ) {}

  getInventarios(filtro: 'todos' | 'asignados' | 'noAsignados') : Observable<inventariosModel[]> {
    return this._getInventariosGateWay.getInventariosFiltroUsuarioAsignado(filtro);
  }

}
