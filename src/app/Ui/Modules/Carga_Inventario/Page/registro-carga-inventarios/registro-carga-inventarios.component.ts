import { CommonModule } from '@angular/common';
import {
  ApplicationRef,
  Component,
  ComponentRef,
  Inject,
  inject,
  Injector,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
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
import { ValidacionesRegistroInventarioService } from 'src/app/Infraestructure/core/Validaciones/cargaInventario/validaciones-registro-inventario.service';
import { ExcelRow } from 'src/app/Infraestructure/core/Interfaces/ExcelRow.model,';

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
    FormsModule,
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

  // ================================================================================
  // INYECCIÓN DE SERVICIOS
  // ================================================================================
  constructor(
    private readonly cargaExcelsService: CargaDatosService,
    private readonly _empresas: EmpresasService,
    private readonly _postCabecera: InventariosService,
    private readonly router: Router,
    private readonly _mapeo: MapeoCamposService,
    private alertService_CargaInventario: MensajesRegistroInventarioService,
    private validacionService_CargaInventario: ValidacionesRegistroInventarioService
  ) {}

  private readonly injector = Inject(Injector);
  private readonly appRef = inject(ApplicationRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly listaUsuarios = inject(GetUsuariosUseCases);
  private readonly mapeoCamposService = inject(MapeoCamposService);

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

  guardarCabecera(): void {
    const usuario = this.formularioRegistro.value.usuarioasignado?.trim();
    if (usuario === '') {
      this.alertService_CargaInventario
        .confirmarSinUsuarioAsignado()
        .then((result) => {
          if (result.isConfirmed) {
            this.validacionGuardarFinal();
          }
        });
    } else {
      this.validacionGuardarFinal();
    }
  }

  // ================================================================================
  // GUARDAR COLUMNAS MAPEADAS
  // ================================================================================
  guardarColumnasMapeadas(mapeo: Record<string, string>) {
    this.columnasMapeadas = mapeo;
  }

  // ================================================================================
  // VALIDACION GUARDADO FINAL
  // ================================================================================
  validacionGuardarFinal() {
    const idUsuario = sessionStorage.getItem('user');

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(this.selectedFile);

      reader.onload = async () => {
        const jsonData =
          this.validacionService_CargaInventario.procesarArchivoExcel(
            reader.result as ArrayBuffer
          );
        const columnasExcel =
          this.validacionService_CargaInventario.validarYExtraerColumnas(
            jsonData
          );
        if (!columnasExcel) return;
        const columnasEsperadas =
          this.validacionService_CargaInventario.getColumnasEsperadas();

        try {
          const reqMapeiById: MapeoObtenerMapeoById = { id: 1 };
          const response = await this._mapeo
            .getMapeoById(reqMapeiById)
            .toPromise();

          if (!this.validacionService_CargaInventario.validarMapeo(response)) {
            return;
          }

          const mapeoGuardado = response?.mapeo
            ? JSON.parse(response.mapeo)
            : {};

          const componentRef = this.viewContainerRef.createComponent(
            ColumnMatcherComponent
          );

          componentRef.instance.columnasEsperadas = columnasEsperadas;
          componentRef.instance.columnasExcel = columnasExcel;
          componentRef.instance.mapeoGuardado = mapeoGuardado;

          componentRef.instance.columnasMapeadas.subscribe(
            (mapeo: Record<string, string> | null) => {
              if (mapeo) {
                Swal.close();
                this.previewDatos(jsonData, mapeo, idUsuario);
              } else {
                Swal.close();
              }
            }
          );
          const componentElement = componentRef.location.nativeElement;
          this.alertService_CargaInventario.mostrarComponenteEnModal(
            componentElement,
            componentRef
          );
        } catch (error) {
          this.alertService_CargaInventario.Error_ObtenerMapeo(error);
        }
      };
    }
  }

  // ================================================================================
  // PROCESAR DATOS
  // ================================================================================
  procesarDatos(
    jsonData: any[],
    columnasMapeadas: Record<string, string>,
    idUsuario: string | null
  ) {
    const totalRegistros = jsonData.length;
    const loteSize = 250;
    let registrosProcesados = 0;

    this.alertService_CargaInventario.Save_GuardadoRegistros();

    const procesarLote = (inicio: number) => {
      if (inicio >= totalRegistros) {
        Swal.close();
        this.alertService_CargaInventario
          .Info_MensajeCargaCompleta()
          .then(() => {
            window.location.reload();
          });
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
          this.alertService_CargaInventario.Update_ProcesoGuardadoDatos(
            registrosProcesados,
            totalRegistros
          );
          setTimeout(() => procesarLote(fin), 100);
        },
        error: (err) => {
          Swal.close();
          this.alertService_CargaInventario.Error_mensajeCargaExcelError(err);
        },
      });
    };

    procesarLote(0);
  }

  previewDatos(
    jsonData: any[],
    columnasMapeadas: Record<string, string>,
    idUsuario: string | null
  ) {
    const columnasSeleccionadas = Object.keys(columnasMapeadas);

    const vistos = new Set<string>();
    const duplicados: any[] = [];

    jsonData.forEach((row, index) => {
      const codigoBarra = row[columnasMapeadas['codigobarra']]?.trim();
      const codigoProducto = row[columnasMapeadas['codigoproducto']]?.trim();
      const clave = `${codigoBarra}-${codigoProducto}`;

      if (vistos.has(clave)) {
        duplicados.push({ fila: index + 2, codigoBarra, codigoProducto });
      } else {
        vistos.add(clave);
      }
    });

    if (duplicados.length > 0) {
      const tablaDuplicados =
        this.validacionService_CargaInventario.generarTablaHTMLDuplicados(
          duplicados
        );
      this.alertService_CargaInventario.Alert_MensajeDuplicados(
        tablaDuplicados
      );
      return;
    }

    const previewData = jsonData.slice(0, 5).map((item: any) => {
      return columnasSeleccionadas.reduce((acc, key) => {
        acc[key] = item[columnasMapeadas[key]] || '';
        return acc;
      }, {} as Record<string, any>);
    });

    const previewHtml =
      this.validacionService_CargaInventario.generarTablaPreviewHtmlDatosCorrectos(
        columnasSeleccionadas,
        columnasMapeadas,
        previewData
      );

    this.alertService_CargaInventario
      .Info_VistaPreviaHtml_DatosGuardar(previewHtml)
      .then((result) => {
        if (result.isConfirmed) {
          this.guardarMapeo(idUsuario, columnasMapeadas, jsonData);
        }
      });
  }

  guardarMapeo(
    idUsuario: string | null,
    columnasMapeadas: Record<string, string>,
    jsonData: any[]
  ) {
    if (!idUsuario) {
      this.alertService_CargaInventario.Info_UsuarioNoIdentificado();
      return;
    }

    const nuevoMapeo: RequestInsertarMapeo = {
      usuarioId: parseInt(idUsuario, 10),
      nombreConfiguracion: sessionStorage.getItem('user') ?? 'system',
      mapeo: JSON.stringify(columnasMapeadas),
    };

    this.mapeoCamposService.newMapeo(nuevoMapeo).subscribe({
      next: (response) => {
        this.alertService_CargaInventario.Save_GuardadoMapeoColumnas(response);
        this.procesarDatos(jsonData, columnasMapeadas, idUsuario);
      },
      error: (err) => {
        this.alertService_CargaInventario.Error_GuardadoMapeoColumnas();
      },
    });
  }

  validarExistenciaDeMapeoGuardado(): void {
    const req: MapeoObtenerMapeoById = { id: 1 };
    this.mapeoCamposService.UpdateMapeoById(req).subscribe({
      next: (response) => {},
      error: (err) => {
        this.alertService_CargaInventario.info_ObtenerMapeoColumnas();
      },
    });
  }

  validandoArchivoPreview() {
    if (this.selectedFileName != null && this.selectedFileName.trim() !== '') {
      this.HayArchivo = true;
    } else {
      this.HayArchivo = false;
    }
  }

  // ================================================================================
  // SELECIÓN ARCHIVOS EN EL HTML
  // ================================================================================
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedExtensions = ['xlsx', 'xls'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        this.alertService_CargaInventario.Error_ArchivoIncorrecto();
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
