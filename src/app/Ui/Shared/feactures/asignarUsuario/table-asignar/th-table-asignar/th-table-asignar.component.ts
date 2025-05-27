import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-th-table-asignar',
  standalone: true,
  imports: [],
  templateUrl: './th-table-asignar.component.html',
  styleUrl: './th-table-asignar.component.css'
})
export class ThTableAsignarComponent {
  @Input() descripcion = ""
}
