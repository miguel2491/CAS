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
    
    public partial class tbr_Rol_Vista
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tbr_Rol_Vista()
        {
            this.tbr_Rol_Vista_Accion = new HashSet<tbr_Rol_Vista_Accion>();
        }
    
        public int id_rol_vista { get; set; }
        public int id_rol { get; set; }
        public int id_vista { get; set; }
        public int id_permiso_servidor { get; set; }
    
        public virtual tbc_Permisos_Servidor tbc_Permisos_Servidor { get; set; }
        public virtual tbc_Roles tbc_Roles { get; set; }
        public virtual tbc_Vistas tbc_Vistas { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tbr_Rol_Vista_Accion> tbr_Rol_Vista_Accion { get; set; }
    }
}
