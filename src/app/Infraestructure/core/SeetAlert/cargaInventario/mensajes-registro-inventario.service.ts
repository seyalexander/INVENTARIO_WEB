import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MensajesRegistroInventarioService {
  confirmarSinUsuarioAsignado(): Promise<any> {
    return Swal.fire({
      title: `No se asignó un usuario al inventario`,
      text: '¿Estás seguro de registrar sin asignar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00D1AE',
      cancelButtonColor: '#888888',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
    });
  }

  validacionExcelVacio(): Promise<any> {
    return Swal.fire({
      icon: 'error',
      title: '<span style="font-size: 18px;">Error al procesar el archivo</span>',
      html: `
        <div style="font-size: 14px; color: #333;">
          <strong>El archivo cargado no contiene datos.</strong><br>
          Verifica que el documento no esté vacío o mal formateado antes de intentar nuevamente.
        </div>
      `,
      width: 500,
      background: '#fff',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Entendido',
      customClass: {
        popup: 'swal2-border-radius'
      }
    });
  }

  mostrarComponenteEnModal(
    componentElement: HTMLElement,
    componentRef: any
  ): void {
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
  }

  Error_ObtenerMapeo(Error: any): Promise<any> {
    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al obtener el mapeo guardado.',
    });
  }

  Error_MapeoDesdeAPI(): Promise<any> {
    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El backend no devolvió un mapeo válido.',
    });
  }

  Save_GuardadoRegistros() {
    Swal.fire({
      title: '<span style="font-size: 1.2rem; font-weight: 500; color: #2c3e50;">Guardando registros...</span>',
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; color: #555; font-size: 0.95rem; margin-top: 10px;">
          <b>Iniciando carga de datos...</b>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      background: '#ffffff',
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: 'swal2-popup-custom',
      }
    });
  }

  Error_mensajeCargaExcelError(error: any): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `Error al registrar la cabecera y detalle  ${error}`,
    });
  }

  Update_ProcesoGuardadoDatos(
    registrosProcesados: any,
    totalRegistros: any
  ): void {
    const porcentaje = Math.floor((registrosProcesados / totalRegistros) * 100);
    Swal.update({
      html: `
    <div style="font-family: 'Segoe UI', sans-serif; color: #2c3e50; text-align: center;">
      <h3 style="margin: 0 0 10px; font-weight: 500; font-size: 1.25rem;">
        Procesando registros
      </h3>
      <p style="margin: 0 0 15px; font-size: 0.95rem; color: #555;">
        ${registrosProcesados} de ${totalRegistros} registros procesados
      </p>
      <div style="
        height: 10px;
        background-color: #ecf0f1;
        border-radius: 5px;
        overflow: hidden;
        margin: 0 auto;
        width: 80%;
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
      ">
        <div style="
          width: ${porcentaje}%;
          background: linear-gradient(to right, #4facfe, #00f2fe);
          height: 100%;
          transition: width 0.4s ease;
        "></div>
      </div>
      <p style="margin-top: 12px; font-size: 0.9rem; color: #888;">
        ${porcentaje}% completado
      </p>
    </div>
  `
    });
  }

  Alert_MensajeDuplicados(tablaDuplicados: any) {
    Swal.fire({
      icon: 'error',
      title: '¡Se encontraron códigos duplicados!',
      html: `
        <p style="font-size: 16px; font-weight: 600;">Se han detectado duplicados en los siguientes registros. Por favor, revisa la tabla y toma las acciones correspondientes.</p>
        <div style="border: 1px solid #ccc; border-radius: 6px; padding: 12px; background-color: #f9f9f9; max-height: 400px; overflow-y: auto;">
          ${tablaDuplicados}
        </div>
      `,
      width: '70%',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
      },
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#d33',
      showCancelButton: false,
      buttonsStyling: false,
    });
  }

  Info_VistaPreviaHtml_DatosGuardar(previewHtml: any): Promise<any> {
    return Swal.fire({
      title: 'Vista previa reducida de los datos a guardar',
      html: previewHtml,
      width: '80%',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
    });
  }

  Info_UsuarioNoIdentificado() {
    Swal.fire('Error', 'Usuario no identificado', 'error');
  }

  Save_GuardadoMapeoColumnas(response: any) {
    Swal.fire('Éxito', response.mensaje, 'success');
  }

  Error_GuardadoMapeoColumnas() {
    Swal.fire('Error', 'No se pudo guardar el mapeo', 'error');
  }

  info_ObtenerMapeoColumnas() {
    Swal.fire('Error', 'No se pudo obtener el mapeo', 'error');
  }

  Error_ArchivoIncorrecto() {
    Swal.fire({
      icon: 'error',
      title: 'Archivo no permitido',
      text: 'Por favor, seleccione un archivo Excel (.xlsx o .xls).',
    });
  }

  Info_MensajeCargaCompleta(): Promise<any> {
    return Swal.fire({
      title:
        '<strong style="font-size: 1.8rem; color: #28a745;">✔ REGISTRO CORRECTO</strong>',
      html: '<p style="font-size: 1.1rem; margin-top: 10px;">Los datos se registraron exitosamente.</p>',
      icon: 'success',
      iconColor: '#28a745',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#28a745',
      backdrop: true,
      position: 'center',
      width: '500px',
      padding: '1.5rem',
      customClass: {
        popup: 'swal2-rounded swal2-shadow',
      },
    });
  }
}
