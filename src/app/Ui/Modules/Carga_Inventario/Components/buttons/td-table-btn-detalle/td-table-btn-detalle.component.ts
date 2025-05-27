import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'td-table-btn-detalle',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './td-table-btn-detalle.component.html',
  styleUrl: './td-table-btn-detalle.component.css'
})
export class TdTableBtnDetalleComponent {
  @Input() rucempresa = '';
  @Input() idcarga = 0;

  @Output() obtenerDetalle = new EventEmitter<{ rucempresa: string; idcarga: number }>();

  ObtenerDetalleInventarios() {
    this.obtenerDetalle.emit({ rucempresa: this.rucempresa, idcarga: this.idcarga });
  }
}
