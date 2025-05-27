import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-td-usuario-asignar',
  standalone: true,
  imports: [],
  templateUrl: './td-usuario-asignar.component.html',
  styleUrl: './td-usuario-asignar.component.css'
})
export class TdUsuarioAsignarComponent {
  @Input() usuario = ""
}
