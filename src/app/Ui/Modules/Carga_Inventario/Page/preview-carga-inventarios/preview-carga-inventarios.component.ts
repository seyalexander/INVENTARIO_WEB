import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-preview-carga-inventarios',
  standalone: true,
  imports: [],
  templateUrl: './preview-carga-inventarios.component.html',
  styleUrl: './preview-carga-inventarios.component.css'
})
export class PreviewCargaInventariosComponent {
  @Input() excelData: any[] = [];
}
