import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MensajeGenerarReportePdfService {
  constructor() {}

  Alert_GenerandoReporte_PDF(): Promise<any> {
    return Swal.fire({
      width: '30rem',
      html: `
           <!-- Uploading File Content -->
                      <div class="mb-2 flex justify-between items-center">
                        <div class="flex items-center gap-x-3">
                          <span
                            class="size-8 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg"
                          >
                            <svg
                              class="shrink-0 size-5"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M15.0243 1.43996H7.08805C6.82501 1.43996 6.57277 1.54445 6.38677 1.73043C6.20077 1.91642 6.09631 2.16868 6.09631 2.43171V6.64796L15.0243 11.856L19.4883 13.7398L23.9523 11.856V6.64796L15.0243 1.43996Z"
                                fill="#D32F2F"
                              />
                              <path d="M6.09631 6.64796H15.0243V11.856H6.09631V6.64796Z" fill="#C62828" />
                              <path
                                d="M22.9605 1.43996H15.0243V6.64796H23.9523V2.43171C23.9523 2.16868 23.8478 1.91642 23.6618 1.73043C23.4758 1.54445 23.2235 1.43996 22.9605 1.43996Z"
                                fill="#E53935"
                              />
                              <path
                                d="M15.0243 11.856H6.09631V21.2802C6.09631 21.5433 6.20077 21.7955 6.38677 21.9815C6.57277 22.1675 6.82501 22.272 7.08805 22.272H22.9606C23.2236 22.272 23.4759 22.1675 23.6618 21.9815C23.8478 21.7955 23.9523 21.5433 23.9523 21.2802V17.064L15.0243 11.856Z"
                                fill="#B71C1C"
                              />
                              <path d="M15.0243 11.856H23.9523V17.064H15.0243V11.856Z" fill="#C62828" />
                              <path
                                d="M1.13604 5.90396H11.0566C11.3195 5.90396 11.5718 6.00842 11.7578 6.19442C11.9438 6.38042 12.0483 6.63266 12.0483 6.8957V16.8162C12.0483 17.0793 11.9438 17.3315 11.7578 17.5175C11.5718 17.7035 11.3195 17.808 11.0566 17.808H1.13604C0.873012 17.808 0.620754 17.7035 0.434765 17.5175C0.248775 17.3315 0.144287 17.0793 0.144287 16.8162V6.8957C0.144287 6.63266 0.248775 6.38042 0.434765 6.19442C0.620754 6.00842 0.873012 5.90396 1.13604 5.90396Z"
                                fill="#C62828"
                              />
                              <text
                                x="3"
                                y="15"
                                fill="white"
                                font-size="8"
                                font-family="Arial, sans-serif"
                                font-weight="bold"
                              >
                                PDF
                              </text>
                            </svg>

                          </span>
                          <div>
                            <p class="text-sm ext-left font-medium text-gray-800">
                              Espere un momento por favor
                            </p>
                            <p class="text-xs text-left text-gray-500">Descargando archivo</p>
                          </div>
                        </div>
                        <div class="inline-flex items-center gap-x-2">
                          <div class="flex items-center justify-center min-h-scree">
                          <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        </div>
                      </div>
                      <!-- End Uploading File Content -->
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

  cerrarAlerta(): void {
    Swal.close();
  }
}
