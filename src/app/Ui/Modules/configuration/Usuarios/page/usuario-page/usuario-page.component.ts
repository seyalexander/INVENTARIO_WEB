import { SeguridadService } from 'src/app/Infraestructure/driven-adapter/seguridad/seguridad.service';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { TableUsuariosComponent } from '../../components/tables/table-usuarios/table-usuarios.component';
import { RegistroUsuarioComponent } from '../registro-usuario/registro-usuario.component';
import { SeguridadModel } from 'src/app/Domain/models/seguridad/seguridad.model';
import { Subscription } from 'rxjs';
import { MensajeSeguridadModel } from 'src/app/Domain/models/seguridad/mensajeSeguridad.model';
import { MensajesListaUsuariosService } from 'src/app/Infraestructure/core/SeetAlert/Usuarios/mensajes-lista-usuarios.service';

@Component({
  selector: 'app-usuario-page',
  standalone: true,
  imports: [TableUsuariosComponent, RegistroUsuarioComponent],
  templateUrl: './usuario-page.component.html',
  styleUrl: './usuario-page.component.css',
})
export class UsuarioPageComponent implements OnInit, OnDestroy {

  private seguridadSubscription: Subscription | undefined;
  DatosUsuarios: SeguridadModel[] = [];

  private readonly _usuario = inject(SeguridadService);
  private readonly _mensajesUsuario = inject(MensajesListaUsuariosService);

  ngOnInit(): void {
    this.listaUsuarios();
  }

  /**
   * Obtiene y carga la lista de usuarios desde el servicio de seguridad.
   *
   * Esta función realiza una llamada al servicio `ListarUsuarios` para obtener
   * los usuarios registrados. Cuando se recibe la respuesta, los datos de los usuarios
   * son almacenados en la propiedad `DatosUsuarios` del componente.
   *
   * La suscripción se guarda en la propiedad `seguridadSubscription` para poder
   * gestionarla y evitar posibles fugas de memoria.
   *
   * @returns void
   */
  listaUsuarios() {
    try {
      this.seguridadSubscription = this._usuario.ListarUsuarios().subscribe({
        next: (response: MensajeSeguridadModel) => {
          if (response.exito) {
            if (Array.isArray(response.usuarios)) {
              this.DatosUsuarios = response.usuarios;
            } else {
              this.DatosUsuarios = [];
              this._mensajesUsuario.MensajeDatosNoValidos();
            }
          } else {
            this.DatosUsuarios = [];
            this._mensajesUsuario.MensajeRespuestaApiFalse();
          }
        },
        error: (error) => {
          this.DatosUsuarios = [];
          this._mensajesUsuario.Error_ConexionApi(error);
        },
      });
    } catch (err) {
      console.log(err);
      this._mensajesUsuario.mostrarMensajeError();
    }
  }

  /**
   * Realiza la limpieza de las suscripciones al destruir el componente.
   *
   * Esta función es parte del ciclo de vida de Angular. Se llama cuando el componente
   * está por ser destruido, lo que permite limpiar los recursos y evitar posibles
   * fugas de memoria. En este caso, se encargará de cancelar las suscripciones activas
   * a los servicios de `usuarios` mediante el método `unsubscribe()`.
   *
   * @returns void
   */
  ngOnDestroy(): void {
    this.seguridadSubscription?.unsubscribe();
  }
}
