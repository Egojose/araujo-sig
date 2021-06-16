export class Documento {
    constructor(
      public nombre: string,
      public descripcion: string,
      public tipoDocumento: string,
      public codigoDocumento: string,
      public proceso: string,
      public nombreArchivo: string,
      public rutaArchivo: string
    ) {}


    public static fromJson(element: any) {
        return new Documento(
           element.Title,
           element.Descripcion,
           element.TipoDocumento,
           element.CodigoDocumento,
           element.Proceso,
           element.File.Name,
           element.File.ServerRelativeUrl

        )
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}