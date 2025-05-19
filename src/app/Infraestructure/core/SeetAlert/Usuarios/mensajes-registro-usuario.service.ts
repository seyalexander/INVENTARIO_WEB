import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MensajesRegistroUsuarioService {
  mensajeRegistroEmpresa(error: any): void {
    Swal.fire({
      icon: 'error',
      title: '¡Error al registrar usuario!',
      html: `
        <p style="margin-bottom: 0.5rem;">Ocurrió un problema durante el registro.</p>
        <small style="color: #b71c1c;">${error}</small>
      `,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#d33',
      background: '#fff',
      color: '#333',
      iconColor: '#d33',
    });
  }

  mensajeValidacionRegistroCorrecto(response: any) {
    const message = response.message || 'Usuario registrado correctamente';

    Swal.fire({
      title: '🎉 ¡Registro exitoso!',
      html: `<p style="font-size: 1rem; margin-top: 0.5rem;">${message}</p>`,
      icon: 'success',
      iconColor: '#2e7d32',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#2e7d32',
      background: '#ffffff',
      color: '#333333',
    }).then(() => {
      window.location.reload();
    });
  }
}
