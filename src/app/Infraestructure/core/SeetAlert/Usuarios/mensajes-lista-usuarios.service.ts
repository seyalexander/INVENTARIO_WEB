import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MensajesListaUsuariosService {

  mensajeCopiCorrecto(): Promise<any> {
    return Swal.fire({
      title: '<strong>🎫 ID CARD</strong>',
      html: `
          <div style="font-size: 15px; color: #444;">
            <p>Los datos fueron <strong>copiados</strong> al portapapeles correctamente.</p>
          </div>
        `,
      icon: 'success',
      showConfirmButton: true,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#217346',
      background: '#ffffff',
      color: '#333333',
      timer: 3000,
      timerProgressBar: true,
      backdrop: `
          rgba(0,0,0,0.3)
          left top
          no-repeat
        `,
      showClass: {
        popup: 'animate__animated animate__zoomIn',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOut',
      },
    }).then(() => {
      // Si es necesario recargar, descomenta la línea siguiente:
      // window.location.reload();
    });
  }

  mostrarMensajeError(): void {
    Swal.fire({
      icon: 'error',
      title: '¡Algo salió mal!',
      html: `
    <p style="font-size:16px; margin:10px 0;">
      Ocurrió un <strong>error inesperado</strong> al intentar listar a los usuarios.
    </p>
    <p style="font-size:14px; color:gray;">
      Por favor, verifica tu conexión o intenta nuevamente más tarde.
    </p>
  `,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#d33',
      background: '#fff',
      iconColor: '#d33',
      customClass: {
        popup: 'swal2-rounded',
        title: 'swal2-title-custom',
        confirmButton: 'swal2-confirm-custom',
      },
    });
  }

  MensajeDatosNoValidos() {
    Swal.fire({
      icon: 'error',
      title: '¡Algo salió mal!',
      html: `
    <p style="font-size:16px; margin:10px 0;">
      Datos <strong>NO</strong> válidos.
    </p>
    <p style="font-size:14px; color:gray;">
      Vuelva a recargar la página, en caso de seguir igual llame a su soporte técnico.
    </p>
  `,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#d33',
      background: '#fff',
      iconColor: '#d33',
      customClass: {
        popup: 'swal2-rounded',
        title: 'swal2-title-custom',
        confirmButton: 'swal2-confirm-custom',
      },
    });
  }

  MensajeRespuestaApiFalse() {
    Swal.fire({
      icon: 'error',
      title: '¡Algo salió mal!',
      html: `
    <p style="font-size:16px; margin:10px 0;">
      Error al <strong>obtener</strong> datos.
    </p>
    <p style="font-size:14px; color:gray;">
      No se pudo obtener los datos desde el api, recargue la pagina.
    </p>
  `,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#d33',
      background: '#fff',
      iconColor: '#d33',
      customClass: {
        popup: 'swal2-rounded',
        title: 'swal2-title-custom',
        confirmButton: 'swal2-confirm-custom',
      },
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
      })
    }
}
