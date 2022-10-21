using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Imageapp.Models.Propiedades
{
    public class P_Clientes_Servicio
    { 
        #region Propiedades
        public int? id_RV { get; set; }
        public int? id_RVA { get; set; }
        public int? id_cliente { get; set; }
        public int? id_servicio { get; set; }
        public decimal? ingreso { get; set; }
        public decimal? monto { get; set; }
        public decimal? porcentaje { get; set; }
        public int? numero_trabajadores { get; set; }
        public int? cantidad { get; set; }
        public decimal? descuento { get; set; }
        public P_Clientes_Servicio()
        {
            this.id_RV = -1;
            this.id_RVA = -1;
            this.id_cliente = -1;
            this.id_servicio = -1;
            this.ingreso = -1;
            this.monto = -1;
            this.porcentaje = -1;
            this.numero_trabajadores = -1;
            this.cantidad = -1;
            this.descuento = -1;
        }
    #endregion
    }
}