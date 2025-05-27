import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmpresasModel } from 'src/app/Domain/models/empresas/empresas.model';
import { SeguridadModel } from 'src/app/Domain/models/seguridad/seguridad.model';
import { EmpresasService } from 'src/app/Infraestructure/driven-adapter/empresas/empresas.service';
import { SeguridadService } from 'src/app/Infraestructure/driven-adapter/seguridad/seguridad.service';
import { RolesService } from 'src/app/Infraestructure/driven-adapter/roles/roles.service';
import { RolesModel } from 'src/app/Domain/models/roles/roles.model';
import { MensajeResponseEmpresas } from 'src/app/Domain/models/empresas/ResponseEmpresas.model';
import { MensajeRolesModel } from 'src/app/Domain/models/roles/mensajeRoles.model';
import { MatInputModule } from '@angular/material/input';
import { MensajesRegistroUsuarioService } from 'src/app/Infraestructure/core/SeetAlert/Usuarios/mensajes-registro-usuario.service';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatInputModule],
  templateUrl: './registro-usuario.component.html',
  styleUrl: './registro-usuario.component.css',
})
export class RegistroUsuarioComponent implements OnInit, OnDestroy {

  DatosEmpresas: EmpresasModel[] = [];
  DatosRoles: RolesModel[] = [];
  ObjtEmpresa: EmpresasModel = {} as EmpresasModel;
  usuario: SeguridadModel = new SeguridadModel();
  formularioRegistro: FormGroup = new FormGroup({});

  private empresasSubscription: Subscription | undefined;
  private rolesSubscription: Subscription | undefined;

  constructor(
    private readonly _usuarios: SeguridadService,
    private readonly _empresas: EmpresasService,
    private readonly _roles: RolesService,
    private mensajesRegistro: MensajesRegistroUsuarioService
  ) {}

  /**
   * Inicializa el componente y establece los valores iniciales para el formulario
   * de registro, además de cargar las listas de empresas y roles.
   *
   * Esta función es parte del ciclo de vida de Angular y se llama automáticamente
   * cuando el componente es inicializado. En este caso, realiza las siguientes tareas:
   * - Llama a los métodos `listaEmpresas()` y `listaRoles()` para cargar las listas
   *   de empresas y roles con el estado '1'.
   * - Configura un formulario reactivo (`formularioRegistro`) con controles de entrada
   *   que requieren validación, tales como `rucEmpresa`, `idUsuario`, `nombreUsuario`,
   *   `apellidoUsuario`, `cargoUsuario`, `contraseniaUsuario`, y `rolUsuario`.
   * - Establece un valor inicial en el campo `rucempresa` del formulario, utilizando
   *   un valor de un objeto `ObjtEmpresa`.
   *
   * @returns void
   */
  ngOnInit(): void {
    const estado = '1';
    this.listaEmpresas();
    this.listaRoles(estado);
    this.formularioRegistro = new FormGroup({
      rucEmpresa: new FormControl('', [Validators.required]),
      idUsuario: new FormControl('', [Validators.required]),
      nombreUsuario: new FormControl('', [Validators.required]),
      apellidoUsuario: new FormControl('', [Validators.required]),
      cargoUsuario: new FormControl('', [Validators.required]),
      contraseniaUsuario: new FormControl('', [Validators.required]),
      rolUsuario: new FormControl('', [Validators.required]),
    });

    this.formularioRegistro.patchValue({
      rucempresa: this.ObjtEmpresa.rucempresa || '',
    });
  }

  /**
   * Prepara y guarda los datos de un nuevo usuario en el sistema.
   *
   * Esta función recopila los datos de un formulario de usuario, asigna valores predeterminados
   * para el creador, modificador y estado del usuario, y envía la solicitud de registro al backend.
   * Si la operación es exitosa, muestra un mensaje de confirmación y recarga la página.
   * Si ocurre un error, muestra una alerta con el mensaje correspondiente.
   *
   * @returns void
   */
  guardarUsuario() {
    const formValue = this.usuario;

    formValue.usuariocreador = 'Usuario_front';
    formValue.usuariomodificador = 'Usuario_front';
    formValue.estado = '1';
    formValue.cargo = formValue.cargo?.toUpperCase();

    this._usuarios.newUsuario(formValue).subscribe({
      next: (response) => {
        this.mensajesRegistro.mensajeValidacionRegistroCorrecto(response);
      },
      error: (err) => {
        this.mensajesRegistro.mensajeRegistroEmpresa(err);
      },
    });
  }

  /**
   * Obtiene y asigna la lista de empresas desde el backend.
   *
   * Esta función realiza una solicitud al servicio para obtener la lista de empresas y asigna
   * los datos recibidos a la propiedad `DatosEmpresas`. Utiliza un `subscribe` para manejar la
   * respuesta del servidor, donde los datos de las empresas se almacenan en el atributo correspondiente.
   * La respuesta se espera que sea del tipo `MensajeResponseEmpresas`, que incluye una propiedad
   * `empresas` con la lista de empresas.
   *
   * @returns void
   */
  listaEmpresas() {
    this.empresasSubscription = this._empresas
      .ListarEmpresas()
      .subscribe((response: MensajeResponseEmpresas) => {
        this.DatosEmpresas = response.empresas;
      });
  }

  /**
   * Obtiene y asigna la lista de roles desde el backend, filtrada por el estado proporcionado.
   *
   * Esta función realiza una solicitud al servicio para obtener la lista de roles, filtrando
   * los resultados según el parámetro `estado` que se pasa a la función. Una vez que se obtiene
   * la respuesta del servidor, se asigna la lista de roles a la propiedad `DatosRoles`. La
   * respuesta esperada es un objeto de tipo `MensajeRolesModel`, que incluye una propiedad
   * `roles` con la lista de roles.
   *
   * @param estado - El estado por el cual se filtran los roles (por ejemplo, 'activo', 'inactivo').
   * @returns void
   */
  listaRoles(estado: string) {
    this.rolesSubscription = this._roles
      .ListarRoles(estado)
      .subscribe((response: MensajeRolesModel) => {
        this.DatosRoles = response.roles;
      });
  }

  /**
   * Resetea el formulario de registro, limpiando todos los campos.
   *
   * Esta función se encarga de restablecer el estado del formulario de registro
   * utilizando el método `reset()` del objeto `formularioRegistro`. Al llamarla,
   * todos los campos del formulario se vacían, lo que permite iniciar un nuevo proceso
   * de registro sin datos previos.
   *
   * @returns void
   */
  cerrarRegistro(): void {
    window.location.reload()
  }

  /**
   * Realiza la limpieza de las suscripciones al destruir el componente.
   *
   * Esta función es parte del ciclo de vida de Angular. Se llama cuando el componente
   * está por ser destruido, lo que permite limpiar los recursos y evitar posibles
   * fugas de memoria. En este caso, se encargará de cancelar las suscripciones activas
   * a los servicios de `empresas` y `roles` mediante el método `unsubscribe()`.
   *
   * @returns void
   */
  ngOnDestroy(): void {
    this.empresasSubscription?.unsubscribe();
    this.rolesSubscription?.unsubscribe();
  }
}
