import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
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

}
