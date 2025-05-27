import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-opciones',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu-opciones.component.html',
  styleUrls: ['./menu-opciones.component.css'],
})
export class MenuOpcionesGeneralComponent implements OnInit {
  mainMenu: {
    defaultOptions: any[];
    accessLink: any[];
  } = {
    defaultOptions: [],
    accessLink: [],
  };

  ngOnInit(): void {
    this.rutasDashboard();
  }

  private readonly router = inject(Router)

  rutasDashboard() {
    this.mainMenu.accessLink = [
      {
        name: 'Cargar Inventario',
        icon: 'uil uil-cloud-upload',
        route: ['/dashboard'],
        subMenu: false,
      },
      // {
      //   name: 'Asignar',
      //   icon: 'uil uil-estate',
      //   route: ['/dashboard', 'modulos', 'asignaciones'],
      //   subMenu: false,
      // },
      {
        name: 'Reportes',
        icon: 'uil uil-chart-line',
        route: ['/dashboard', 'reportes'],
        subMenu: false,
      },
      {
        name: 'Ajustes Inventario',
        icon: 'uil uil-sliders-v-alt',
        route: ['/dashboard', 'ajustesInventario'],
        subMenu: false,
      },
      {
        name: 'Configuraciones',
        icon: 'uil uil-estate',
        subMenu: true,
        listaSubMenu: [
          {
            name: 'Empresas',
            icon: 'uil uil-building',
            route: ['/dashboard', 'empresas'],
          },
          {
            name: 'Usuarios',
            icon: 'uil uil-user',
            route: ['/dashboard', 'usuario'],
          },
          {
            name: 'Tipo Usuario',
            icon: 'uil uil-users-alt',
            route: ['/dashboard', 'tipoUsuario'],
          },
          {
            name: 'Activaciones',
            icon: 'uil uil-users-alt',
            route: ['/dashboard', 'activaciones'],
          },
        ],
      },
      // {
      //   name: 'Inicio',
      //   icon: 'uil uil-estate',
      //   route: ['/dashboard'],
      //   subMenu: false,
      // },

    ];
  }

  logout() {
    sessionStorage.clear()
    this.router.navigate(['/login']);
  }


}

