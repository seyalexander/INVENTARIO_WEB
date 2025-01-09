import { Component, inject } from '@angular/core';
import { ModalReporteDetalleInventarioComponent } from '../../modals/modal-reporte-detalle-inventario/modal-reporte-detalle-inventario.component';
import { inventariosModel } from '../../../../../Domain/models/inventarios/inventarios.models';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { InventariosByIdUseCases } from '../../../../../Domain/use-case/inventarios/get-inventarioById-useCase';
import { detalleCarga } from '../../../../../Domain/models/cargaDatos/cargaDatos.model';
import { Subscription } from 'rxjs';
import { InventariosUseCases } from '../../../../../Domain/use-case/inventarios/get-inventarios-useCase';
import Swal from 'sweetalert2';
import { DescargarReportePdfComponent } from '@modules/reportes/components/descargar-reporte-pdf/descargar-reporte-pdf.component';

@Component({
  selector: 'reporte-inventario',
  standalone: true,
  imports:[
    DescargarReportePdfComponent
  ],
  templateUrl: './reporte-inventario.component.html',
  styleUrl: './reporte-inventario.component.css'
})
export class ReporteInventarioComponent {

  datosInventarioslista: Array<inventariosModel> = [];
  datosInventario: inventariosModel = {} as inventariosModel;

  InventarioSeleccionado: inventariosModel = {} as inventariosModel
  DetalleInventarioSeleccionado: Array<inventariosModel> = []

  ngOnInit(): void {
    this.listarInventarios()

  }

  inventarioSeleccionado(rucEmpresa: string ,idCarga: number){
    this.ObjectInventario
    .getInventarioById(rucEmpresa, idCarga)
    .subscribe((response: inventariosModel) => {
      this.InventarioSeleccionado = response
      this.exportToPDF()
    })
  }

  exportToPDF() {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de IVENTARIO', 105, 15);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 25);

    let finalY = 35;

    // Sección: Información Principal
    // doc.setFontSize(16);
    // doc.setFont('helvetica', 'bold');
    // doc.text('Información Principal', 14, finalY);
    // finalY += 6;

    // Definir las columnas para la tabla principal
    // const columns = [
    //   { title: 'Inventario', dataKey: 'razon_Social' },
    //   { title: 'Ruc Empresa', dataKey: 'matricula' },
    //   { title: 'Usuario', dataKey: 'chofer' },
    // ];

    // Generar la tabla principal
    // (doc as any).autoTable({
    //   head: [columns.map(col => col.title)],
    //   body: [
    //     [
    //       this.datosInventario.descripcion,
    //       this.datosInventario.rucempresa,
    //       this.datosInventario.usuariocreacion
    //     ]
    //   ],
    //   startY: finalY,
    //   styles: {
    //     font: 'helvetica',
    //     fontSize: 10,
    //     cellPadding: 4,
    //     textColor: [34, 34, 34],
    //     fillColor: [255, 255, 255],
    //     lineColor: [44, 62, 80],
    //     lineWidth: 0.2,
    //   },
    //   headStyles: {
    //     fillColor: [52, 152, 219],
    //     textColor: [255, 255, 255],
    //     fontSize: 12,
    //     fontStyle: 'bold',
    //     halign: 'center'
    //   },
    //   alternateRowStyles: {
    //     fillColor: [245, 245, 245]
    //   },
    //   columnStyles: {
    //     0: { cellWidth: 'auto' },
    //     1: { cellWidth: 'auto' },
    //     2: { cellWidth: 'auto' }
    //   }
    // });

    // finalY = (doc as any).lastAutoTable.finalY + 10;

    // Sección: Inventarios
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Inventarios', 14, finalY);
    finalY += 6;

    // Definir las columnas para la tabla de empleados
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
    // Generar el cuerpo de la tabla de empleados
    const employeeBody = this.InventarioSeleccionado.detalle.map(det => [
      det.almacen,
      det.sucursal,
      det.zona,
      det.pasillo,
      det.rack,
      det.ubicacion,
      det.esagrupado,
      det.codigogrupo,
      det.codigoproducto,
      det.codigobarra,
      det.descripcionProducto,
      det.unidad,
      det.stockL,
      det.stockfisico
    ]);

    // Generar la tabla de inventarios
    (doc as any).autoTable({
      head: [employeeColumns.map(col => col.title)],
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
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 21 },
        2: { cellWidth: 14 },
        3: { cellWidth: 17 },
        4: { cellWidth: 13 },
        5: { cellWidth: 23 },
        6: { cellWidth: 16 },
        7: { cellWidth: 'auto' },
        8: { cellWidth: 'auto' },
        9: { cellWidth: 'auto' },
        10: { cellWidth: 30},
        11: { cellWidth: 20}
      }
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // Añadir pie de página
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Reporte generado por el sistema DB INVENTORY - Contacto: Data Business S.A.C.', 14, 285);



    doc.save(`${this.InventarioSeleccionado.descripcion}.pdf`)
    // Guardar el PDF
    window.open(doc.output('bloburl'), '_blank');
  }

  private ObjectInventario = inject(InventariosByIdUseCases);
  listaProductos: Array<detalleCarga> = [];
  cantidadListaProductos: number = 0;
  totalPagesProductos: number = 0;
  ObtenerDetalleInventarios(rucempresa: string, idcarga: number) {
    this.ObjectInventario.getInventarioById(rucempresa, idcarga).subscribe((response: inventariosModel) => {
      this.datosInventario = response;
      this.listaProductos = response.detalle;
      this.cantidadListaProductos = response.detalle.length;
      this.totalPagesProductos = Math.ceil(this.cantidadListaProductos / this.itemsPerPageProductos);
      this.updatePaginatedProductos();
    });
  }


  paginatedProductos: Array<detalleCarga> = [];
  currentPageProductos: number = 1;
  itemsPerPageProductos: number = 5;

  updatePaginatedProductos() {
    const startIndex = (this.currentPageProductos - 1) * this.itemsPerPageProductos;
    const endIndex = startIndex + this.itemsPerPageProductos;
    this.paginatedProductos = this.listaProductos.slice(startIndex, endIndex);
  }

  handlePageChange(newPage: number) {
    this.currentPageProductos = newPage;
    this.updatePaginatedProductos();
  }

  recargarPagina() {
    window.location.reload()
  }



  private inventarioSubscription: Subscription | undefined;
  private listaInventarios = inject(InventariosUseCases);
  cantidadDatosInventarioLista: number = 0;
  mostrarRefrescoPagina: boolean = true;

listarInventarios() {

  const lastUpdated = parseInt(localStorage.getItem('lastUpdated') || '0', 10);
  const now = Date.now();
  const interval = 30000;

  // if (now - lastUpdated < interval) {
  //   Swal.fire({
  //     icon: "error",
  //     title: "Los datos están actualizados",
  //   });
  //   console.log("Los datos están actualizados, no se hace una nueva solicitud.");
  //   return;
  // }

  try {
    this.inventarioSubscription = this.listaInventarios.getInventarios().subscribe({

      next: (response: inventariosModel[]) => {
        if (Array.isArray(response)) {
          this.datosInventarioslista = response;
          this.cantidadDatosInventarioLista = response.length;
          this.mostrarRefrescoPagina = false
          localStorage.setItem('lastUpdated', now.toString());



        } else {
          this.respuestaInventariosNoValidos(response);
          this.datosInventarioslista = [];
          this.cantidadDatosInventarioLista = 0;
        }
      },
      error: (error) => {
        this.respuestaInventariosSinAcceso(error.name);
        this.datosInventarioslista = [];
        this.cantidadDatosInventarioLista = 0;
        this.mostrarRefrescoPagina = true;
      }
    });
  } catch (err) {
    this.respuestaInventariosErrorInesperado(err);
  }
}


respuestaInventariosNoValidos(response:any): void {
  Swal.fire({
    icon: "error",
    title: "DATOS NO VÁLIDOS",
    text: `${response}`
  });
}

respuestaInventariosSinAcceso(response:any): void {
  Swal.fire({
    icon: "error",
    title: `${response}`,
    text: "verifique que la conexión del api y recargue el listado"
  }).then((respuesta)=> {

  });
}

respuestaInventariosErrorInesperado(response:any): void {
  Swal.fire({
    icon: "error",
    title: `Error inesperado en listarInventarios`,
    text: `${response}`
  });
}

}
