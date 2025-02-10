import { Component, inject, Input } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { detalleCarga } from 'src/app/Domain/models/cargaDatos/cargaDatos.model';
import { inventariosModel } from 'src/app/Domain/models/inventarios/inventarios.models';
import { InventariosByIdUseCases } from 'src/app/Domain/use-case/inventarios/get-inventarioById-useCase';
import * as html2pdf from 'html2pdf.js';
import { DesignPagePortadaComponent } from '../design-page/design-page-portada/design-page-portada.component';
import { DesignPageTablaDatosComponent } from '../design-page/design-page-tabla-datos/design-page-tabla-datos.component';
import { FiltrosCheckboxTablaComponent } from '../../filtros-checkbox-tabla/filtros-checkbox-tabla.component';
import { requestDatosasignar } from 'src/app/Domain/models/inventarios/requestObtenerDatosAsignar.model';

@Component({
  selector: 'design-report-inventario',
  standalone: true,
  imports: [
    DesignPagePortadaComponent,
    DesignPageTablaDatosComponent,
    FiltrosCheckboxTablaComponent,
  ],
  templateUrl: './design-report-inventario.component.html',
  styleUrl: './design-report-inventario.component.css',
})
export class DesignReportInventarioComponent {
  // ---------------------------------------------------------------------------------------
  // DECORADORES
  // ---------------------------------------------------------------------------------------

  @Input() citaSeleccionada: inventariosModel = {} as inventariosModel;
  @Input() detalleProductos: Array<detalleCarga> = [];

  @Input() rucEmpresa!: string;
  @Input() idCarga!: number;

  // ---------------------------------------------------------------------------------------
  // DECLARACIÓN VARIABLES
  // ---------------------------------------------------------------------------------------
  datosInventario: inventariosModel = {} as inventariosModel;
  InventarioSeleccionado: inventariosModel = {} as inventariosModel;

  DetalleInventarioSeleccionado: Array<inventariosModel> = [];
  datosInventarioslista: Array<inventariosModel> = [];

  columnasSeleccionadas: string[] = [];

  private readonly ObjectInventario = inject(InventariosByIdUseCases);

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
        'unidad',
        'stockL',
        'stockfisico',
      ];
    }

    this.recibirColumnasSeleccionadas(this.columnasSeleccionadas);
  }

  // ---------------------------------------------------------------------------------------
  // DECLARACIÓN VARIABLES
  // ---------------------------------------------------------------------------------------
  inventarioSeleccionado(rucempresa: string, idcarga: number) {
    const reqDatos: requestDatosasignar = { rucempresa, idcarga };
    this.ObjectInventario.getInventarioById(reqDatos).subscribe(
      (response: inventariosModel) => {
        console.log("OBJETO PARA REPORTE: ",reqDatos);
        console.log("DATA PARA REPORTE: ",response);

        this.InventarioSeleccionado = response;

        this.exportToPDF();
      }
    );
  }

  inventarioSeleccionadoDisenio(rucempresa: string, idcarga: number) {
    const reqDatos: requestDatosasignar = { rucempresa, idcarga };
    this.ObjectInventario.getInventarioById(reqDatos).subscribe(
      (response: inventariosModel) => {
        console.log("OBJETO PARA REPORTE: ",reqDatos);
        console.log("DATA PARA REPORTE: ",response);

        this.InventarioSeleccionado = response;
        this.exportPDFPortada();
      }
    );
  }

  exportToPDF() {
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
    const columnasSeleccionadas = this.columnasSeleccionadas;

    // Definir las columnas que se mostrarán
    const employeeColumns = [
      { title: 'almacen', dataKey: 'almacen' },
      { title: 'sucursal', dataKey: 'sucursal' },
      { title: 'zona', dataKey: 'zona' },
      { title: 'pasillo', dataKey: 'pasillo' },
      { title: 'rack', dataKey: 'rack' },
      { title: 'ubicacion', dataKey: 'ubicacion' },
      { title: 'esagrupado', dataKey: 'esagrupado' },
      { title: 'codigogrupo', dataKey: 'codigogrupo' },
      { title: 'codigoproducto', dataKey: 'codigoproducto' },
      { title: 'codigobarra', dataKey: 'codigobarra' },
      { title: 'descripcionProducto', dataKey: 'descripcionProducto' },
      { title: 'unidad', dataKey: 'unidad' },
      { title: 'stockL', dataKey: 'stockL' },
      { title: 'stockfisico', dataKey: 'stockfisico' },
    ];

    // Filtrar las columnas que deben aparecer en el PDF
    const filteredColumns = employeeColumns.filter((col) =>
      columnasSeleccionadas.includes(col.dataKey)
    );

    // Filtrar los datos del inventario de acuerdo con las columnas visibles
    // Validar que `this.citaSeleccionada` y `detalle` existan antes de usar `.map()`
    if (
      !this.citaSeleccionada ||
      !Array.isArray(this.citaSeleccionada.detalle)
    ) {
      console.error(
        'Error: citaSeleccionada o su detalle es undefined o no es un array'
      );
      return;
    }

    const employeeBody = this.citaSeleccionada.detalle.map((det) => {
      return filteredColumns.map((col) => det[col.dataKey]);
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

    console.log(
      'GUARDADO DE PDF: ',
      `${this.InventarioSeleccionado.descripcion}.pdf`
    );

    // Descargar el archivo PDF
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
        'unidad',
        'stockL',
        'stockfisico',
      ];

      const employeeBody = this.InventarioSeleccionado.detalle.map((det) => [
        det.almacen,
        det.sucursal,
        det.zona,
        det.pasillo,
        det.rack,
        det.ubicacion,
        det.esagrupado,
        det.codigogrupo,
        det.Codigoproducto,
        det.codigobarra,
        det.descripcionProducto,
        det.Unidad,
        det.stockL,
        det.stockF,
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
        tableWidth: pageWidth - 20, // Ajustar el ancho de la tabla al tamaño de la página
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
}
