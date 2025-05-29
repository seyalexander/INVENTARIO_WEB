import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TablaAjustesInventarioDatosComponent } from '@modules/AJUSTES-INVENTARIO/components/tabla-ajustes-inventario-datos/tabla-ajustes-inventario-datos.component';
import { detalleCarga } from 'src/app/Domain/models/cargaDatos/cargaDatos.model';
import { inventariosModel } from 'src/app/Domain/models/inventarios/inventarios.models';

@Component({
  selector: 'app-detalle-inventario-ajustes-page',
  standalone: true,
  imports: [
    MatIcon,
    TablaAjustesInventarioDatosComponent
  ],
  templateUrl: './detalle-inventario-ajustes-page.component.html',
  styleUrl: './detalle-inventario-ajustes-page.component.css'
})
export class DetalleInventarioAjustesPageComponent {

  // ---------------------------------------------------------------------------------------
  // DECORADORES
  // ---------------------------------------------------------------------------------------
  @Input() citaSeleccionada: inventariosModel = {} as inventariosModel;
  @Input() detalleProductos: detalleCarga[] = [];
  @Input() rucEmpresa!: string;
  @Input() idCarga!: number;
  @Input() cantidadItemsAjuste = 0;

  // ---------------------------------------------------------------------------------------
  // DECLARACIÓN VARIABLES
  // ---------------------------------------------------------------------------------------
  datosInventario: inventariosModel = {} as inventariosModel;
  InventarioSeleccionado: inventariosModel = {} as inventariosModel;
  DetalleInventarioSeleccionado: detalleCarga[] = [];
  datosInventarioslista: inventariosModel[] = [];

  // ---------------------------------------------------------------------------------------
  // DECLARACIÓN VARIABLES
  // ---------------------------------------------------------------------------------------
  detalleInventario: detalleCarga[] = []


}
