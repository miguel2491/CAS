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
    
    public partial class tbd_Activo_Fijo
    {
        public int id_activo_fijo { get; set; }
        public System.DateTime fecha_adquisicion { get; set; }
        public decimal monto { get; set; }
        public int id_cliente { get; set; }
        public System.DateTime fecha_creacion { get; set; }
        public int id_usuario_creo { get; set; }
        public int id_uso_cfdi { get; set; }
        public bool limite { get; set; }
        public System.DateTime fecha_termino { get; set; }
        public decimal monto_mensual { get; set; }
        public decimal porcentaje_mensual { get; set; }
        public string concepto { get; set; }
        public System.DateTime fecha_aplicacion { get; set; }
    }
}
