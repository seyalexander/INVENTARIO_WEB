import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-activaciones-page',
  standalone: true,
  imports: [],
  templateUrl: './lista-activaciones-page.component.html',
  styleUrl: './lista-activaciones-page.component.css',
})
export class ListaActivacionesPageComponent implements OnInit {
  notificacionesActivas = false;
  notificacionesDenegadas = false;

  ngOnInit(): void {
    this.verificarPermisoNotificaciones();
  }

  verificarPermisoNotificaciones(): void {
    if ('Notification' in window) {
      const permiso = Notification.permission;

      this.notificacionesActivas = permiso === 'granted';
      this.notificacionesDenegadas = permiso === 'denied';
    }
  }

  toggleNotificaciones(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.activarNotificaciones();
    } else {
      this.notificacionesActivas = false;
    }
  }

  activarNotificaciones(): void {
    if ('Notification' in window) {
      Notification.requestPermission().then((permiso) => {
        if (permiso === 'granted') {
          this.notificacionesActivas = false;
          this.notificacionesDenegadas = true;

          new Notification('Notificaciones habilitadas correctamente', {
            requireInteraction: true,
          });
        } else if (permiso === 'denied') {
          alert('Debes permitir notificaciones en el navegador.');
          this.notificacionesActivas = false;
          this.notificacionesDenegadas = true;
        }
      });
    }
  }
}
