import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-table-title',
  standalone: true,
  imports: [],
  templateUrl: './header-table-title.component.html',
  styleUrl: './header-table-title.component.css'
})
export class HeaderTableTitleComponent {
  @Input() title = ""
  @Input() descripcionPage = ""
  @Input() enlace = ""
}
