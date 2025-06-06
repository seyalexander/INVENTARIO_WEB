import { inject, Injectable } from '@angular/core';
import { MensajesRegistroInventarioService } from '../../SeetAlert/cargaInventario/mensajes-registro-inventario.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { NotificacionesPlusService } from 'src/app/Infraestructure/driven-adaptar-interactions/notificaciones/notificaciones-plus.service';

@Injectable({
  providedIn: 'root',
})
export class ValidacionesRegistroInventarioService {
  constructor(
    private alertService_CargaInventario: MensajesRegistroInventarioService
  ) {}

  private readonly notify = inject(NotificacionesPlusService);

  /**
   * Procesa un archivo Excel (en formato ArrayBuffer) y lo convierte a un array de objetos JSON.
   * Extrae la primera hoja del archivo y convierte su contenido en un array de objetos,
   * donde cada objeto representa una fila de datos del archivo Excel.
   *
   * @param buffer - El archivo Excel en formato ArrayBuffer.
   * @returns Un array de objetos representando los datos del archivo Excel.
   */
  procesarArchivoExcel(buffer: ArrayBuffer): any[] {
    const data = new Uint8Array(buffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(worksheet, { raw: false });
  }

  /**
   * Valida si el JSON extraído desde el archivo Excel contiene datos.
   * Si el archivo está vacío, muestra una alerta y retorna null.
   * En caso contrario, retorna las claves (columnas) del primer objeto como array de strings.
   *
   * @param jsonData - Datos convertidos desde el Excel.
   * @returns Array de nombres de columnas o null si el archivo está vacío.
   */
  validarYExtraerColumnas(jsonData: any[]): string[] | null {
    if (jsonData.length === 0) {
      this.alertService_CargaInventario.validacionExcelVacio();
      return null;
    }
    return Object.keys(jsonData[0] || {});
  }

  /**
   * Retorna un objeto que mapea las claves de las columnas esperadas en el archivo Excel
   * con su descripción correspondiente. Este objeto se utiliza para verificar que las
   * columnas del archivo Excel coincidan con las esperadas.
   *
   * @returns Un objeto `Record<string, string>` con las columnas esperadas y sus descripciones.
   */
  getColumnasEsperadas(): Record<string, string> {
    return {
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
      codigogrupo: 'Código Grupo',
    };
  }

  /**
   * Valida que la respuesta del API contenga un mapeo válido.
   * Si no se encuentra el mapeo en la respuesta, muestra un mensaje de error utilizando el servicio `alertService_CargaInventario`.
   *
   * @param response - La respuesta del API que debe contener un campo `mapeo`.
   * @returns `true` si el mapeo está presente, de lo contrario muestra un error y retorna `false`.
   */
  validarMapeo(response: any): boolean {
    if (!response || !response.mapeo) {
      this.alertService_CargaInventario.Error_MapeoDesdeAPI();
      return false;
    }
    return true;
  }

  /**
   * Genera una tabla HTML con estilo que muestra una lista de registros duplicados.
   *
   * @param duplicados - Un arreglo de objetos que contienen los datos duplicados.
   * Cada objeto debe tener las propiedades: fila, codigoBarra y codigoProducto.
   * @returns Una cadena de texto con el HTML de la tabla generada.
   */
  generarTablaHTMLDuplicados(duplicados: any[]): string {
    return `
      <div style="border: 1px solid #ccc; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); font-family: 'Segoe UI', sans-serif; overflow: hidden;">
        <!-- Tabla estilo Excel -->
        <div class="scrollable" style="overflow-x: auto; max-height: 300px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background-color: #217346;">
                <th style="border: 1px solid #c4c4c4; padding: 8px; text-align: left;">Fila</th>
                <th style="border: 1px solid #c4c4c4; padding: 8px; text-align: left;">Código Barra</th>
                <th style="border: 1px solid #c4c4c4; padding: 8px; text-align: left;">Código Producto</th>
              </tr>
            </thead>
            <tbody>
              ${duplicados
                .map(
                  (dup) => `
                <tr style="background-color: #ffffff;">
                  <td style="border: 1px solid #c4c4c4; padding: 8px;">${dup.fila}</td>
                  <td style="border: 1px solid #c4c4c4; padding: 8px;">${dup.codigoBarra}</td>
                  <td style="border: 1px solid #c4c4c4; padding: 8px;">${dup.codigoProducto}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>

        <div style="background-color: #f1f1f1; padding: 8px; text-align: right;">
          <strong>Total de duplicados: ${duplicados.length}</strong>
        </div>
      </div>`;
  }

  /**
   * Genera el HTML de una tabla con los datos y el mapeo de columnas.
   * @param columnasSeleccionadas - Columnas seleccionadas por el usuario.
   * @param columnasMapeadas - Relación entre nombres esperados y columnas reales.
   * @param previewData - Datos para mostrar en la tabla (solo 5 registros, por ejemplo).
   * @returns string - HTML con diseño de tabla.
   */
  generarTablaPreviewHtmlDatosCorrectos(
    columnasSeleccionadas: string[],
    columnasMapeadas: Record<string, string>,
    previewData: Record<string, any>[]
  ): string {
    return `
      <div style="overflow-x: auto; max-height: 300px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
        <table style="width: 100%; border-collapse: collapse; font-family: 'Segoe UI', sans-serif; font-size: 14px;">
          <thead>
            <tr>
              ${columnasSeleccionadas
                .map(
                  (key) => `
                <th style="padding: 10px; background-color: #f8f9fa; color: #333; font-weight: 600; border-bottom: 2px solid #dee2e6; text-align: left;">
                  ${columnasMapeadas[key]}
                </th>`
                )
                .join('')}
            </tr>
          </thead>
          <tbody>
            ${previewData
              .map(
                (row) => `
              <tr>
                ${columnasSeleccionadas
                  .map(
                    (key) => `
                  <td style="padding: 8px 10px; border-bottom: 1px solid #eee; color: #444;">
                    ${row[key]}
                  </td>`
                  )
                  .join('')}
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>`;
  }

  /**
   * Valida si el índice de inicio ha superado el total de registros y muestra una alerta de finalización.
   * Si se completó la carga, cierra el modal de espera, muestra una alerta informativa y recarga la página.
   *
   * @param totalRegistros - Número total de registros esperados.
   * @param inicio - Índice actual de registros procesados.
   * @returns boolean - `true` si ya no hay más registros por procesar, `false` en caso contrario.
   */
  validarTieneRegistros(totalRegistros: any, inicio: number): boolean {
    if (inicio >= totalRegistros) {
      Swal.close();
      if (document.visibilityState !== 'visible') {
        this.notificacionInventarioNuevo();
      }

      this.alertService_CargaInventario.Info_MensajeCargaCompleta().then(() => {
        window.location.reload();
      });

      return true;
    }
    return false;
  }

  notificacionInventarioNuevo() {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(
        'Nuevo inventario listo para trabajar!',
        {
          body: 'Haz clic para revisarlo',
        }
      );

      notification.onclick = () => {
        window.focus();
        window.location.href = 'http://localhost:4200/#/dashboard';
      };
    }
  }

  /**
   * Extrae un lote de datos transformados desde el JSON original, aplicando el mapeo de columnas.
   *
   * @param jsonData - Datos originales del archivo cargado.
   * @param columnasMapeadas - Objeto que relaciona las claves internas con los nombres de columna del Excel.
   * @param inicio - Índice de inicio del lote actual.
   * @param loteSize - Cantidad de registros a tomar por lote.
   * @param totalRegistros - Total de registros en el archivo.
   * @returns Arreglo de objetos transformados según el mapeo de columnas.
   */
  obtenerLoteTransformado(
    jsonData: any[],
    columnasMapeadas: Record<string, string>,
    inicio: number,
    loteSize: number,
    totalRegistros: number
  ): Record<string, any>[] {
    const fin = Math.min(inicio + loteSize, totalRegistros);
    return jsonData.slice(inicio, fin).map((item: any) => {
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
  }

  /**
   * Valida si existen registros duplicados y muestra una alerta con una tabla de los mismos si es necesario.
   *
   * @param duplicados - Arreglo de objetos duplicados.
   * @param generarTabla - Función que genera el HTML de la tabla con los duplicados.
   * @param alertService - Servicio que muestra la alerta con los duplicados.
   * @returns true si hay duplicados, false en caso contrario.
   */
  validarExisteDuplicados(
    duplicados: any[],
    generarTabla: (data: any[]) => string,
    alertService: any
  ): boolean {
    if (duplicados.length > 0) {
      const tablaDuplicados = generarTabla(duplicados);
      alertService.Alert_MensajeDuplicados(tablaDuplicados);
      return true;
    }
    return false;
  }
}
