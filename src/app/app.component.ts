import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { IStaticMethods } from 'preline';
import { InactividadService } from './Infraestructure/driven-adaptar-interactions/inactividad/inactividad.service';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'DB_INVENTORY_GESTOR';

  constructor(
    private readonly router: Router,
    private readonly inactividad: InactividadService
  ){}

  ngOnInit() {
    this.inactividad.startMonitoring(() => this.logout());
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
        }, 100);
      }
    });
  }

  logout() {
    sessionStorage.clear()
    this.router.navigate(['/login']);
  }
}
