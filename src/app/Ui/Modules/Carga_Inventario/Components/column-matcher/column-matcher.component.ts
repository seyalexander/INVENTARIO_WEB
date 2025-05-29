import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTab, MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-column-matcher',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTab,
    MatTabsModule
  ],
  templateUrl: './column-matcher.component.html',
  styleUrl: './column-matcher.component.css'
})
export class ColumnMatcherComponent implements OnInit {
  @Input() columnasEsperadas: Record<string, string> = {};
  @Input() columnasExcel: string[] = [];
  @Input() mapeoGuardado: Record<string, string> = {}; // Nuevo Input para el mapeo guardado
  @Output() columnasMapeadas = new EventEmitter<Record<string, string>>();

  selectedColumns: Record<string, string> = {};

  ngOnInit() {
    Object.keys(this.columnasEsperadas).forEach((key) => {
      this.selectedColumns[key] = this.mapeoGuardado[key] || '';
    });
  }

  confirmarSeleccion() {
    this.columnasMapeadas.emit(this.selectedColumns);
  }

  cancelarSeleccion() {
    this.columnasMapeadas.emit();
  }

  esSeleccionValida(): boolean {
    return Object.keys(this.columnasEsperadas).every(
      (key) => this.selectedColumns[key] && this.selectedColumns[key] !== ''
    );
  }
  Object = Object;

}
