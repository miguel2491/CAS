using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Imageapp.Models
{
    public class Balanzas
    {
        public String Cuenta { get; set; }
        public String Descripcion { get; set; }
        public Decimal Saldo_Inicial { get; set; }
        public Decimal Debe { get; set; }
        public Decimal Haber { get; set; }
        public Decimal Saldo_Final { get; set; }
        public String Mes { get; set; }
    }
}