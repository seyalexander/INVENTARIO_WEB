import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RequestAsignarUsuario } from 'src/app/Domain/models/inventarios/requestAsignarUsuario.model';
import { SeguridadModel } from 'src/app/Domain/models/seguridad/seguridad.model';
import { UpdateUsuarioAsignadoUseCase } from 'src/app/Domain/use-case/inventarios/update-usuarioAsignado-useCase';
import { MensajesAsignacionService } from 'src/app/Infraestructure/core/SeetAlert/Asignacion/mensajes-asignacion.service';

@Component({
  selector: 'app-registro-asignar-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './registro-asignar-page.component.html',
  styleUrl: './registro-asignar-page.component.css',
})
export class RegistroAsignarPageComponent implements OnInit {
  // ================================================================================
  // DECORADORES
  // ================================================================================
  @Input() getUsuarios_All: SeguridadModel[] = [];
  @Input() rucEmpresa = '';
  @Input() idCarga = 0;
  @Input() usuarios: any[] = [];
  @Input() requUser: RequestAsignarUsuario = {} as RequestAsignarUsuario;
  @Input() UsuarioAsignado = '';
  @Input() Inventario = '';

  // ================================================================================
  // INYECCIÓN DE SERVICIOS
  // ================================================================================

  private readonly updateUsuarioAsignadoUseCase = inject(
    UpdateUsuarioAsignadoUseCase
  );
  private mensaje_alertar = inject(MensajesAsignacionService);

  selectedUsuarioId: number | null = null;
  currentDate: string = new Date().toLocaleDateString();

  inventario: SeguridadModel = new SeguridadModel();
  usuarioAsignado: RequestAsignarUsuario = new RequestAsignarUsuario();
  formularioRegistro: FormGroup = new FormGroup({});

  // ================================================================================
  // FUNCIÓN ASIGNACIÓN
  // ================================================================================
  validacionUsuarioAsignacion() {
    this.UsuarioAsignado
      ? this.Alert_AsignarUsuario(this.Inventario, this.UsuarioAsignado)
      : this.onAsignarUsuario();
  }

  onAsignarUsuario() {
    const formAsignacion = this.requUser;
    formAsignacion.idcarga = this.idCarga;
    formAsignacion.rucempresa = this.rucEmpresa.toString();
    formAsignacion.usuarioasignado = this.inventario.idusuario.toString();

    this.updateUsuarioAsignadoUseCase
      .updateUsuarioAsignado(formAsignacion)
      .subscribe((response: any) => {
        if (response.exito) {
          this.mensaje_alertar.mensajeValidacionRegistroCorrecto(response);
        }
        if (!response.exito) {
          this.mensaje_alertar.mensajeValidacionRegistroCorrecto(response)
        }
      });
  }

  cerrarRegistro(): void {
    this.formularioRegistro.reset();
    this.formularioRegistro.markAsPristine();
    this.formularioRegistro.markAsUntouched();
  }

  Alert_AsignarUsuario(descripcion: string, asignado: string) {
    this.mensaje_alertar
      .Alert_AsignarUsuario(descripcion, asignado)
      .then((confirmado) => {
        if (confirmado) {
          this.onAsignarUsuario();
        }
      });
  }

  // ================================================================================
  // DESTRUCCIÓN DE SUBSCRIPCIONES
  // ================================================================================
  ngOnInit(): void {
    this.formularioRegistro = new FormGroup({
      usuario: new FormControl('', [Validators.required]),
    });
  }
}
