//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Imageapp.Datos
{
    using System;
    using System.Collections.Generic;
    
    public partial class tbd_Estados_Cuenta
    {
        public int id_estado_cuenta { get; set; }
        public string estado_cuenta { get; set; }
        public int mes { get; set; }
        public int periodo { get; set; }
        public System.DateTime fecha_carga { get; set; }
        public string nombre_archivo { get; set; }
        public string url_archivo { get; set; }
        public int id_usuario_creo { get; set; }
        public string descripcion { get; set; }
        public int id_cliente { get; set; }
    }
}
