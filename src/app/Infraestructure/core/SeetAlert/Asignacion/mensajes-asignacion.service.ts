import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MensajesAsignacionService {

  mensajeValidacionRegistroCorrecto(response: any) {
    const message = response?.message || 'Inventario reasignado correctamente.';

    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      html: `
          <div class="text-center">
            <p class="text-base text-gray-700 font-medium leading-relaxed">
              ${message}
            </p>
            <p class="text-sm text-gray-500 mt-3">
              Redirigiendo automáticamente...
            </p>
          </div>
        `,
      background: '#ffffff',
      customClass: {
        popup: 'swal-custom-popup rounded-xl shadow-lg',
        title: 'text-green-600 font-bold text-2xl mt-1 mb-2',
      },
      showConfirmButton: false,
      timer: 2500,
      didClose: () => {
        window.location.reload();
      },
    });
  }

  Alert_AsignarUsuario(
    descripcion: string,
    asignado: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      let countdown = 3;

      Swal.fire({
        title: `
          <div class="text-blue-600 text-2xl font-bold flex items-center justify-center">
            <span>Reasignar Usuario</span>
          </div>
        `,
        html: `
          <div class="border-b border-gray-300 pb-4">
            <p class="text-gray-700 text-lg text-center">
              ¿Seguro que deseas reasignar el inventario
              <span class="font-bold text-blue-500">${descripcion}</span>
              al usuario
              <span class="font-bold text-blue-500">${asignado}</span>?
            </p>
          </div>

          <div class="mt-2 text-center space-y-3">
            <p class="text-gray-600 text-sm">Esta acción actualizará la asignación del usuario.</p>
          </div>

          <div id="swal-buttons" class="flex justify-center gap-4 mt-5">
            <button id="cancel-btn" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded w-36">
              Cancelar
            </button>
            <button id="confirm-btn" class="bg-blue-600 text-white font-semibold px-4 py-2 rounded w-36" disabled>
              Reasignar (3)
            </button>
          </div>
        `,
        icon: 'warning',
        showConfirmButton: false,
        showCancelButton: false,
        didOpen: () => {
          const cancelBtn = document.getElementById(
            'cancel-btn'
          ) as HTMLButtonElement;
          const confirmBtn = document.getElementById(
            'confirm-btn'
          ) as HTMLButtonElement;

          if (cancelBtn) {
            cancelBtn.onclick = () => {
              Swal.close();
              resolve(false); // Usuario canceló
            };
          }

          const interval = setInterval(() => {
            countdown--;
            confirmBtn.textContent = `Reasignar (${countdown})`;

            if (countdown === 0) {
              clearInterval(interval);
              confirmBtn.textContent = 'Reasignar';
              confirmBtn.disabled = false;
              confirmBtn.classList.add('hover:bg-blue-700');
            }
          }, 1000);

          if (confirmBtn) {
            confirmBtn.onclick = () => {
              Swal.close();
              resolve(true); // Usuario confirmó
            };
          }
        },
      });
    });
  }

  mensajeValidacionRegistroIncorrecto(response: any) {
    const message = response ? response.msgerror : 'Error al asignar';
    Swal.fire(response, message, 'error').then(() => {
      window.location.reload();
    });
  }
}
