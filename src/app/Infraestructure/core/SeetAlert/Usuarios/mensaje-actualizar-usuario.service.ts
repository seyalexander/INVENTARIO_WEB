import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MensajeActualizarUsuarioService {
  mensajeErrorActualizar(descripcion: string) {
    Swal.fire({
      icon: 'error',
      title: `${descripcion}`,
      html: `
    <p style="font-size:16px; margin:10px 0;">
      Ocurrió un problema al intentar guardar los cambios.
    </p>
    <p style="font-size:14px; color:gray;">
      Por favor, verifica la información ingresada o intenta nuevamente.
    </p>
  `,
      confirmButtonText: 'Aceptar',
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
}
