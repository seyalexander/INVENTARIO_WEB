import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-opcion-table-asignar-usuario',
  standalone: true,
  imports: [],
  templateUrl: './opcion-table-asignar-usuario.component.html',
  styleUrl: './opcion-table-asignar-usuario.component.css'
})
export class OpcionTableAsignarUsuarioComponent {
  @Input() rucempresa = ''
  @Input() idcarga = 0

  @Output() obtenerDetalle = new EventEmitter<{ rucempresa: string; idcarga: number }>();

  ObtenerDetatosInventarios() {
    this.obtenerDetalle.emit({ rucempresa: this.rucempresa, idcarga: this.idcarga });
  }
}
