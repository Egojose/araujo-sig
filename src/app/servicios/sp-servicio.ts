import { environment } from "src/environments/environment.prod";
import { default as pnp, Web } from 'sp-pnp-js';
import { Injectable } from "@angular/core";
import { from } from 'rxjs'; 


@Injectable()

export class SPServicio {
    constructor() {}

    public ObtenerConfiguracion() {
        const configuracionSharepoint = pnp.sp.configure({
            headers: {
                "Accept": "application/json; odata=verbose"
            }
        }, environment.urlWeb);

        return configuracionSharepoint;
    }

    public ObtenerConfiguracionConPost() {
        const configuracionSharepoint = pnp.sp.configure({
            headers: {
                "Accept": "application/json; odata=verbose",
                'Content-Type': 'application/json;odata=verbose',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkN0ZlFDOExlLThOc0M3b0MyelFrWnBjcmZPYyIsImtpZCI6IkN0ZlFDOExlLThOc0M3b0MyelFrWnBjcmZPYyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvYXJpYmFzYXMuc2hhcmVwb2ludC5jb21AM2FjZDI5NDUtNDdlOC00YTVjLTljNjgtMjkzOTY5MTA5ZTRkIiwiaXNzIjoiMDAwMDAwMDEtMDAwMC0wMDAwLWMwMDAtMDAwMDAwMDAwMDAwQDNhY2QyOTQ1LTQ3ZTgtNGE1Yy05YzY4LTI5Mzk2OTEwOWU0ZCIsImlhdCI6MTU2MDk3NDYwOCwibmJmIjoxNTYwOTc0NjA4LCJleHAiOjE1NjEwMDM3MDgsImlkZW50aXR5cHJvdmlkZXIiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBAM2FjZDI5NDUtNDdlOC00YTVjLTljNjgtMjkzOTY5MTA5ZTRkIiwibmFtZWlkIjoiNmRmOThiMWUtNWE5Mi00NGMxLTlmNWMtZmJjN2Y2NTYyMjU4QDNhY2QyOTQ1LTQ3ZTgtNGE1Yy05YzY4LTI5Mzk2OTEwOWU0ZCIsIm9pZCI6IjdiODhiOTkxLThkY2QtNGIzZC05NTAzLTJmMjEyYWI4MWQ3YSIsInN1YiI6IjdiODhiOTkxLThkY2QtNGIzZC05NTAzLTJmMjEyYWI4MWQ3YSIsInRydXN0ZWRmb3JkZWxlZ2F0aW9uIjoiZmFsc2UifQ.IcgILqUKOdmZvL5iWG0xdqvra4fPr0Z9doQpZPzDcsxUZE1VyCEtjexIVq3ne_BjRPbPmT8LLwuCoExbo2gVXQHAGXKGRA0m6mqRbgtRRWN3LOCQqdkAcdNfNo_AWpY6tyqwj5J5_U8yv95hYGAyIrPxt4I12ZVjaRS9SmlQiuuzClW1V_37Tra-i9KsiyorID7UbJlXfBy4ysn3_8IXORE-VdHiluPoq4ZWZhuLWarwm5uLfIqKMpm6vnMXY4qjwA2vSzrwofD4wM084TivfHmyeBzYEfvipk4ODKHyWTig2SRJHhdTKl-f0Xohjf5GyP627OO9nKj_immbVJCJJA'
            }
        }, environment.urlWeb);

        return configuracionSharepoint;
    }

    ObtenerUsuarioActual() {
        let respuesta = from(this.ObtenerConfiguracion().web.currentUser.get());
        return respuesta;
    }

    ObtenerGruposUsuario(usuarioId: number){
        let respuesta = from(this.ObtenerConfiguracion().web.getUserById(usuarioId).groups.get());
        return respuesta;
    }

    async AgregarDocumento(nombre, archivo: File): Promise<any> {
        let mensaje = ""
        let respuesta = await this.ObtenerConfiguracionConPost().web.getFolderByServerRelativeUrl("DocumentosSig").files.add(nombre, archivo);
        return respuesta; 
    }

    ActualizarMetadatosSig(obj, idDocumento){
        let respuesta = this.ObtenerConfiguracionConPost().web.lists.getByTitle("DocumentosSig").items.getById(idDocumento).update(obj);
        return respuesta;
    }

    obtenerDocumentos() {
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaDocumentos).items.select("ID", "Title", "TipoDocumento", "CodigoDocumento", "Area", "Version0","Vigente", "FileLeafRef", "File").expand("File").getAll();
        return respuesta;
    }
    
}