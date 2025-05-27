import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  ViewChild, OnInit, AfterViewInit,
} from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { detalleCarga } from 'src/app/Domain/models/cargaDatos/cargaDatos.model';
import { inventariosModel } from 'src/app/Domain/models/inventarios/inventarios.models';
import { InventariosByIdUseCases } from 'src/app/Domain/use-case/inventarios/get-inventarioById-useCase';
import { FiltrosCheckboxTablaComponent } from '../../filtros-checkbox-tabla/filtros-checkbox-tabla.component';
import { requestDatosasignar } from 'src/app/Domain/models/inventarios/requestObtenerDatosAsignar.model';
import { InventarioDetallesUseCases } from 'src/app/Domain/use-case/inventarios/get-inventarioDetalle-usecase';
import { RequestObtenerDetalle } from 'src/app/Domain/models/inventarios/requestObtenerDetalle.model';
import { MatTabsModule } from '@angular/material/tabs';
import * as XLSX from 'xlsx';
import { MatIcon } from '@angular/material/icon';
import { RequestObtenerDetalleFiltros } from 'src/app/Domain/models/inventarios/requestObtenerDetalleInventarioByFiltros.mode';
import { InventarioDetallesByFiltrosUseCases } from 'src/app/Domain/use-case/inventarios/get-inventarioDetalleByFiltros-use-case';
import { RequestObtenerDetalleAjusteFiltros } from 'src/app/Domain/models/inventarios/reqyestObtenerDetalleAjustadosFiltros.model';
import { InventariosService } from 'src/app/Infraestructure/driven-adapter/inventarios/inventarios.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { NgClass } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MensajeGenerarReportePdfService } from 'src/app/Infraestructure/core/SeetAlert/Reportes/mensaje-generar-reporte-pdf.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-design-report-inventario',
  standalone: true,
  imports: [
    FiltrosCheckboxTablaComponent,
    MatTabsModule,
    MatIcon,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    NgClass,
  ],
  templateUrl: './design-report-inventario.component.html',
  styleUrl: './design-report-inventario.component.css',
})
export class DesignReportInventarioComponent implements OnInit, AfterViewInit {
  // ---------------------------------------------------------------------------------------
  // DECLARACIÓN VARIABLES
  // ---------------------------------------------------------------------------------------
  datosInventario: inventariosModel = {} as inventariosModel;
  InventarioSeleccionado: inventariosModel = {} as inventariosModel;
  DetalleInventarioSeleccionado: detalleCarga[] = [];
  datosInventarioslista: inventariosModel[] = [];
  columnasSeleccionadas: string[] = [];
  columnasSeleccionadasAjuste: string[] = [];
  listaProductos: detalleCarga[] = [];
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private _inventarios = inject(InventariosService);
  private readonly ObjectInventario = inject(InventariosByIdUseCases);
  private readonly DetalleInventario = inject(InventarioDetallesUseCases);
  private readonly listDetalleByFiltros = inject(
    InventarioDetallesByFiltrosUseCases
  );
  private readonly mensajeExportPdf = inject(MensajeGenerarReportePdfService);

  titulosOpciones = '';
  selectedOption = '';

  showPantalla_data = false;
  cambiarPantalla() {
    this.showPantalla_data = !this.showPantalla_data;
  }

  exportar() {
    if (!this.selectedOption) {
      alert('Seleccione un formato antes de exportar.');
      return;
    }

    if (this.selectedOption === 'excel') {
      this.inventarioSeleccionadoExcel();
    } else if (this.selectedOption === 'pdf') {
      this.inventarioSeleccionado(
        this.citaSeleccionada.rucempresa,
        this.citaSeleccionada.idcarga
      );
    }
  }

  selectOptionEXCEL(option: string) {
    this.selectedOption = option;
    if (this.selectedOption === 'excel') {
      this.inventarioSeleccionadoExcel();
    }
  }

  selectOptionPDF(option: string) {
    this.selectedOption = option;
    if (this.selectedOption === 'pdf') {
      this.inventarioSeleccionado(
        this.citaSeleccionada.rucempresa,
        this.citaSeleccionada.idcarga
      );
    }
  }

  inventarioSeleccionado(rucempresa: string, idcarga: number) {
    const reqDatos: requestDatosasignar = { rucempresa, idcarga };
    this.ObjectInventario.getInventarioById(reqDatos).subscribe(
      (response: inventariosModel) => {
        this.InventarioSeleccionado = response;

        this.exportToPDF();
      }
    );
  }

  // ---------------------------------------------------------------------------------------
  // DECORADORES
  // ---------------------------------------------------------------------------------------

  @Input() citaSeleccionada: inventariosModel = {} as inventariosModel;
  @Input() detalleProductos: detalleCarga[] = [];
  @Input() rucEmpresa!: string;
  @Input() idCarga!: number;
  @Input() TotalRegistros = 0;
  @Input() RegistrosFaltantes = 0;
  @Input() RegistrosNoFaltantes = 0;
  @Input() NuevosRegistros = 0;
  @Input() ConteosExactos = 0;
  @Input() ItemsAjustados = 0;
  @Input() EditadosManual = 0;

  ObtenerDetalleInventariosPDF(
    diferencias: number,
    esnuevo: number,
    esEditado: number,
    ajuste: number
  ) {
    const rucempresa: string = this.citaSeleccionada.rucempresa;
    const idcarga: number = this.citaSeleccionada.idcarga;
    if (ajuste == 0) {
      const reqDatos: RequestObtenerDetalleFiltros = {
        rucempresa,
        idcarga,
        diferencias,
        esnuevo,
        esEditado,
      };
      this.listDetalleByFiltros
        .getDetalleInventarioByFiltros(reqDatos)
        .subscribe((response: detalleCarga[]) => {
          this.listaProductos = response;
          this.dataSource.data = this.listaProductos;

          if (diferencias == 0 && esnuevo == 2 && esEditado == 2) {
            this.titulosOpciones = 'Total de registros';
          } else if (diferencias == 3 && esnuevo == 0 && esEditado == 2) {
            this.titulosOpciones = 'Registros con faltantes';
          } else if (diferencias == 2 && esnuevo == 0 && esEditado == 2) {
            this.titulosOpciones = 'Registros sin faltantes';
          } else if (diferencias == 0 && esnuevo == 1 && esEditado == 2) {
            this.titulosOpciones = 'Nuevos registros';
          } else if (diferencias == 1 && esnuevo == 2 && esEditado == 2) {
            this.titulosOpciones = 'Conteos exactos';
          } else if (diferencias == 0 && esnuevo == 2 && esEditado == 1) {
            this.titulosOpciones = 'Editados manualmente';
          } else if (diferencias == 0 && esnuevo == 0 && esEditado == 0) {
            this.titulosOpciones = 'Registros ajustados';
          } else {
            this.titulosOpciones = 'Sin datos';
          }
        });
    } else {
      const req: RequestObtenerDetalleAjusteFiltros = {
        rucempresa: this.citaSeleccionada.rucempresa,
        idcarga: this.citaSeleccionada.idcarga,
        ajustes: 2,
      };
      this._inventarios
        .getInventariosAjustesByFiltros(req)
        .subscribe((Response: detalleCarga[]) => {
          this.listaProductos = Response;
          this.dataSource.data = Response;
          this.titulosOpciones = 'Productos ajustados';
        });
    }
  }

  // ---------------------------------------------------------------------------------------
  // COLUMNAS SELECCIONADAS
  // ---------------------------------------------------------------------------------------

  recibirColumnasSeleccionadas(columnas: string[]): void {
    this.columnasSeleccionadas = columnas;
    this.displayedColumns = [...columnas];
  }

  // ---------------------------------------------------------------------------------------
  // FUNCIÓN PRINCIPAL
  // ---------------------------------------------------------------------------------------
  ngOnInit(): void {
    if (this.columnasSeleccionadas.length === 0) {
      this.columnasSeleccionadas = [
        'codigoproducto',
        'codigobarra',
        'descripcionProducto',
        'unidad',
        'stockL',
        'stockF',
        'stockresultante',
        'ajuste',
        'descripcionajuste',
        'almacen',
        'sucursal',
        'zona',
        'pasillo',
        'rack',
        'ubicacion',
        'esagrupado',
        'codigogrupo',
      ];
    }

    this.recibirColumnasSeleccionadas(this.columnasSeleccionadas);

    this.updateColumns();
    this.dataSource.data = this.listaProductos || [];
  }

  inventarioSeleccionadoDisenio(rucempresa: string, idcarga: number) {
    const reqDatos: requestDatosasignar = { rucempresa, idcarga };
    const reqDetalle: RequestObtenerDetalle = { rucempresa, idcarga };
    this.ObjectInventario.getInventarioById(reqDatos).subscribe(
      (response: inventariosModel) => {
        this.InventarioSeleccionado = response;
        reqDetalle.idcarga = response.idcarga;
        reqDetalle.rucempresa = response.rucempresa;
        this.DetalleInventario.getDetalleInventario(reqDetalle).subscribe(
          (response: detalleCarga[]) => {
            this.DetalleInventarioSeleccionado = response;
          }
        );
      }
    );
  }

  isGeneratingPDF = false;
  async exportToPDF() {
    this.isGeneratingPDF = true;

    try {
      this.mensajeExportPdf.Alert_GenerandoReporte_PDF();

      await new Promise(resolve => setTimeout(resolve, 100));

      const doc = new jsPDF({ orientation: 'landscape' });
      const pageWidth = doc.internal.pageSize.getWidth();

      //  PARTE 1 HEADER DISEÑO
      // ===================================================================================================
      // Dibuja la mitad izquierda del rectángulo (rojo)
      doc.setFillColor(220, 53, 69); // Rojo
      doc.rect(0, 0, pageWidth / 2, 10, 'F');

      // Dibuja el polígono inclinado para la mitad derecha (gris oscuro)
      doc.setFillColor(50, 50, 50); // Gris oscuro

      // Empieza el polígono en el punto de la parte superior izquierda
      doc.moveTo(pageWidth / 2 - 5, 0);

      // Dibuja la línea hacia el borde superior derecho
      doc.lineTo(pageWidth, 0);

      // Baja hasta la esquina inferior derecha
      doc.lineTo(pageWidth, 10);

      // Cambia la posición de la línea a la parte inferior de la mitad roja, pero ligeramente desplazada hacia la derecha
      doc.lineTo(pageWidth / 2, 10); // Este valor ajusta la inclinación a la derecha

      // Vuelve al punto de la base de la mitad roja, pero ligeramente hacia la derecha
      doc.lineTo(pageWidth / 2 - 15, 10);

      // Cierra el polígono conectando con el punto de inicio de la mitad roja
      doc.lineTo(pageWidth / 2 - 15, 10);

      // Rellena el polígono con el color gris oscuro
      doc.fill();

      //  PARTE 2 HEADER DISEÑO
      // ===================================================================================================
      // Dibuja completo el rectángulo (gris)
      doc.fill();
      doc.rect(0, 10, pageWidth / 2, 5, 'F');

      doc.setFillColor(85, 85, 85);
      doc.rect(0, 15, pageWidth / 2, 5, 'F');

      doc.setFillColor(50, 50, 50); // Gris oscuro
      doc.rect(0, 20, pageWidth / 2, 5, 'F');

      doc.rect(pageWidth / 2, 10, pageWidth / 2, 15, 'F');
      // Empieza el polígono en el punto de la parte superior izquierda
      doc.moveTo(pageWidth / 2, 0);

      // Dibuja la línea hacia el borde superior derecho
      doc.lineTo(pageWidth, 0);

      // Baja hasta la esquina inferior derecha
      doc.lineTo(pageWidth, 20);

      // Cambia la posición de la línea a la parte inferior de la mitad roja, pero ligeramente desplazada hacia la derecha
      doc.lineTo(pageWidth / 2, 20); // Este valor ajusta la inclinación a la derecha

      // Vuelve al punto de la base de la mitad roja, pero ligeramente hacia la derecha
      doc.lineTo(pageWidth / 2 - 15, 20);

      // Cierra el polígono conectando con el punto de inicio de la mitad roja
      doc.lineTo(pageWidth / 2 - 15, 20);

      // Rellena el polígono con el color gris oscuro
      doc.fill();

      //  PARTE 2 HEADER DISEÑO
      // ===================================================================================================

      // Dibuja el polígono inclinado para la mitad derecha (gris oscuro)
      doc.setFillColor(50, 50, 50); // Gris oscuro

      // Empieza el polígono en el punto de la parte superior izquierda
      doc.moveTo(pageWidth / 2 - 15, 24);

      // Dibuja la línea hacia el borde superior derecho
      doc.lineTo(pageWidth, 24);

      // Baja hasta la esquina inferior derecha
      doc.lineTo(pageWidth, 40);

      // Cambia la posición de la línea a la parte inferior de la mitad roja, pero ligeramente desplazada hacia la derecha
      doc.lineTo(pageWidth / 2, 40); // Este valor ajusta la inclinación a la derecha

      // Vuelve al punto de la base de la mitad roja, pero ligeramente hacia la derecha
      doc.lineTo(pageWidth / 2, 40);

      // Cierra el polígono conectando con el punto de inicio de la mitad roja
      doc.lineTo(pageWidth / 2, 40);

      // Rellena el polígono con el color gris oscuro
      doc.fill();

      // Texto del encabezado
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('REPORTE DE INVENTARIO', pageWidth - 100, 20);

      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

      // Validar datos
      if (!this.listaProductos || !Array.isArray(this.listaProductos)) {
        console.error('Error: listaProductos es inválida.');
        return;
      }

      const columnasSeleccionadas = this.columnasSeleccionadas;

      const allColumns = [
        { title: 'Almacén', dataKey: 'almacen' },
        { title: 'Sucursal', dataKey: 'sucursal' },
        { title: 'Zona', dataKey: 'zona' },
        { title: 'Pasillo', dataKey: 'pasillo' },
        { title: 'Rack', dataKey: 'rack' },
        { title: 'Ubicación', dataKey: 'ubicacion' },
        { title: 'Agrupado', dataKey: 'esagrupado' },
        { title: 'Grupo', dataKey: 'codigogrupo' },
        { title: 'Producto', dataKey: 'codigoproducto' },
        { title: 'Código Barra', dataKey: 'codigobarra' },
        { title: 'Descripción', dataKey: 'descripcionProducto' },
        { title: 'Unidad', dataKey: 'unidad' },
        { title: 'Stock L.', dataKey: 'stockL' },
        { title: 'Stock F.', dataKey: 'stockF' },
        { title: 'Resultante', dataKey: 'stockresultante' },
        { title: 'ajuste', dataKey: 'ajuste' },
        { title: 'descripcionajuste', dataKey: 'descripcionajuste' },
      ];

      const filteredColumns = allColumns.filter((col) =>
        columnasSeleccionadas.includes(col.dataKey)
      );

      // Tabla
      const startY = 50;
      (doc as any).autoTable({
        startY,
        head: [filteredColumns.map((col) => col.title)],
        body: this.listaProductos.map((det) =>
          filteredColumns.map((col) => String(det[col.dataKey] ?? ''))
        ),
        styles: {
          font: 'helvetica',
          fontSize: 9,
          cellPadding: 1.5,
          textColor: 30,
        },
        headStyles: {
          fillColor: [52, 58, 64], // gris oscuro
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: { fillColor: [248, 249, 250] }, // gris claro
        theme: 'grid',
      });

      // Totales
      const totalStockL = this.listaProductos.reduce(
        (acc, item) => acc + (Number(item.stockL) || 0),
        0
      );
      const totalStockF = this.listaProductos.reduce(
        (acc, item) => acc + (Number(item.stockF) || 0),
        0
      );
      const totalRes = this.listaProductos.reduce(
        (acc, item) => acc + (Number(item.stockresultante) || 0),
        0
      );

      const resumenY = (doc as any).lastAutoTable.finalY + 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.setFillColor(230, 230, 230);
      doc.rect(pageWidth - 70, resumenY - 6, 60, 28, 'F');
      doc.text('TOTALES', pageWidth - 65, resumenY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(
        `Stock L.: ${String(totalStockL)}`,
        pageWidth - 65,
        resumenY + 10
      );
      doc.text(
        `Stock F.: ${String(totalStockF)}`,
        pageWidth - 65,
        resumenY + 18
      );
      doc.text(
        `Resultante: ${String(totalRes)}`,
        pageWidth - 65,
        resumenY + 26
      );

      // Firma y mensaje
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text(
        'Gracias por usar el sistema de inventario',
        pageWidth / 2,
        resumenY + 50,
        { align: 'center' }
      );

      // Guardar
      const nombreArchivo = `${
        this.InventarioSeleccionado?.descripcion || 'inventario'
      }.pdf`;
      doc.save(nombreArchivo);

      // this.mensajeExportPdf.cerrarAlerta();

    } catch (error) {
      console.log(error);

      this.mensajeExportPdf.cerrarAlerta();
      Swal.fire({
        icon: 'error',
        title: 'Error al generar PDF',
        text: 'Ocurrió un problema, inténtalo nuevamente.',
      });
    } finally {
      this.isGeneratingPDF = false;
    }
  }

  // ---------------------------------------------------------------------------------------
  // DECLARACIÓN VARIABLES
  // ---------------------------------------------------------------------------------------
  detalleInventario: detalleCarga[] = [];

  private readonly ObjectInventarioExcel = inject(InventariosByIdUseCases);
  private readonly ObjetDetalleInventario = inject(InventarioDetallesUseCases);

  // ---------------------------------------------------------------------------------------
  // FUNCIÓN PARA OBTENER INVENTARIO Y EXPORTAR A EXCEL
  // ---------------------------------------------------------------------------------------
  inventarioSeleccionadoExcel() {
    const rucempresa: string = this.citaSeleccionada.rucempresa;
    const idcarga: number = this.citaSeleccionada.idcarga;
    const reqDatos: requestDatosasignar = { rucempresa, idcarga };
    const reqDatosDetalle: RequestObtenerDetalle = { rucempresa, idcarga };

    this.ObjectInventario.getInventarioById(reqDatos).subscribe(
      (response: inventariosModel) => {
        this.InventarioSeleccionado = response;

        this.ObjetDetalleInventario.getDetalleInventario(
          reqDatosDetalle
        ).subscribe((response: detalleCarga[]) => {
          this.detalleInventario = response;
          this.exportToExcel();
        });
      }
    );
  }

  // ---------------------------------------------------------------------------------------
  // FUNCIÓN EXPORTAR A EXCEL
  // ---------------------------------------------------------------------------------------
  private exportToExcel() {
    // Filtrar las columnas de acuerdo con las seleccionadas
    const columnasSeleccionadas = this.columnasSeleccionadas;

    // Filtrar los datos antes de exportar
    const dataFiltrada = this.listaProductos.map((det) => {
      const fila: any = {};
      columnasSeleccionadas.forEach((columna) => {
        fila[columna] = det[columna];
      });
      return fila;
    });

    // Convertir los datos filtrados a hoja de Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataFiltrada);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

    const nombreArchivo = `${this.InventarioSeleccionado.descripcion}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  }

  dataSource = new MatTableDataSource<detalleCarga>([]);
  private _liveAnnouncer = inject(LiveAnnouncer);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  constructor(private cdr: ChangeDetectorRef) {}
  updateColumns() {
    // Si no hay columnas seleccionadas, establece las predeterminadas
    if (
      !this.columnasSeleccionadas ||
      this.columnasSeleccionadas.length === 0
    ) {
      this.columnasSeleccionadas = [
        'codigoproducto',
        'codigobarra',
        'descripcionProducto',
        'unidad',
        'stockL',
        'stockF',
        'stockresultante',
        'ajuste',
      ];
    }

    this.displayedColumns = [...this.columnasSeleccionadas];
  }
}
