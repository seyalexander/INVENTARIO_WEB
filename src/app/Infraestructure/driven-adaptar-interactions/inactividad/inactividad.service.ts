import { Injectable, NgZone } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class InactividadService {
  private timeoutId: any;
  private warningTimeoutId: any;
  private idleTime = 10 * 60 * 1000; // 10 minutos
  private warningTime = 30 * 1000; // 30 segundos para responder

  constructor(private ngZone: NgZone) {}

  startMonitoring(logoutCallback: () => void) {
    this.resetTimer(logoutCallback);

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach((event) =>
      window.addEventListener(event, () => this.resetTimer(logoutCallback))
    );
  }

  private resetTimer(logoutCallback: () => void) {
    clearTimeout(this.timeoutId);
    clearTimeout(this.warningTimeoutId);

    this.timeoutId = setTimeout(() => {
      this.showWarning(logoutCallback);
    }, this.idleTime);
  }

  private showWarning(logoutCallback: () => void) {
    this.ngZone.run(() => {
      const warningSeconds = this.warningTime / 1000;
      let timeLeft = warningSeconds;

      Swal.fire({
        title: '¿Sigues ahí?',
        html: `
        <div style="margin-top: 10px;">
          <div id="countdown-circle" style="position: relative; width: 100px; height: 100px; margin: 0 auto;">
            <svg width="100" height="100">
              <circle cx="50" cy="50" r="45" stroke="#eee" stroke-width="10" fill="none" />
              <circle id="progress-circle" cx="50" cy="50" r="45" stroke="#f39c12" stroke-width="10" fill="none"
                stroke-dasharray="283"
                stroke-dashoffset="0"
                transform="rotate(-90 50 50)" />
            </svg>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);font-size:18px;">
              <span id="countdown-text">${timeLeft}</span>s
            </div>
          </div>
          <p style="margin-top: 10px;">Tu sesión se cerrará pronto por inactividad.</p>
        </div>
      `,
        showCancelButton: true,
        confirmButtonText: 'Sí, sigo aquí',
        cancelButtonText: 'Cerrar sesión',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: true,
        timer: this.warningTime,
        timerProgressBar: false,
        didOpen: () => {
          const circle = document.getElementById(
            'progress-circle'
          ) as unknown as SVGCircleElement;
          const text = document.getElementById('countdown-text') as HTMLElement;
          const totalDash = 283;

          const interval = setInterval(() => {
            timeLeft--;
            const dashOffset =
              ((warningSeconds - timeLeft) / warningSeconds) * totalDash;

            if (circle) circle.style.strokeDashoffset = dashOffset.toString();
            if (text) text.innerText = `${timeLeft}`;

            if (timeLeft <= 0) {
              clearInterval(interval);
            }
          }, 1000);
        },
      }).then((result) => {
        clearTimeout(this.warningTimeoutId);

        if (result.isConfirmed) {
          this.resetTimer(logoutCallback);
        } else {
          logoutCallback();
        }
      });

      // Fallback por si no responde en el tiempo
      this.warningTimeoutId = setTimeout(() => {
        Swal.close();
        logoutCallback();
      }, this.warningTime);
    });
  }
}
