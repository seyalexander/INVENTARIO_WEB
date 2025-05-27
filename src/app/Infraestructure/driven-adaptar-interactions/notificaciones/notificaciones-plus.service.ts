import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesPlusService {

  constructor() { }

  notify(title: string, options?: NotificationOptions): void {
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones.');
      return;
    }

    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, options);
      }
    });
  }

}
