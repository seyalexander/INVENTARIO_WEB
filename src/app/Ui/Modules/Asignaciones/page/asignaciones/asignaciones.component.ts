import { Component } from '@angular/core';
import { ListaAsignarPageComponent } from '../lista-asignar-page/lista-asignar-page.component';

@Component({
  selector: 'app-asignaciones',
  standalone: true,
  imports: [
    ListaAsignarPageComponent
  ],
  templateUrl: './asignaciones.component.html',
  styleUrl: './asignaciones.component.css',
})
export class AsignacionesComponent {

}
