import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from 'src/app/Ui/Shared/Components/organisms/sidebar/sidebar.component';

@Component({
  selector: 'app-lista-modulo-page',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './lista-modulo-page.component.html',
  styleUrl: './lista-modulo-page.component.css'
})
export class ListaModuloPageComponent {

}
