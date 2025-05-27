export class SeguridadModel {
  rucempresa?: string  = '';
  idusuario = '';
  nombreusuario?: string = '';
  apellido?: string  = '';
  cargo?: string  = '';
  estado?: string  = '';
  contrasenia?: string  = '';
  token?: string  = '';
  usuariocreador ?: string = '';
  fechacreacion?: string  = '';
  usuariomodificador ?: string = '';
  fechamodificacion = '';

  nombreTemporal?: string = '';
  editando?: boolean;

  apellidoTemporal?: string = '';
  editandoApellido?: boolean;

  cargoTemporal?: string = '';
  editandoCargo?: boolean;

  empresaTemporal?: string = '';
  editandoEmpresa?: boolean;

  contraseniaTemporal?: string = '';
  editandocontrasenia?: boolean;
}
