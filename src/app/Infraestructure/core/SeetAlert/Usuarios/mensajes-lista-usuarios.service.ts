import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MensajesListaUsuariosService {

  constructor() { }

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
          popup: 'animate__animated animate__zoomIn'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOut'
        }
      }).then(() => {
        // Si es necesario recargar, descomenta la línea siguiente:
        // window.location.reload();
      });
    }
}
