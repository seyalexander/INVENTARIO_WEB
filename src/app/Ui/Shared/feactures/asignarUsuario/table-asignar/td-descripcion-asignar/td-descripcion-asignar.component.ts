import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-td-descripcion-asignar',
  standalone: true,
  imports: [],
  templateUrl: './td-descripcion-asignar.component.html',
  styleUrl: './td-descripcion-asignar.component.css'
})
export class TdDescripcionAsignarComponent {
  @Input() descripcion = ""
}
