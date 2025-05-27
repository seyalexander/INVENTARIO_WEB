import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import html2canvas from 'html2canvas';
import { ToastrService } from 'ngx-toastr';
import { SeguridadModel } from 'src/app/Domain/models/seguridad/seguridad.model';
import { MensajesListaUsuariosService } from 'src/app/Infraestructure/core/SeetAlert/Usuarios/mensajes-lista-usuarios.service';

@Component({
  selector: 'app-tarjeta-usuario-enviar',
  standalone: true,
  imports: [],
  templateUrl: './tarjeta-usuario-enviar.component.html',
  styleUrl: './tarjeta-usuario-enviar.component.css',
})
export class TarjetaUsuarioEnviarComponent {
  @Input() usuario: SeguridadModel = {} as SeguridadModel;
  @ViewChild('tarjeta') tarjeta!: ElementRef;

  constructor(
    private cdRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private mensajesAlert: MensajesListaUsuariosService
  ) {}

  copiarImagen() {
    if (!this.tarjeta) return;

    this.tarjeta.nativeElement.style.position = 'absolute';
    this.tarjeta.nativeElement.style.left = '-9999px';
    this.tarjeta.nativeElement.style.opacity = '1';
    this.tarjeta.nativeElement.style.display = 'block';

    this.cdRef.detectChanges();

    setTimeout(() => {
      html2canvas(this.tarjeta.nativeElement, {
        useCORS: true,
        backgroundColor: null,
        scale: 3,
      }).then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard
              .write([item])
              .then(() => {
                this.mensajeCopiCorrecto();
                this.tarjeta.nativeElement.style.display = 'none';
              })
              .catch(() => {
                this.toastr.error('No se pudo copiar la imagen', 'Error');
              });
          }
        });
      });
    }, 500);
  }

  mensajeCopiCorrecto() {
    this.mensajesAlert.mensajeCopiCorrecto()
    .then(() => {
      // Si es necesario recargar, descomentar la línea siguiente:
      // window.location.reload();
    });
  }

}
