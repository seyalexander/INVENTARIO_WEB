import { CommonModule } from '@angular/common';
import { ApplicationRef, Component, ComponentRef, Inject, inject, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmpresasModel } from 'src/app/Domain/models/empresas/empresas.model';
import { inventariosModel } from 'src/app/Domain/models/inventarios/inventarios.models';
import { CargaDatosService } from 'src/app/Infraestructure/driven-adapter/carga_datos/carga-datos.service';
import { EmpresasService } from 'src/app/Infraestructure/driven-adapter/empresas/empresas.service';
import { InventariosService } from 'src/app/Infraestructure/driven-adapter/inventarios/inventarios.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { PreviewCargaInventariosComponent } from '../preview-carga-inventarios/preview-carga-inventarios.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MensajeResponseEmpresas } from 'src/app/Domain/models/empresas/ResponseEmpresas.model';
import { detalleCarga } from 'src/app/Domain/models/cargaDatos/cargaDatos.model';
import { MensajeSeguridadModel } from 'src/app/Domain/models/seguridad/mensajeSeguridad.model';
import { GetUsuariosUseCases } from 'src/app/Domain/use-case/seguridad/get-usuarios-useCase';
import { SeguridadModel } from 'src/app/Domain/models/seguridad/seguridad.model';
import { ColumnMatcherComponent } from '@modules/Carga_Inventario/Components/column-matcher/column-matcher.component';
import { RequestInsertarMapeo } from 'src/app/Domain/models/mapeoColumnas/mapeoColumnas.model';
import { MapeoCamposService } from 'src/app/Infraestructure/driven-adapter/mapeoCampos/mapeo-campos.service';
import { MapeoObtenerMapeoById } from 'src/app/Domain/models/mapeoColumnas/mapeoObtenerMapeoById.mode';
import { MensajesRegistroInventarioService } from 'src/app/Infraestructure/core/SeetAlert/cargaInventario/mensajes-registro-inventario.service';

@Component({
  selector: 'registro-carga-inventarios',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PreviewCargaInventariosComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './registro-carga-inventarios.component.html',
  styleUrl: './registro-carga-inventarios.component.css',
})
export class RegistroCargaInventariosComponent {


  // ================================================================================
  // DECLARACION VARIABLES
  // ================================================================================
  mensajeCompleto: string = 'Error al cargar el archivo';
  tituloSwalCorrecto: string = 'CONFIRMACIÓN';
  selectedFileName: string = '';
  selectedFile: File | null = null;
  fileDetails: any = null;
  ultimoIdCargaRegistrado: any;
  cantidadDatosExcel: number = 0;
  detalle: detalleCarga[] = [];
  HayArchivo: boolean = false;
  usuarioLogueado: string = '';
  private empresasSubscription: Subscription | undefined;
  private UsuariosSubscription: Subscription | undefined;

  excelData: any[] = [];
  DatosEmpresas: Array<EmpresasModel> = [];
  getUsuarios_All: Array<SeguridadModel> = [];
  Cabecera: inventariosModel = new inventariosModel();
  formularioRegistro: FormGroup = new FormGroup({});
  @ViewChild('fileInput') fileInput: any;

  activarGuardar: boolean = false;
  activarButton: boolean = false;

  // ================================================================================
  // INYECCIÓN DE SERVICIOS
  // ================================================================================
  constructor(
    private readonly cargaExcelsService: CargaDatosService,
    private readonly _empresas: EmpresasService,
    private readonly _postCabecera: InventariosService,
    private readonly router: Router,
    private readonly _mapeo: MapeoCamposService,
    private alertService_CargaInventario: MensajesRegistroInventarioService
  ) {}

  private readonly listaUsuarios = inject(GetUsuariosUseCases);

  // ================================================================================
  // FUNCIÓN PRINCIPAL
  // ================================================================================
  ngOnInit(): void {
    this.listarUsuarios();
    this.listaEmpresas();
    this.validandoArchivoPreview();

    this.formularioRegistro = new FormGroup({
      rucempresa: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      usuarioasignado: new FormControl('', []),
    });

    this.formularioRegistro.patchValue({
      descripcion: this.Cabecera.descripcion || '',
    });

    this.formularioRegistro.patchValue({
      rucempresa: this.Cabecera.rucempresa || '',
    });

    this.formularioRegistro.patchValue({
      usuarioasignado: this.Cabecera.UsuarioAsignado || '',
    });
  }

  listarUsuarios(): void {
    try {
      this.UsuariosSubscription = this.listaUsuarios
        .ListarusUarios()
        .subscribe((Response: MensajeSeguridadModel) => {
          this.getUsuarios_All = Response.usuarios;
        });
    } catch (err) {}
  }

  // ================================================================================
  // GUARDAR CABECERA
  // ================================================================================
  guardarCabecera(): void {
    const usuario = this.formularioRegistro.value.usuarioasignado?.trim();
    if (usuario === '') {
      this.alertService_CargaInventario.confirmarSinUsuarioAsignado().then((result) => {
        if (result.isConfirmed) {
          this.validacionGuardarFinal();
        }
      });
    } else {
      this.validacionGuardarFinal();
    }
  }


  // ================================================================================
  // VALIDACIÓN PREVIEW
  // ================================================================================

  columnasEsperadas: Record<string, string> = {
    almacen: 'Almacén',
    sucursal: 'Sucursal',
    zona: 'Zona',
    pasillo: 'Pasillo',
    rack: 'Rack',
    ubicacion: 'Ubicación',
    esagrupado: 'Es Agrupado',
    codigogrupo: 'Código Grupo',
    codigoproducto: 'Código Producto',
    codigobarra: 'Código Barra',
    descripcionProducto: 'Descripción Producto',
    Unidad: 'Unidad',
    stockL: 'Stock Lógico',
  };
  columnasExcel: string[] = [];
  columnasMapeadas: Record<string, string> = {};

  confirmarSeleccion() {
    this.validacionGuardarFinal();
  }

  guardarColumnasMapeadas(mapeo: Record<string, string>) {
    this.columnasMapeadas = mapeo;
  }

  private readonly injector = Inject(Injector)
  private readonly appRef = inject(ApplicationRef)
  private readonly viewContainerRef= inject(ViewContainerRef)


  validacionGuardarFinal() {
    const idUsuario = sessionStorage.getItem('user');

    if (this.selectedFile) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(this.selectedFile);

        reader.onload = async () => {
            const data = new Uint8Array(reader.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: false });

            if (jsonData.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El archivo no contiene datos.',
                });
                return;
            }

            const columnasExcel = Object.keys(jsonData[0] || {});
            console.log("Columnas detectadas en el Excel:", columnasExcel);

            const columnasEsperadas = {
                codigobarra: 'Código Barra',
                codigoproducto: 'Código Producto',
                stockL: 'Stock Lógico',
                descripcionProducto: 'Descripción Producto',
                Unidad: 'Unidad',
                almacen: 'Almacén',
                sucursal: 'Sucursal',
                zona: 'Zona',
                pasillo: 'Pasillo',
                rack: 'Rack',
                ubicacion: 'Ubicación',
                codigogrupo: 'Código Grupo'
            };

            try {
              const reqMapeiById: MapeoObtenerMapeoById = { id: 1 };
              const response = await this._mapeo.getMapeoById(reqMapeiById).toPromise();

              if (!response || !response.mapeo) {
                  console.warn("El backend no devolvió un mapeo válido.");
              }

              // Aquí convertimos la cadena JSON en un objeto real
              const mapeoGuardado = response?.mapeo ? JSON.parse(response.mapeo) : {};

              const componentRef = this.viewContainerRef.createComponent(ColumnMatcherComponent);
              componentRef.instance.columnasEsperadas = columnasEsperadas;
              componentRef.instance.columnasExcel = columnasExcel;
              componentRef.instance.mapeoGuardado = mapeoGuardado; // Ahora sí es un objeto válido

              componentRef.instance.columnasMapeadas.subscribe((mapeo: Record<string, string> | null) => {
                  if (mapeo) {
                      Swal.close();
                      this.previewDatos(jsonData, mapeo, idUsuario);
                  } else {
                      Swal.close();
                  }
              });

              const componentElement = componentRef.location.nativeElement;

              Swal.fire({
                  html: '',
                  width: '40%',
                  showConfirmButton: false,
                  showCancelButton: false,
                  didOpen: () => {
                      Swal.getHtmlContainer()?.appendChild(componentElement);
                  },
              }).then(() => {
                  componentRef.destroy();
              });
          } catch (error) {
              console.error("Error al obtener el mapeo guardado", error);
          }

        };
    }
}


  procesarDatos(
    jsonData: any[],
    columnasMapeadas: Record<string, string>,
    idUsuario: string | null
  ) {
    const totalRegistros = jsonData.length;
    const loteSize = 250;
    let registrosProcesados = 0;

    Swal.fire({
      title: 'Guardando registros...',
      html: '<b>Iniciando carga de datos...</b>',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const procesarLote = (inicio: number) => {
      if (inicio >= totalRegistros) {
        Swal.close();
        this.mensajeCargaExcelCorrecta('Carga completada');
        return;
      }

      const fin = Math.min(inicio + loteSize, totalRegistros);
      const detalleData = jsonData.slice(inicio, fin).map((item: any) => {
        return Object.keys(columnasMapeadas).reduce((acc, key) => {
          let valor = item[columnasMapeadas[key]] || '';

          if (['stockL'].includes(key)) {
            valor =
              typeof valor === 'string' && valor.trim() === ''
                ? 0.0
                : parseFloat(valor) || 0.0;
          }

          acc[key] = valor;
          return acc;
        }, {} as Record<string, any>);
      });

      const nombreUsuario = idUsuario ?? 'Registro sistema';
      const cabecera = {
        ...this.Cabecera,
        usuariocreacion: nombreUsuario,
        usuariomodificacion: nombreUsuario,
        dependecarga: 0,
        totalregistros: totalRegistros,
        estado: '1',
        descripcion: this.formularioRegistro.value.descripcion.toUpperCase(),
        detalle: detalleData as detalleCarga[],
        usuarioAsignado: this.formularioRegistro.value.usuarioasignado,
        fechainicio: this.Cabecera.fechainicio || '',
      };

      this._postCabecera.newCabecera(cabecera).subscribe({
        next: (response) => {
          registrosProcesados += detalleData.length;
          Swal.update({
            html: `<b>Guardando registros ${registrosProcesados} de ${totalRegistros}</b>`,
          });
          console.log("Guardado: ", response);

          setTimeout(() => procesarLote(fin), 100);
        },
        error: (err) => {
          console.error('Error al registrar:', err);
          Swal.close();
          this.mensajeCargaExcelError(
            'Error al registrar la cabecera y detalle',
            err
          );
        },
      });
    };

    procesarLote(0);
  }



  // previewDatos(
  //   jsonData: any[],
  //   columnasMapeadas: Record<string, string>,
  //   idUsuario: string | null
  // ) {
  //   const columnasSeleccionadas = Object.keys(columnasMapeadas);

  //   const previewData = jsonData.slice(0, 5).map((item: any) => {
  //     return columnasSeleccionadas.reduce((acc, key) => {
  //       acc[key] = item[columnasMapeadas[key]] || '';
  //       return acc;
  //     }, {} as Record<string, any>);
  //   });

  //   const previewHtml = `<table style="width:100%; border-collapse: collapse; text-align:left;">
  //         <thead>
  //             <tr>${columnasSeleccionadas
  //               .map(
  //                 (key) =>
  //                   `<th style="border: 1px solid #ddd; padding: 8px; background: #f3f3f3;">${columnasMapeadas[key]}</th>`
  //               )
  //               .join('')}</tr>
  //         </thead>
  //         <tbody>
  //             ${previewData
  //               .map(
  //                 (row) =>
  //                   `<tr>${columnasSeleccionadas
  //                     .map(
  //                       (key) =>
  //                         `<td style="border: 1px solid #ddd; padding: 8px;">${row[key]}</td>`
  //                     )
  //                     .join('')}</tr>`
  //               )
  //               .join('')}
  //         </tbody>
  //     </table>`;

  //   Swal.fire({
  //     title: 'Vista previa reducida de los datos a guardar',
  //     html: previewHtml,
  //     width: '80%',
  //     showCancelButton: true,
  //     confirmButtonText: 'Guardar',
  //     cancelButtonText: 'Cancelar',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.guardarMapeo(idUsuario, columnasMapeadas, jsonData);
  //     }
  //   });
  // }

  previewDatos(
    jsonData: any[],
    columnasMapeadas: Record<string, string>,
    idUsuario: string | null
  ) {
    const columnasSeleccionadas = Object.keys(columnasMapeadas);

    // Detectar duplicados
    const vistos = new Set<string>();
    const duplicados: any[] = [];

    jsonData.forEach((row, index) => {
      const codigoBarra = row[columnasMapeadas['codigobarra']]?.trim();
      const codigoProducto = row[columnasMapeadas['codigoproducto']]?.trim();
      const clave = `${codigoBarra}-${codigoProducto}`;

      if (vistos.has(clave)) {
        duplicados.push({ fila: index + 2, codigoBarra, codigoProducto }); // index + 2 porque header es fila 1
      } else {
        vistos.add(clave);
      }
    });

    if (duplicados.length > 0) {
      const tablaDuplicados = `<table style="width:100%; border-collapse: collapse; text-align:left;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f3f3f3;">Fila</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f3f3f3;">Código Barra</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f3f3f3;">Código Producto</th>
          </tr>
        </thead>
        <tbody>
          ${duplicados.map(
            (dup) =>
              `<tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${dup.fila}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${dup.codigoBarra}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${dup.codigoProducto}</td>
              </tr>`
          ).join('')}
        </tbody>
      </table>`;

      Swal.fire({
        icon: 'error',
        title: 'Se encontraron códigos duplicados',
        html: `<p>Existen registros duplicados en tu archivo. Revisa los siguientes duplicados:</p>${tablaDuplicados}`,
        width: '70%',
      });
      return;
    }

    // Mostrar preview si no hay duplicados
    const previewData = jsonData.slice(0, 5).map((item: any) => {
      return columnasSeleccionadas.reduce((acc, key) => {
        acc[key] = item[columnasMapeadas[key]] || '';
        return acc;
      }, {} as Record<string, any>);
    });

    const previewHtml = `<table style="width:100%; border-collapse: collapse; text-align:left;">
      <thead>
        <tr>${columnasSeleccionadas
          .map(
            (key) =>
              `<th style="border: 1px solid #ddd; padding: 8px; background: #f3f3f3;">${columnasMapeadas[key]}</th>`
          )
          .join('')}</tr>
      </thead>
      <tbody>
        ${previewData
          .map(
            (row) =>
              `<tr>${columnasSeleccionadas
                .map(
                  (key) =>
                    `<td style="border: 1px solid #ddd; padding: 8px;">${row[key]}</td>`
                )
                .join('')}</tr>`
          )
          .join('')}
      </tbody>
    </table>`;

    Swal.fire({
      title: 'Vista previa reducida de los datos a guardar',
      html: previewHtml,
      width: '80%',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.guardarMapeo(idUsuario, columnasMapeadas, jsonData);
      }
    });
  }

  private readonly mapeoCamposService = inject(MapeoCamposService)

  guardarMapeo(idUsuario: string | null, columnasMapeadas: Record<string, string>, jsonData: any[]) {
    if (!idUsuario) {
      Swal.fire('Error', 'Usuario no identificado', 'error');
      return;
    }

    const nuevoMapeo: RequestInsertarMapeo = {
      usuarioId: parseInt(idUsuario, 10),
      nombreConfiguracion: sessionStorage.getItem('user') ?? 'system' ,
      mapeo: JSON.stringify(columnasMapeadas),
    };


    this.mapeoCamposService.newMapeo(nuevoMapeo).subscribe({
      next: (response) => {
        Swal.fire('Éxito', response.mensaje, 'success');
        this.procesarDatos(jsonData, columnasMapeadas, idUsuario);
      },
      error: (err) => {
        console.error('Error al guardar el mapeo:', err);
        Swal.fire('Error', 'No se pudo guardar el mapeo', 'error');
      }
    });
  }

  validarExistenciaDeMapeoGuardado(): void {
    const req: MapeoObtenerMapeoById = {id: 1}
    this.mapeoCamposService.UpdateMapeoById(req).subscribe({
      next: (response) => {

      },
      error: (err) => {
        console.error('Error al obtener el mapeo:', err);
        Swal.fire('Error', 'No se pudo obtener el mapeo', 'error');
      }
    })
  }

  validandoArchivoPreview() {
    if (this.selectedFileName != null && this.selectedFileName.trim() !== '') {
      this.HayArchivo = true;
    } else {
      this.HayArchivo = false;
    }
  }

  // ================================================================================
  // SELECIÓN ARCHIVOS
  // ================================================================================
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedExtensions = ['xlsx', 'xls'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo no permitido',
          text: 'Por favor, seleccione un archivo Excel (.xlsx o .xls).',
        });
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = this.selectedFile.name;
      this.fileDetails = {
        name: this.selectedFile.name,
        size: this.selectedFile.size,
        type: this.selectedFile.type,
        lastModified: this.selectedFile.lastModified,
      };

      this.HayArchivo = true;

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(reader.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawExcelData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });

        this.excelData = rawExcelData
          .slice(1)
          .map((row: any[]) => {
            const mappedRow = {
              almacen: row[0] || '',
              sucursal: row[1] || '',
              zona: row[2] || '',
              pasillo: row[3] || '',
              rack: row[4] || '',
              ubicacion: row[5] || '',
              esagrupado: row[6] || '',
              codigogrupo: row[7] || '',
              codigoproducto: row[8] || '',
              codigobarra: row[9] || '',
              descripcionproducto: row[10] || '',
              Unidad: row[11] || '',
              stockL: row[12] || 0,
              stockF: row[13] || 0,
              stockresultante: 0.0,
            };

            return Object.values(mappedRow).every((value) => !value)
              ? null
              : mappedRow;
          })
          .filter((row) => row !== null);

        this.cantidadDatosExcel = this.excelData.length;
      };
      reader.readAsArrayBuffer(this.selectedFile);
    }
  }

  // ================================================================================
  // CARGA ARCHIVO
  // ================================================================================
  uploadFile(rucEmpresa: string, idCarga: number): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(this.selectedFile);

      reader.onload = () => {
        const data = new Uint8Array(reader.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as detalleCarga[];

        // Guardar el detalle en `this.detalle`
        this.detalle = jsonData.map((item) => ({
          almacen: item.almacen || '',
          sucursal: item.sucursal || '',
          zona: item.zona || '',
          pasillo: item.pasillo || '',
          rack: item.rack || '',
          ubicacion: item.ubicacion || '',
          esagrupado: item.esagrupado || '',
          codigogrupo: item.codigogrupo || '',
          codigoproducto: item.codigoproducto || '',
          Codigobarra: item.Codigobarra || '',
          descripcionProducto: item.descripcionProducto || '',
          Unidad: item.Unidad || '',
          stockL: item.stockL || 0,
          stockF: item.stockF || 0,
          stockresultante: 0.0,
          esnuevo: 0,
          ajuste: 0.0,
          descripcionajuste: '',
          nroitem: 0
        }));
      };
    }
  }

  // ================================================================================
  // MENSAJE CORRECTO DE CARGA - SWEET ALERT
  // ================================================================================
  mensajeCargaExcelCorrecta(mensaje: any): void {
    this.mensajeCompleto = mensaje.count + ' ' + mensaje.message;

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'REGISTRO CORRECTO',
      showConfirmButton: true,
      // timer: 1500
    }).then(() => {
      window.location.reload();
    });
  }

  // ================================================================================
  // MENSAJE ERROR CARGA - SWEET ALERT
  // ================================================================================
  mensajeCargaExcelError(mensaje: string, error: any): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `${mensaje} ${error}`,
    });
  }

  // ================================================================================
  // LISTA EMPRESAS
  // ================================================================================
  listaEmpresas() {
    this.empresasSubscription = this._empresas
      .ListarEmpresas()
      .subscribe((response: MensajeResponseEmpresas) => {
        this.DatosEmpresas = response.empresas;
      });
  }

  // ================================================================================
  // MENSAJE REGISTRO CORRECTO - SWEET ALERT
  // ================================================================================
  mensajeValidacionRegistroCorrecto(response: any) {
    const message =
      response && response.msgerror
        ? response.msgerror
        : 'Inventario creado correctamente.';
    Swal.fire(`${this.tituloSwalCorrecto}`, message, 'success').then(() => {
      window.location.reload();
    });
  }

  // ================================================================================
  // MAPEO DE CELDAS
  // ================================================================================
  mapExcelRow(row: any[]): ExcelRow {
    return {
      almacen: row[0] || '',
      sucursal: row[1] || '',
      zona: row[2] || '',
      pasillo: row[3] || '',
      rack: row[4] || '',
      ubicacion: row[5] || '',
      esagrupado: row[6] || '',
      codigogrupo: row[7] || '',
      codigoproducto: row[8] || '',
      codigobarra: row[9] || '',
      descripcionproducto: row[10] || '',
      unidad: row[11] || '',
      stockL: row[12] || 0,
      stockF: row[13] || 0,
      stockresultante: row[14] || 0,
    };
  }

  // ================================================================================
  // LIMPIAR DATOS PREVIEW
  // ================================================================================
  limpiarDatosPreview(): void {
    window.location.reload();
  }

  // ================================================================================
  // DESTRUCCIÓN DE SUBSCRIPCIONES
  // ================================================================================
  ngOnDestroy(): void {
    this.empresasSubscription?.unsubscribe();
    this.UsuariosSubscription?.unsubscribe();
  }
}

// ================================================================================
// TIPADO DETALLES
// ================================================================================
interface FileDetails {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

// ================================================================================
// TIPADO CELDAS
// ================================================================================
interface ExcelRow {
  almacen: string;
  sucursal: string;
  zona: string;
  pasillo: string;
  rack: string;
  ubicacion: string;
  esagrupado: string;
  codigogrupo: string;
  codigoproducto: string;
  codigobarra: string;
  descripcionproducto: string;
  unidad: string;
  stockL: number;
  stockF: number;
  stockresultante: number;
}
