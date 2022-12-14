using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Imageapp.Models.Propiedades
{
    public class P_CRM
    {
        #region Propiedades
        public int? id_RV { get; set; }
        public int? id_RVA { get; set; }

        public string nombre_imagen { get; set; }
        public string nombre_carpeta_mes { get; set; }
        public string nombre_archivo { get; set; }

        public string url_comprobante { get; set; }
        public string url_identificacion { get; set; }
        public string url_tarjeta_patronal { get; set; }
        public P_CRM()
        {
            this.id_RV = -1;
            this.id_RVA = -1;
            this.nombre_imagen = string.Empty;
            this.nombre_carpeta_mes = string.Empty;
            this.nombre_archivo = string.Empty;
            this.url_comprobante = string.Empty;
            this.url_identificacion = string.Empty;
            this.url_tarjeta_patronal = string.Empty;
        }
        #endregion
    }
}