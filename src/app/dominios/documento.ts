export class Documento {
    constructor(
      public id: number,
      public nombre: string,
      public tipoDocumento: string,
      public codigoDocumento: string,
      public area: string,
      public version: string,
      public vigente: any, 
      public nombreArchivo: string,
      public rutaArchivo: string
    ) {}


    public static fromJson(element: any) {
        return new Documento(
           element.ID,
           element.Title,
           element.TipoDocumento,
           element.CodigoDocumento,
           element.Area,
           element.Version0,
           element.Vigente,
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