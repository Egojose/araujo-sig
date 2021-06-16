import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { SPServicio } from './servicios/sp-servicio';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
// import { ItemAddResult, Items } from 'sp-pnp-js';
import { Grupo } from './dominios/grupo';
import { Usuario } from './dominios/usuario';
import { Documento } from './dominios/documento';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private fB: FormBuilder, private servicio: SPServicio, private router: Router, public toastr: ToastrManager) { }
  
  displayedColumns: string[] = ['nombre', 'tipoDocumento', 'codigo', 'proceso', 'verArchivo'];
  
  
  ngOnInit() {
    this.registrarControles();
    this.ObtenerUsuarioActual();
    this.obtenerDocumentos();
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort; 
  formDocumento: FormGroup;
  title = 'sig-araujo';
  DocAdjunto: any;
  grupos: Grupo[] = [];
  usuarioActual: Usuario;
  dataSource;
  documentos: Documento[] = [];
  empty: boolean;
  consultaDocumentos: Documento[] = [];
  nombreUsuario: string;
  idUsuario: number;
  url: any;
  formato: boolean;


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
        this.usuarioActual = new Usuario(Response.Title, Response.Email, Response.Id);
        this.nombreUsuario = this.usuarioActual.nombre;
        this.idUsuario = this.usuarioActual.id;
        // this.obtenerGrupos();
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

  obtenerDocumentos() {
    this.servicio.obtenerDocumentos().then(
      (respuesta) => {
        this.documentos = Documento.fromJsonList(respuesta);
        // console.log(this.documentos.sort((a, b) => (a.nombreArchivo > b.nombreArchivo) ? 1 : -1))
        if(this.documentos.length > 0) {
          this.empty = false;
          this.dataSource = new MatTableDataSource(this.documentos.sort((a, b) => (a.nombreArchivo > b.nombreArchivo) ? 1 : -1));
          // console.log(this.dataSource);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.empty = true;
        }
      }
    ).catch(
      error => {
        console.log('Error obteniendo los documentos: ' + error);
      }
    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // verificarPermisos() {
  //   let existeGrupoCrearEditarPerfilEmpleado = this.grupos.find(x => x.title === "CrearEditarPerfilEmpleado");
  //   console.log(existeGrupoCrearEditarPerfilEmpleado);
  //   if (existeGrupoCrearEditarPerfilEmpleado !== undefined) {
  //     this.PermisosCrearRegistro = true;
  //   };
  // };

  adjuntarDocumento(event) {
    let Documento = event.target.files[0];
    this.url = event.target.files[0].ServerRelativeUrl;
    console.log(this.url);
    console.log(Documento);
    if (Documento != null) {
      this.DocAdjunto = Documento;
    } else {
      this.DocAdjunto = null;
    }
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

  // onSubmit() {
  //   console.log('funciona')
  //   this.agregarDocumento();
  // }
 
  
}



