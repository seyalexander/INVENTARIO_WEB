import { Component, inject, Input, SimpleChanges } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { detalleCarga } from 'src/app/Domain/models/cargaDatos/cargaDatos.model';
import { inventariosModel } from 'src/app/Domain/models/inventarios/inventarios.models';
import { InventariosByIdUseCases } from 'src/app/Domain/use-case/inventarios/get-inventarioById-useCase';
import { DesignPageTablaDatosComponent } from '../design-page/design-page-tabla-datos/design-page-tabla-datos.component';
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
import { DesingPageTablaAjustadosComponent } from '../design-page/desing-page-tabla-ajustados/desing-page-tabla-ajustados.component';

@Component({
  selector: 'design-report-inventario',
  standalone: true,
  imports: [
    DesignPageTablaDatosComponent,
    FiltrosCheckboxTablaComponent,
    MatTabsModule,
    MatIcon,
    DesingPageTablaAjustadosComponent
  ],
  templateUrl: './design-report-inventario.component.html',
  styleUrl: './design-report-inventario.component.css',
})
export class DesignReportInventarioComponent {



  selectedOption: string = '';

  showPantalla_data: boolean = false
  cambiarPantalla() {
    this.showPantalla_data = !this.showPantalla_data;
  }

  exportar() {
    if (!this.selectedOption) {
      alert("Seleccione un formato antes de exportar.");
      return;
    }

    if (this.selectedOption === 'excel') {
      this.inventarioSeleccionadoExcel()

    } else if (this.selectedOption === 'pdf') {
      this.inventarioSeleccionado(
        this.citaSeleccionada.rucempresa,
        this.citaSeleccionada.idcarga
      )
    }
  }


  exportarEXCEL() {
    if (this.selectedOption === 'excel') {
      this.inventarioSeleccionadoExcel()
    }
  }

  exportarEXCELAjuste() {
    if (this.selectedOption === 'excel') {
      this.inventarioSeleccionadoExcelAjustar()
    }
  }

  exportarPDF() {
    if (this.selectedOption === 'pdf') {
      this.inventarioSeleccionado(
        this.citaSeleccionada.rucempresa,
        this.citaSeleccionada.idcarga
      )
    }
  }

  exportarPDFAjuste() {
    if (this.selectedOption === 'pdf') {
      this.inventarioSeleccionadoAjustados(
        this.citaSeleccionada.rucempresa,
        this.citaSeleccionada.idcarga
      )
    }
  }



  selectOptionEXCEL(option: string) {
    this.selectedOption = option;
    this.exportarEXCEL()
  }

  selectOptionEXCELAjuste(option: string) {
    this.selectedOption = option;
    this.exportarEXCELAjuste()
  }

  selectOptionPDF(option: string) {
    this.selectedOption = option;
    this.exportarPDF()
  }

  selectOptionPDFAjustar(option: string) {
    this.selectedOption = option;
    this.exportarPDFAjuste()
  }



  // ---------------------------------------------------------------------------------------
  // DECORADORES
  // ---------------------------------------------------------------------------------------

  @Input() citaSeleccionada: inventariosModel = {} as inventariosModel;
  @Input() detalleProductos: Array<detalleCarga> = [];
  @Input() rucEmpresa!: string;
  @Input() idCarga!: number;
  @Input() TotalRegistros: number = 0;
  @Input() RegistrosFaltantes: number = 0;
  @Input() RegistrosNoFaltantes: number = 0
  @Input() NuevosRegistros: number = 0;
  @Input() ConteosExactos: number = 0;
  @Input() ItemsAjustados: number = 0;
  @Input() EditadosManual: number = 0;

  private readonly listDetalleByFiltros = inject(InventarioDetallesByFiltrosUseCases);
  private _inventarios = inject(InventariosService)

  listaProductos: Array<detalleCarga> = [];
  titulosOpciones: string = ''
  ObtenerDetalleInventariosPDF(diferencias: number, esnuevo: number, esEditado: number ) {
    const rucempresa: string = this.citaSeleccionada.rucempresa
    const idcarga: number = this.citaSeleccionada.idcarga
    const reqDatos: RequestObtenerDetalleFiltros = { rucempresa, idcarga, diferencias, esnuevo, esEditado };
    this.listDetalleByFiltros
      .getDetalleInventarioByFiltros(reqDatos)
      .subscribe((response: detalleCarga[]) => {
        this.listaProductos = response;

        if (diferencias == 0 && esnuevo == 2 && esEditado == 2 ) {
          this.titulosOpciones = 'Total de registros';
        } else if (diferencias == 3 && esnuevo == 0 && esEditado == 2 ) {
          this.titulosOpciones = 'Registros con faltantes';
        } else if (diferencias == 2 && esnuevo == 0 && esEditado == 2 ) {
          this.titulosOpciones = 'Registros sin faltantes';
        } else if (diferencias == 0 && esnuevo == 1 && esEditado == 2 ) {
          this.titulosOpciones = 'Nuevos registros';
        } else if (diferencias == 1 && esnuevo == 2 && esEditado == 2 ) {
          this.titulosOpciones = 'Conteos exactos';
        } else if (diferencias == 0 && esnuevo == 2 && esEditado == 1 ) {
          this.titulosOpciones = 'Editados manualmente';
        } else {
          this.titulosOpciones = 'Sin datos';
        }
      });
  }


  ObtenerDetalleInventariosAjustados() {
    const req: RequestObtenerDetalleAjusteFiltros = {
      rucempresa: this.citaSeleccionada.rucempresa,
      idcarga: this.citaSeleccionada.idcarga,
      ajustes: 2
    }
    this._inventarios.getInventariosAjustesByFiltros(req)
      .subscribe((Response: detalleCarga[]) => {
        this.listaProductos = Response;
        this.titulosOpciones = 'Productos ajustados';
      });
  }

  // ---------------------------------------------------------------------------------------
  // DECLARACIÓN VARIABLES
  // ---------------------------------------------------------------------------------------
  datosInventario: inventariosModel = {} as inventariosModel;
  InventarioSeleccionado: inventariosModel = {} as inventariosModel;
  DetalleInventarioSeleccionado: Array<detalleCarga> = [];
  datosInventarioslista: Array<inventariosModel> = [];

  columnasSeleccionadas: string[] = [];

  columnasSeleccionadasAjuste: string[] = [];

  private readonly ObjectInventario = inject(InventariosByIdUseCases);
  private readonly DetalleInventario = inject(InventarioDetallesUseCases);

  // ---------------------------------------------------------------------------------------
  // COLUMNAS SELECCIONADAS
  // ---------------------------------------------------------------------------------------

  recibirColumnasSeleccionadas(columnas: string[]): void {
    this.columnasSeleccionadas = columnas;
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

    this.columnasSeleccionadasAjuste = [
      'codigoproducto',
      'codigobarra',
      'descripcionProducto',
      'unidad',
      'stockL',
      'stockF',
      'stockresultante',
      'ajuste',
      'descripcionajuste',
    ]

    this.recibirColumnasSeleccionadas(this.columnasSeleccionadas);
  }



  inventarioSeleccionadoDisenio(rucempresa: string, idcarga: number) {
    const reqDatos: requestDatosasignar = { rucempresa, idcarga };
    const reqDetalle: RequestObtenerDetalle = { rucempresa, idcarga };
    this.ObjectInventario.getInventarioById(reqDatos).subscribe(
      (response: inventariosModel) => {
        this.InventarioSeleccionado = response;
        reqDetalle.idcarga = response.idcarga
        reqDetalle.rucempresa = response.rucempresa
        this.DetalleInventario.getDetalleInventario(reqDetalle).subscribe(
          (response: detalleCarga[]) => {
            this.DetalleInventarioSeleccionado = response
            this.exportPDFPortada();
          }
        )

      }
    );
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

  inventarioSeleccionadoAjustados(rucempresa: string, idcarga: number) {
    const reqDatos: requestDatosasignar = { rucempresa, idcarga };
    this.ObjectInventario.getInventarioById(reqDatos).subscribe(
      (response: inventariosModel) => {
        this.InventarioSeleccionado = response;
        this.inventarioSeleccionadoExcelAjustar();
      }
    );
  }


  exportToPDF() {
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
    doc.lineTo(pageWidth , 0);

    // Baja hasta la esquina inferior derecha
    doc.lineTo(pageWidth, 10);

    // Cambia la posición de la línea a la parte inferior de la mitad roja, pero ligeramente desplazada hacia la derecha
    doc.lineTo(pageWidth / 2 , 10);  // Este valor ajusta la inclinación a la derecha

    // Vuelve al punto de la base de la mitad roja, pero ligeramente hacia la derecha
    doc.lineTo(pageWidth / 2 - 15, 10);

    // Cierra el polígono conectando con el punto de inicio de la mitad roja
    doc.lineTo(pageWidth/2 - 15, 10);

    // Rellena el polígono con el color gris oscuro
    doc.fill();

    //  PARTE 2 HEADER DISEÑO
    // ===================================================================================================
    // Dibuja completo el rectángulo (gris)
    doc.fill();
    doc.rect(0, 10, pageWidth / 2 , 5 , 'F');

    doc.setFillColor(85,85,85);
    doc.rect(0, 15, pageWidth / 2 , 5, 'F');

    doc.setFillColor(50, 50, 50); // Gris oscuro
    doc.rect(0, 20, pageWidth / 2 , 5, 'F');

    doc.rect(pageWidth / 2, 10, pageWidth / 2, 15, 'F');
    // Empieza el polígono en el punto de la parte superior izquierda
    doc.moveTo(pageWidth / 2, 0);

    // Dibuja la línea hacia el borde superior derecho
    doc.lineTo(pageWidth, 0);

    // Baja hasta la esquina inferior derecha
    doc.lineTo(pageWidth, 20);

    // Cambia la posición de la línea a la parte inferior de la mitad roja, pero ligeramente desplazada hacia la derecha
    doc.lineTo(pageWidth / 2 , 20);  // Este valor ajusta la inclinación a la derecha

    // Vuelve al punto de la base de la mitad roja, pero ligeramente hacia la derecha
    doc.lineTo(pageWidth / 2 - 15, 20);

    // Cierra el polígono conectando con el punto de inicio de la mitad roja
    doc.lineTo(pageWidth/2 - 15, 20);

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
    doc.lineTo(pageWidth / 2 , 40);  // Este valor ajusta la inclinación a la derecha

    // Vuelve al punto de la base de la mitad roja, pero ligeramente hacia la derecha
    doc.lineTo(pageWidth / 2 , 40);

    // Cierra el polígono conectando con el punto de inicio de la mitad roja
    doc.lineTo(pageWidth/2 , 40);

    // Rellena el polígono con el color gris oscuro
    doc.fill();


    // Texto del encabezado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('REPORTE DE INVENTARIO', pageWidth - 100, 20);

    doc.setFontSize(10);
    doc.setTextColor(50,50,50);
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
    ];

    const filteredColumns = allColumns.filter(col =>
      columnasSeleccionadas.includes(col.dataKey)
    );

    // Tabla
    const startY = 50;
    (doc as any).autoTable({
      startY,
      head: [filteredColumns.map(col => col.title)],
      body: this.listaProductos.map(det =>
        filteredColumns.map(col => String(det[col.dataKey] ?? ''))
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
    const totalStockL = this.listaProductos.reduce((acc, item) => acc + (Number(item.stockL) || 0), 0);
    const totalStockF = this.listaProductos.reduce((acc, item) => acc + (Number(item.stockF) || 0), 0);
    const totalRes = this.listaProductos.reduce((acc, item) => acc + (Number(item.stockresultante) || 0), 0);

    const resumenY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.setFillColor(230, 230, 230);
    doc.rect(pageWidth - 70, resumenY - 6, 60, 28, 'F');
    doc.text('TOTALES', pageWidth - 65, resumenY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Stock L.: ${String(totalStockL)}`, pageWidth - 65, resumenY + 10);
    doc.text(`Stock F.: ${String(totalStockF)}`, pageWidth - 65, resumenY + 18);
    doc.text(`Resultante: ${String(totalRes)}`, pageWidth - 65, resumenY + 26);

    // Firma y mensaje
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Gracias por usar el sistema de inventario', pageWidth / 2, resumenY + 50, { align: 'center' });

    // Guardar
    const nombreArchivo = `${this.InventarioSeleccionado?.descripcion || 'inventario'}.pdf`;
    doc.save(nombreArchivo);
  }




  // exportToPDF() {
  //   const doc = new jsPDF({ orientation: 'landscape' });

  //   doc.setFontSize(18);
  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Reporte de INVENTARIO', 105, 15);

  //   doc.setFontSize(14);
  //   doc.setFont('helvetica', 'normal');
  //   doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 25);

  //   let finalY = 35;

  //   doc.setFontSize(14);
  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Inventarios', 14, finalY);
  //   finalY += 6;

  //   // Filtrar columnas de acuerdo con las seleccionadas
  //   const columnasSeleccionadas = this.columnasSeleccionadas;

  //   // Definir las columnas que se mostrarán
  //   const employeeColumns = [
  //     { title: 'almacen', dataKey: 'almacen' },
  //     { title: 'sucursal', dataKey: 'sucursal' },
  //     { title: 'zona', dataKey: 'zona' },
  //     { title: 'pasillo', dataKey: 'pasillo' },
  //     { title: 'rack', dataKey: 'rack' },
  //     { title: 'ubicacion', dataKey: 'ubicacion' },
  //     { title: 'esagrupado', dataKey: 'esagrupado' },
  //     { title: 'codigogrupo', dataKey: 'codigogrupo' },
  //     { title: 'codigoproducto', dataKey: 'codigoproducto' },
  //     { title: 'codigobarra', dataKey: 'codigobarra' },
  //     { title: 'descripcionProducto', dataKey: 'descripcionProducto' },
  //     { title: 'unidad', dataKey: 'unidad' },
  //     { title: 'stockL', dataKey: 'stockL' },
  //     { title: 'stockF', dataKey: 'stockF' },
  //     { title: 'stockresultante', dataKey: 'stockresultante' },
  //   ];

  //   const filteredColumns = employeeColumns.filter((col) =>
  //     columnasSeleccionadas.includes(col.dataKey)
  //   );

  //   if (!this.listaProductos || !Array.isArray(this.listaProductos)) {
  //     console.error('Error: Detalle producto o su detalle es undefined o no es un array');
  //     return;
  //   }

  //   const employeeBody = this.listaProductos.map((det) => {
  //     return filteredColumns.map((col) => {
  //       return det[col.dataKey];
  //     });
  //   });

  //   (doc as any).autoTable({
  //     head: [filteredColumns.map((col) => col.title)],
  //     body: employeeBody,
  //     startY: finalY,
  //     styles: {
  //       font: 'helvetica',
  //       fontSize: 8,
  //       cellPadding: 1,
  //       textColor: [34, 34, 34],
  //       fillColor: [255, 255, 255],
  //       lineColor: [44, 62, 80],
  //       lineWidth: 0.2,
  //     },
  //     headStyles: {
  //       fillColor: [52, 152, 219],
  //       textColor: [255, 255, 255],
  //       fontSize: 10,
  //       fontStyle: 'bold',
  //       halign: 'center',
  //     },
  //   });

  //   doc.save(`${this.InventarioSeleccionado.descripcion}.pdf`);
  // }


  exportToPDFAjustado() {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de INVENTARIO', 105, 15);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 25);

    let finalY = 35;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Inventarios', 14, finalY);
    finalY += 6;

    // Filtrar columnas de acuerdo con las seleccionadas
    const columnasSeleccionadas = this.columnasSeleccionadasAjuste;

    // Definir las columnas que se mostrarán
    const employeeColumns = [
      { title: 'codigoproducto', dataKey: 'codigoproducto' },
      { title: 'codigobarra', dataKey: 'codigobarra' },
      { title: 'descripcionProducto', dataKey: 'descripcionProducto' },
      { title: 'unidad', dataKey: 'unidad' },
      { title: 'stockL', dataKey: 'stockL' },
      { title: 'stockF', dataKey: 'stockF' },
      { title: 'stockresultante', dataKey: 'stockresultante' },
      { title: 'ajuste', dataKey: 'ajuste' },
      { title: 'descripcionajuste', dataKey: 'descripcionajuste' },
    ];

    const filteredColumns = employeeColumns.filter((col) =>
      columnasSeleccionadas.includes(col.dataKey)
    );

    if (!this.listaProductos || !Array.isArray(this.listaProductos)) {
      console.error('Error: Detalle producto o su detalle es undefined o no es un array');
      return;
    }

    const employeeBody = this.listaProductos.map((det) => {
      return filteredColumns.map((col) => {
        return det[col.dataKey];
      });
    });

    (doc as any).autoTable({
      head: [filteredColumns.map((col) => col.title)],
      body: employeeBody,
      startY: finalY,
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 1,
        textColor: [34, 34, 34],
        fillColor: [255, 255, 255],
        lineColor: [44, 62, 80],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
      },
    });

    doc.save(`${this.InventarioSeleccionado.descripcion}.pdf`);
  }

  // ---------------------------------------------------------------------------------------
  // EXPORTAR PDF CON PORTADA Y FOOTER
  // ---------------------------------------------------------------------------------------
  exportPDFPortada(): void {
    const content = document.getElementById('container-portada');
    const content1 = document.getElementById('container-final');
    const doc = new jsPDF('landscape');

    if (content && content1) {
      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        doc.addImage(imgData, 'JPEG', 0, 0, 297, 210);

        doc.addPage();

        this.generatePDFDetail(doc).then(() => {
          doc.addPage();

          html2canvas(content1).then((canvas1) => {
            const imgData1 = canvas1.toDataURL('image/jpeg', 1.0);
            doc.addImage(imgData1, 'JPEG', 0, 0, 297, 210);
            doc.save(`${this.InventarioSeleccionado.descripcion}.pdf`);
          });
        });
      });
    }
  }

  generatePDFDetail(doc: jsPDF): Promise<void> {
    return new Promise((resolve) => {
      const pageWidth = 297;
      const pageHeight = 210;

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Reporte de INVENTARIO', pageWidth / 2, 15, { align: 'center' });

      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 25);

      let finalY = 35;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Inventarios', 14, finalY);
      finalY += 6;

      const employeeColumns = [
        'almacen',
        'sucursal',
        'zona',
        'pasillo',
        'rack',
        'ubicacion',
        'esagrupado',
        'codigogrupo',
        'codigoproducto',
        'codigobarra',
        'descripcionProducto',
        'Unidad',
        'stockL',
        'stockfisico',
        'stockresultante',
      ];

      const employeeBody = this.listaProductos.map((det) => [
        det.almacen,
        det.sucursal,
        det.zona,
        det.pasillo,
        det.rack,
        det.ubicacion,
        det.esagrupado,
        det.codigogrupo,
        det.codigoproducto,
        det.Codigobarra,
        det.descripcionProducto,
        det.Unidad,
        det.stockL,
        det.stockF,
        det.stockresultante
      ]);

      (doc as any).autoTable({
        head: [employeeColumns],
        body: employeeBody,
        startY: finalY,
        styles: {
          font: 'helvetica',
          fontSize: 8,
          cellPadding: 1,
          textColor: [34, 34, 34],
          fillColor: [255, 255, 255],
          lineColor: [44, 62, 80],
          lineWidth: 0.2,
        },
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 30 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 30 },
          6: { cellWidth: 20 },
          7: { cellWidth: 'auto' },
          8: { cellWidth: 'auto' },
          9: { cellWidth: 'auto' },
          10: { cellWidth: 40 },
          11: { cellWidth: 30 },
        },
        tableWidth: pageWidth - 20,
        margin: { left: 10, right: 10, top: finalY, bottom: 10 },
      });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Reporte generado por el sistema DB INVENTORY - Contacto: Data Business S.A.C.',
        14,
        pageHeight - 10
      );

      resolve();
    });
  }



  // ---------------------------------------------------------------------------------------
  // DECLARACIÓN VARIABLES
  // ---------------------------------------------------------------------------------------
  detalleInventario: Array<detalleCarga> = []

  private readonly ObjectInventarioExcel = inject(InventariosByIdUseCases);
  private readonly ObjetDetalleInventario = inject(InventarioDetallesUseCases);

  // ---------------------------------------------------------------------------------------
  // FUNCIÓN PARA OBTENER INVENTARIO Y EXPORTAR A EXCEL
  // ---------------------------------------------------------------------------------------
  inventarioSeleccionadoExcel() {
    const rucempresa: string = this.citaSeleccionada.rucempresa
    const idcarga: number = this.citaSeleccionada.idcarga
    const reqDatos: requestDatosasignar = { rucempresa, idcarga };
    const reqDatosDetalle: RequestObtenerDetalle = { rucempresa, idcarga };

    this.ObjectInventario.getInventarioById(reqDatos).subscribe(
      (response: inventariosModel) => {
        this.InventarioSeleccionado = response;

        this.ObjetDetalleInventario.getDetalleInventario(reqDatosDetalle).subscribe(
          (response: detalleCarga[]) => {
            this.detalleInventario = response;
            this.exportToExcel();
          }
        )
      }
    );
  }

  inventarioSeleccionadoExcelAjustar() {
    const rucempresa: string = this.citaSeleccionada.rucempresa
    const idcarga: number = this.citaSeleccionada.idcarga
    const reqDatos: requestDatosasignar = { rucempresa, idcarga };
    const reqDatosDetalle: RequestObtenerDetalle = { rucempresa, idcarga };

    this.ObjectInventario.getInventarioById(reqDatos).subscribe(
      (response: inventariosModel) => {
        this.InventarioSeleccionado = response;

        this.ObjetDetalleInventario.getDetalleInventario(reqDatosDetalle).subscribe(
          (response: detalleCarga[]) => {
            this.detalleInventario = response;
            this.exportToExcelAjuste();
          }
        )
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

  private exportToExcelAjuste() {
    // Filtrar las columnas de acuerdo con las seleccionadas
    const columnasSeleccionadas = this.columnasSeleccionadasAjuste;

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

}
