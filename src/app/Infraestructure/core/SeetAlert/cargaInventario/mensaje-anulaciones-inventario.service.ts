import { Injectable } from '@angular/core';
import { inventariosModel } from 'src/app/Domain/models/inventarios/inventarios.models';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MensajeAnulacionesInventarioService {

  Alert_AnularInventario(response: inventariosModel): Promise<boolean> {
    return new Promise((resolve) => {
      let countdown = 3;

      Swal.fire({
        title: `
          <div class="text-red-600 text-2xl font-bold flex items-center justify-center">
            <span>Anular Inventario</span>
          </div>`,
        html: `
          <div class="border-b border-gray-300 pb-4">
            <p class="text-gray-700 text-lg text-center">
              ¿Seguro que deseas anular <span class="font-bold text-red-500">${response.descripcion}</span>?
            </p>
          </div>

          <div class="mt-4 text-left space-y-3">
            <p class="text-gray-600 text-sm text-center">Esta acción no se puede deshacer.</p>
            <p class="text-gray-600 text-sm text-center">Asegúrate de revisar antes de continuar.</p>
          </div>

          <div id="swal-buttons" class="flex justify-center gap-4 mt-5">
            <button id="cancel-btn" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded w-36">
              Cancelar
            </button>

            <button id="confirm-btn" style="
              background-color: #DC2626;
              color: white;
              font-weight: 600;
              padding: 0.5rem 1rem;
              border-radius: 0.375rem;
              width: 9rem;
          " disabled>
            Sí, Anular (${countdown})
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

          cancelBtn.onclick = () => {
            Swal.close();
            resolve(false); // Cancelado
          };

          const interval = setInterval(() => {
            countdown--;
            confirmBtn.textContent = `Sí, Anular (${countdown})`;

            if (countdown === 0) {
              clearInterval(interval);
              confirmBtn.textContent = 'Sí, Anular';
              confirmBtn.disabled = false;
              confirmBtn.classList.add('hover:bg-red-700');
            }
          }, 1000);

          confirmBtn.onclick = () => {
            Swal.close();
            resolve(true); // Confirmado
          };
        },
      });
    });
  }

  Alert_InventarioAnulado_Correctamente(): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: `
        <div class="text-green-600 text-2xl font-bold flex items-center justify-center">
          ¡Inventario Anulado!
        </div>
      `,
      html: `
        <div class="mt-2 text-center">
          <p class="text-gray-700 text-lg font-medium leading-relaxed">
            El inventario fue anulado correctamente.
          </p>
          <p class="text-gray-500 text-sm mt-2">
            Redirigiendo automáticamente...
          </p>
        </div>
      `,
      background: '#ffffff',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'text-green-600 font-bold text-xl',
      },
      showConfirmButton: false,
      timer: 2500,
      didClose: () => {
        window.location.reload();
      },
    });
  }

  Alert_InventarioAnulado_Error() {
    Swal.fire({
      icon: 'error',
      title: `
        <div class="text-red-600 text-2xl font-bold flex items-center justify-center">
          Error al Anular
        </div>
      `,
      html: `
        <div class="mt-2 text-center">
          <p class="text-gray-700 text-lg font-medium leading-relaxed">
            No se pudo anular el inventario.
          </p>
          <p class="text-gray-500 text-sm mt-2">
            Por favor, inténtalo nuevamente más tarde.
          </p>
        </div>
      `,
      background: '#ffffff',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'text-red-600 font-bold text-xl',
      },
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#e53e3e', // rojo fuerte
      buttonsStyling: true,
    });
  }
}
