using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Imageapp.Models.Propiedades
{
    public class P_Utils
    {
        public string vista { get; set; }
        public string controlador { get; set; }
        public string accion { get; set; }
        public int? id_RV { get; set; }
        public int? id_RVA { get; set; }

        public P_Utils()
        {
            this.vista = string.Empty;
            this.controlador = string.Empty;
            this.accion = string.Empty;
            this.id_RV = -1;
            this.id_RVA = -1;
        }
    }
}