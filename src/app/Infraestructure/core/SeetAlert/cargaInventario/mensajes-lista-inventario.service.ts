import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MensajesListaInventarioService {
  constructor() {}

  mostrarMensajeError(titulo: string, mensaje: string): void {
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje,
    });
  }

  Error_ConexionApi(titulo: string): void {
    Swal.fire({
      icon: 'error',
      title: titulo,
      html: `
      <p style="font-size: 14px; margin-bottom: 10px;">
        No se pudo conectar con el servidor.
      </p>
      <p style="font-size: 13px; color: #555;">
        Verifique su conexión a internet o comuníquese con el administrador del sistema.
      </p>
    `,
      footer:
        '<small style="color: #888;">Intente recargar el listado después de verificar la conexión.</small>',
      confirmButtonText: 'Reintentar',
      confirmButtonColor: '#d33',
      backdrop: `rgba(0,0,0,0.4)`,
      allowOutsideClick: false,
      allowEscapeKey: true,
    });
  }
}
