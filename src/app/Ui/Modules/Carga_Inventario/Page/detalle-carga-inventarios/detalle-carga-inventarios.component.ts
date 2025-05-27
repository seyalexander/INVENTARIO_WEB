import { CommonModule, NgClass } from '@angular/common';
import { Component, Input, SimpleChanges, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { detalleCarga } from 'src/app/Domain/models/cargaDatos/cargaDatos.model';
import { inventariosModel } from 'src/app/Domain/models/inventarios/inventarios.models';

@Component({
  selector: 'app-detalle-carga-inventarios',
  standalone: true,
  imports: [
    NgxPaginationModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    NgClass,
    CommonModule,
    MatInputModule
  ],
  templateUrl: './detalle-carga-inventarios.component.html',
  styleUrls: ['./detalle-carga-inventarios.component.css']
})
export class DetalleCargaInventariosComponent implements AfterViewInit, OnChanges {

  displayedColumns: string[] = [
    'codigoproducto',
    'codigobarra',
    'descripcionProducto',
    'unidad',
    'stockL',
    'almacen',
    'sucursal',
    'zona',
    'pasillo',
    'rack',
    'ubicacion',
    'esagrupado',
    'codgrupo'
  ];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  itemsPerPage = 10; // Valor predeterminado

  @Input() detalleProductos: detalleCarga[] = [];
  dataSource = new MatTableDataSource<detalleCarga>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['detalleProductos']) {
      this.dataSource.data = this.detalleProductos || [];
      this.updatePaginator();
    }
  }

  onItemsPerPageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(target.value);
    this.updatePaginator();
  }

  updatePaginator() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
      this.paginator._changePageSize(this.itemsPerPage);
    }
  }

  @Input() citaSeleccionada: inventariosModel = {} as inventariosModel;
  @Input() cantidadInventarios = 0;

  encabezadoTable: BodyDetalle[] = [];
}

interface BodyDetalle {
  matColumnDef: string;
  title: string;
  dato: string;
}
