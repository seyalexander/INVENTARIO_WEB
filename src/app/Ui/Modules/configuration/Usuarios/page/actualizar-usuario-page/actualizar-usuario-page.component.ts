import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmpresasModel } from 'src/app/Domain/models/empresas/empresas.model';
import { MensajeResponseEmpresas } from 'src/app/Domain/models/empresas/ResponseEmpresas.model';
import { MensajeRolesModel } from 'src/app/Domain/models/roles/mensajeRoles.model';
import { RolesModel } from 'src/app/Domain/models/roles/roles.model';
import { ReqActualizarUsuario } from 'src/app/Domain/models/seguridad/requestActualizarusuario.mode';
import { SeguridadModel } from 'src/app/Domain/models/seguridad/seguridad.model';
import { EmpresasService } from 'src/app/Infraestructure/driven-adapter/empresas/empresas.service';
import { RolesService } from 'src/app/Infraestructure/driven-adapter/roles/roles.service';
import { SeguridadService } from 'src/app/Infraestructure/driven-adapter/seguridad/seguridad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'actualizar-usuario-page',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule
  ],
  templateUrl: './actualizar-usuario-page.component.html',
  styleUrl: './actualizar-usuario-page.component.css',
})
export class ActualizarUsuarioPageComponent {
  @Input() datosUsuario: SeguridadModel = {} as SeguridadModel;

  DatosEmpresas: Array<EmpresasModel> = [];
  DatosRoles: Array<RolesModel> = [];
  ObjtEmpresa: EmpresasModel = {} as EmpresasModel;

  private empresasSubscription: Subscription | undefined;
  private rolesSubscription: Subscription | undefined;

  constructor(
    private readonly _usuarios: SeguridadService,
    private readonly _empresas: EmpresasService,
    private readonly _roles: RolesService
  ) {}

  formularioRegistro: FormGroup = new FormGroup({});

  ngOnInit(): void {
    const estado: string = '1';
    this.listaEmpresas();
    this.listaRoles(estado);
    this.formularioRegistro = new FormGroup({
      rucEmpresa: new FormControl(this.datosUsuario?.rucempresa || '', [Validators.required]),
      idUsuario: new FormControl(this.datosUsuario.idusuario ||'', [Validators.required]),
      nombreUsuario: new FormControl( this.datosUsuario.nombreusuario ||'', [Validators.required]),
      apellidoUsuario: new FormControl(this.datosUsuario.apellido ||'', [Validators.required]),
      cargoUsuario: new FormControl( this.datosUsuario.cargo || '', [Validators.required]),
      contraseniaUsuario: new FormControl( this.datosUsuario.contrasenia || '', [Validators.required]),
      rolUsuario: new FormControl('', [Validators.required]),
    });

    this.formularioRegistro.patchValue({
      rucempresa: this.ObjtEmpresa.rucempresa || '',
    });
  }

  usuario: SeguridadModel = new SeguridadModel();
  actualizarUsuario: ReqActualizarUsuario = new ReqActualizarUsuario()

  cerrarRegistro(): void {
    this.formularioRegistro.reset();
  }

  guardarUsuario() {
    const formValue = this.usuario;
    const formActualizar = this.actualizarUsuario
    formActualizar.usuariomodificador = sessionStorage.getItem('user') ?? 'System';
    formActualizar.cargo = formValue.cargo.toUpperCase();

    console.log("DATOS ENVIADOS PARA ACTUALIZAR: ", formActualizar);


    this._usuarios.actualizarUsuario(formActualizar).subscribe({
      next: (response) => {
        this.mensajeValidacionRegistroCorrecto(this.tituloSwalCorrecto);
      },
      error: (err) => {
        this.mensajeRegistroEmpresa('Error al registrar al usuario', err);
      },
    });
  }

  listaEmpresas() {
    this.empresasSubscription = this._empresas
      .ListarEmpresas()
      .subscribe((response: MensajeResponseEmpresas) => {
        this.DatosEmpresas = response.empresas;
      });
  }

  listaRoles(estado: string) {
    this.rolesSubscription = this._roles
      .ListarRoles(estado)
      .subscribe((response: MensajeRolesModel) => {
        this.DatosRoles = response.roles;
      });
  }

  tituloSwalCorrecto: string = 'CONFIRMACIÓN';
    mensajeValidacionRegistroCorrecto(response: any) {
      const message = response.message
        ? response.message
        : 'Usuario Actualizado correctamente';
      Swal.fire(`${this.tituloSwalCorrecto}`, message, 'success').then(() => {
        window.location.reload();
      });
    }

    mensajeRegistroEmpresa(mensaje: string, error: any): void {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${mensaje} ${error}`,
        // footer: '<a href="#">Why do I have this issue?</a>'
      });
    }

  ngOnDestroy(): void {
    if (this.empresasSubscription) {
      this.empresasSubscription.unsubscribe();
    }
    if (this.rolesSubscription) {
      this.rolesSubscription.unsubscribe();
    }
  }
}
