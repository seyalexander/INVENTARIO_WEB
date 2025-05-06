import { Component, inject, ViewChild } from '@angular/core';
import { inventariosModel } from '../../../../../Domain/models/inventarios/inventarios.models';
import { InventariosByIdUseCases } from '../../../../../Domain/use-case/inventarios/get-inventarioById-useCase';
import { detalleCarga } from '../../../../../Domain/models/cargaDatos/cargaDatos.model';
import { Subscription } from 'rxjs';
import { InventariosUseCases } from '../../../../../Domain/use-case/inventarios/get-inventarios-useCase';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { DesignReportInventarioComponent } from '@modules/reportes/components/design-reporte/design-report-inventario/design-report-inventario.component';
import { requestDatosasignar } from 'src/app/Domain/models/inventarios/requestObtenerDatosAsignar.model';
import { InventarioDetallesUseCases } from 'src/app/Domain/use-case/inventarios/get-inventarioDetalle-usecase';
import { DetalleCargaInventariosComponent } from '@modules/Carga_Inventario/Page/detalle-carga-inventarios/detalle-carga-inventarios.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RequestInventarioByFiltros } from 'src/app/Domain/models/inventarios/requestInventariosByFiltros.model';
import { InventariosByFiltrosUseCases } from 'src/app/Domain/use-case/inventarios/get-inventariosByFiltros-use-case';
import { CommonModule } from '@angular/common';
import { DashboardDetalleReporteinventarioComponent } from '@modules/reportes/components/dashboard-detalle-reporteinventario/dashboard-detalle-reporteinventario.component';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { InventarioDetallesByFiltrosUseCases } from 'src/app/Domain/use-case/inventarios/get-inventarioDetalleByFiltros-use-case';
import { RequestObtenerDetalleFiltros } from 'src/app/Domain/models/inventarios/requestObtenerDetalleInventarioByFiltros.mode';
import { RequestObtenerDetalleAjusteFiltros } from 'src/app/Domain/models/inventarios/reqyestObtenerDetalleAjustadosFiltros.model';
import { InventariosService } from 'src/app/Infraestructure/driven-adapter/inventarios/inventarios.service';

@Component({
  selector: 'reporte-inventario',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIcon,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    NgxPaginationModule,
    DesignReportInventarioComponent,
    DetalleCargaInventariosComponent,
    CommonModule,
    MatSortModule,
    DashboardDetalleReporteinventarioComponent
  ],
  templateUrl: './reporte-inventario.component.html',
  styleUrl: './reporte-inventario.component.css',
})
export class ReporteInventarioComponent {
  // ---------------------------------------------------------------------------------------
  // DECLARACIÓN VARIABLES
  // ---------------------------------------------------------------------------------------

  cantidadListaProductos: number = 0;
  cantidadDatosInventarioLista: number = 0;
  mostrarRefrescoPagina: boolean = true;

  datosInventario: inventariosModel = {} as inventariosModel;
  InventarioSeleccionado: inventariosModel = {} as inventariosModel;
  selectedItem!: { rucempresa: string; idcarga: string };

  DetalleInventarioSeleccionado: Array<inventariosModel> = [];
  datosInventarioslista: Array<inventariosModel> = [];
  listaProductos: Array<detalleCarga> = [];

  // ---------------------------------------------------------------------------------------
  // INJECCIÓN SERVICIOS
  // ---------------------------------------------------------------------------------------
  private inventarioSubscription: Subscription | undefined;
  private TotalCantidadSubscription: Subscription | undefined;
  private readonly ObjectInventario = inject(InventariosByIdUseCases);
  private readonly listDetalle = inject(InventarioDetallesUseCases);
  private readonly listDetalleByFiltros = inject(InventarioDetallesByFiltrosUseCases);
  private _liveAnnouncer = inject(LiveAnnouncer);
  private _inventarios = inject(InventariosService)

  // ---------------------------------------------------------------------------------------
  // FUNCIÓN PRINCIPAL
  // ---------------------------------------------------------------------------------------
  ngOnInit(): void {
    this.listarInventarios();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // ---------------------------------------------------------------------------------------
  // INVENTARIO SELECCIONADO PARA SU EXPORTACIÓN
  // ---------------------------------------------------------------------------------------
  inventarioSeleccionado(rucempresa: string, idcarga: number) {
    const reqDatos: requestDatosasignar = { rucempresa, idcarga };
    this.ObjectInventario.getInventarioById(reqDatos).subscribe(
      (response: inventariosModel) => {
        this.InventarioSeleccionado = response;
      }
    );
  }

  inventarioSeleccionadoPDF(rucempresa: string, idcarga: number) {
    const reqDatos: requestDatosasignar = { rucempresa, idcarga };
    this.ObjectInventario.getInventarioById(reqDatos).subscribe(
      (response: inventariosModel) => {
        this.InventarioSeleccionado = response;

        this.ObtenerDetalleInventariosCantidadRegistrosFaltantes(response.rucempresa, response.idcarga)
        this.ObtenerDetalleInventariosCantidadRegistrosNoFaltantes(response.rucempresa, response.idcarga)
        this.ObtenerDetalleInventariosCantidadNuevosRegistros(response.rucempresa, response.idcarga)
        this.ObtenerDetalleInventariosCantidadConteosExactos(response.rucempresa, response.idcarga)
        this.ObtenerDetalleInventariosCantidadTotal(response.rucempresa, response.idcarga)
        this.ObtenerDetalleInventariosAjustados(response.rucempresa,response.idcarga )
        this.ObtenerDetalleInventariosEditadosManual(response.rucempresa, response.idcarga)
      }
    );
  }

  cantidadItemsAjustados: number = 0

  ObtenerDetalleInventariosAjustados(rucempresa: string = '', idcarga:number ) {
    const req: RequestObtenerDetalleAjusteFiltros = {
          rucempresa,
          idcarga,
          ajustes: 2
        }
        this._inventarios.getInventariosAjustesByFiltros(req)
        .subscribe((Response: detalleCarga[]) => {
          this.cantidadItemsAjustados = Response.length;
        });
  }

  TotalRegistros: number = 0
  ObtenerDetalleInventariosCantidadTotal(rucempresa: string, idcarga: number) {
    const diferencias: number = 0
    const esnuevo: number = 2
    const esEditado: number = 2
    const reqDatos: RequestObtenerDetalleFiltros = { rucempresa, idcarga, diferencias, esnuevo, esEditado };
    this.listDetalleByFiltros
      .getDetalleInventarioByFiltros(reqDatos)
      .subscribe((response: detalleCarga[]) => {
        this.TotalRegistros = response.length;
      });
  }


  RegistrosFaltantes: number = 0
  ObtenerDetalleInventariosCantidadRegistrosFaltantes(rucempresa: string, idcarga: number) {
    const diferencias: number = 3
    const esnuevo: number = 0
    const esEditado: number = 2
    const reqDatos: RequestObtenerDetalleFiltros = { rucempresa, idcarga, diferencias, esnuevo, esEditado };
    this.TotalCantidadSubscription = this.listDetalleByFiltros
      .getDetalleInventarioByFiltros(reqDatos)
      .subscribe((response: detalleCarga[]) => {
        this.RegistrosFaltantes = response.length;
      });
  }

  RegistrosNoFaltantes: number = 0
  ObtenerDetalleInventariosCantidadRegistrosNoFaltantes(rucempresa: string, idcarga: number) {
    const diferencias: number = 2
    const esnuevo: number = 0
    const esEditado: number = 2
    const reqDatos: RequestObtenerDetalleFiltros = { rucempresa, idcarga, diferencias, esnuevo, esEditado  };
    this.listDetalleByFiltros
      .getDetalleInventarioByFiltros(reqDatos)
      .subscribe((response: detalleCarga[]) => {
        this.RegistrosNoFaltantes = response.length;
      });
  }

  NuevosRegistros: number = 0
  ObtenerDetalleInventariosCantidadNuevosRegistros(rucempresa: string, idcarga: number) {
    const diferencias: number = 0
    const esnuevo: number = 1
    const esEditado: number = 2
    const reqDatos: RequestObtenerDetalleFiltros = { rucempresa, idcarga, diferencias, esnuevo, esEditado  };
    this.listDetalleByFiltros
      .getDetalleInventarioByFiltros(reqDatos)
      .subscribe((response: detalleCarga[]) => {
        this.NuevosRegistros = response.length;
      });
  }

  ConteosExactos: number = 0
  ObtenerDetalleInventariosCantidadConteosExactos(rucempresa: string, idcarga: number) {
    const diferencias: number = 1
    const esnuevo: number = 2
    const esEditado: number = 2
    const reqDatos: RequestObtenerDetalleFiltros = { rucempresa, idcarga, diferencias, esnuevo, esEditado  };
    this.listDetalleByFiltros
      .getDetalleInventarioByFiltros(reqDatos)
      .subscribe((response: detalleCarga[]) => {
        this.ConteosExactos = response.length;
      });
  }

  EditadosManual: number = 0
  ObtenerDetalleInventariosEditadosManual(rucempresa: string, idcarga: number) {
    const diferencias: number = 0
    const esnuevo: number = 2
    const esEditado: number = 1
    const reqDatos: RequestObtenerDetalleFiltros = { rucempresa, idcarga, diferencias, esnuevo, esEditado  };
    this.listDetalleByFiltros
      .getDetalleInventarioByFiltros(reqDatos)
      .subscribe((response: detalleCarga[]) => {
        this.EditadosManual = response.length;
      });
  }


  // ---------------------------------------------------------------------------------------
  // OBTENCIÓN DATOS DEL INVENTARIO SELECCIOADO PARA MOSTRAR SU DETALLE
  // ---------------------------------------------------------------------------------------
  ObtenerDetalleInventarios(rucempresa: string, idcarga: number) {
    const reqDatos: requestDatosasignar = { rucempresa, idcarga };
    this.listDetalle
      .getDetalleInventario(reqDatos)
      .subscribe((response: detalleCarga[]) => {
        this.listaProductos = response;
        this.cantidadListaProductos = response.length;
        this.inventarioSeleccionado(rucempresa, idcarga)
      });
  }

  // ---------------------------------------------------------------------------------------
  // RECARGAR LA PÁGINA
  // ---------------------------------------------------------------------------------------
  recargarPagina() {
    window.location.reload();
  }

  // ================================================================================
  // DATOS PARA TABLA DE ANGULAR MATERIAL
  // ================================================================================
  displayedColumns: string[] = [
    'fechacreacion',
    'fechamodificacion',
    'descripcion',
    'totalregistros',
    'UsuarioAsignado',
    'opciones'
  ];

  dataSource = new MatTableDataSource<inventariosModel>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // ---------------------------------------------------------------------------------------
  // LISTA DE INVENTARIOS GENERALES
  // ---------------------------------------------------------------------------------------
  private readonly listaInventariosbyfiltros = inject(InventariosByFiltrosUseCases);
  listarInventarios() {
    const estado = '2'
    const rucempresa = ''
    const reqDatos: RequestInventarioByFiltros = { rucempresa, estado };
    reqDatos.estado = estado
    reqDatos.rucempresa = rucempresa
    try {
      this.inventarioSubscription = this.listaInventariosbyfiltros
        .getInventariosByFiltros(reqDatos)
        .subscribe({
          next: (response: inventariosModel[]) => {
            if (Array.isArray(response)) {
              this.datosInventarioslista = response;
              this.dataSource.data = response;

            } else {
              this.mostrarMensajeError('DATOS NO VÁLIDOS', `${response}`);
              this.datosInventarioslista = [];
              this.cantidadDatosInventarioLista = 0;
            }
          },
          error: (error) => {
            this.mostrarMensajeError(
              error.name,
              'Verifique la conexión con el API y recargue el listado.'
            );
            this.datosInventarioslista = [];
            this.cantidadDatosInventarioLista = 0;
          },
        });
    } catch (err) {
      this.mostrarMensajeError(
        'Error inesperado',
        `Error en listarInventarios: ${err}`
      );
    }
  }

  mostrarMensajeError(titulo: string, mensaje: string): void {
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje,
    });
  }

  // ---------------------------------------------------------------------------------------
  // MODALES DE LOS MENSAJES ALERTS - SWEET ALERT
  // ---------------------------------------------------------------------------------------
  respuestaInventariosNoValidos(response: any): void {
    Swal.fire({
      icon: 'error',
      title: 'DATOS NO VÁLIDOS',
      text: `${response}`,
    });
  }

  respuestaInventariosSinAcceso(response: any): void {
    Swal.fire({
      icon: 'error',
      title: `${response}`,
      text: 'verifique que la conexión del api y recargue el listado',
    }).then((respuesta) => { });
  }

  respuestaInventariosErrorInesperado(response: any): void {
    Swal.fire({
      icon: 'error',
      title: `Error inesperado en listarInventarios`,
      text: `${response}`,
    });
  }

  // ---------------------------------------------------------------------------------------
  // DESTRUCCIÓN DE SUBSCRIPCIONES
  // ---------------------------------------------------------------------------------------
  ngOnDestroy(): void {
    this.inventarioSubscription?.unsubscribe();
    this.TotalCantidadSubscription?.unsubscribe()
  }
}
