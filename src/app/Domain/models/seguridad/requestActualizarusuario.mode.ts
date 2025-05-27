export class ReqActualizarUsuario {
  rucempresa?: string  = ''
	idusuario = ''
	nombreusuario?: string = ''
	apellido?: string  = ''
	cargo?: string  = ''
	estado?: string  = ''
	contrasenia?: string  = ''
	usuariomodificador = ''

  nombreTemporal?: string = '';
  editando?: boolean;

  apellidoTemporal?: string = '';
  editandoApellido?: boolean;

  cargoTemporal?: string = '';
  editandoCargo?: boolean;

  empresaTemporal?: string = '';
  editandoEmpresa?: boolean;
}
