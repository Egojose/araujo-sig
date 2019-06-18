import { Component } from '@angular/core';
import { SPServicio } from './servicios/sp-servicio';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ItemAddResult } from 'sp-pnp-js';
import { Grupo } from './dominios/grupo';
import { Usuario } from './dominios/usuario';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private fB: FormBuilder, private servicio: SPServicio, private router: Router, public toastr: ToastrManager) { }
  
  ngOnInit() {
    this.registrarControles();
    this.ObtenerUsuarioActual();
  }

  formDocumento: FormGroup;
  title = 'sig-araujo';
  DocAdjunto: any;
  grupos: Grupo[] = [];
  usuarioActual: Usuario;

  private registrarControles() {
    this.formDocumento = this.fB.group({
      tipoDocumento: ['', Validators.required],
      codigoDocumento: ['', Validators.required],
      area: ['', Validators.required],
      version: ['', Validators.required],
      vigente: ['', Validators.required]
    })
  };

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.usuarioActual = new Usuario(Response.Title, Response.email, Response.Id);
        this.obtenerGrupos();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    );
  };

  obtenerGrupos() {
    let idUsuario = this.usuarioActual.id;
    this.servicio.ObtenerGruposUsuario(idUsuario).subscribe(
      (respuesta) => {
        this.grupos = Grupo.fromJsonList(respuesta);
        console.log(this.grupos)
      }, err => {
        console.log('Error obteniendo grupos de usuario: ' + err);
      }
    )
  };

  // verificarPermisos() {
  //   let existeGrupoCrearEditarPerfilEmpleado = this.grupos.find(x => x.title === "CrearEditarPerfilEmpleado");
  //   console.log(existeGrupoCrearEditarPerfilEmpleado);
  //   if (existeGrupoCrearEditarPerfilEmpleado !== undefined) {
  //     this.PermisosCrearRegistro = true;
  //   };
  // };

  adjuntarDocumento(event) {
    let Documento = event.target.files[0];
    if (Documento != null) {
      this.DocAdjunto = Documento;
      this.agregarDocumento();
    } else {
      this.DocAdjunto = null;
    };
  };

  async agregarDocumento() {
    let nombreArchivo = this.DocAdjunto.name;
    let tipoDocumento = this.formDocumento.get('tipoDocumento').value;
    let codigoDocumento = this.formDocumento.get('codigoDocumento').value;
    let area = this.formDocumento.get('area').value;
    let version = this.formDocumento.get('version').value;
    let vigente = this.formDocumento.get('vigente').value;
    let objDocumento;

    objDocumento = {
      TipoDocumento: tipoDocumento,
      CodigoDocumento: codigoDocumento,
      Area: area,
      Version: version,
      Vigente: vigente
    }
    
    await this.servicio.AgregarDocumento(nombreArchivo, this.DocAdjunto).then(
      f => {
        f.file.getItem().then(item => {
          let idDocumento = item.Id;
          this.actualizarMetadatosDocumento(objDocumento, idDocumento);
          // item.update(obj);               
        })
      }
    ).catch(
      (error) => {
        this.MensajeError('No se pudo cargar el archivo. Intente de nuevo')
      }
    );
  };

  actualizarMetadatosDocumento(obj, idDocumento) {
    this.servicio.ActualizarMetadatosSig(obj, idDocumento).then(
      (res) => {
        this.MensajeInfo('El documento se cargó correctamente')
      }
    )
      .catch(
        (error) => {
          console.log(error);
        }
      )
  };

  MensajeExitoso(mensaje: string) {
    this.toastr.successToastr(mensaje, 'Confirmado!');
  }

  MensajeError(mensaje: string) {
    this.toastr.errorToastr(mensaje, 'Oops!');
  }

  MensajeAdvertencia(mensaje: string) {
    this.toastr.warningToastr(mensaje, 'Validación!');
  }

  MensajeInfo(mensaje: string) {
    this.toastr.infoToastr(mensaje, 'Info');
  }

 
  
}



