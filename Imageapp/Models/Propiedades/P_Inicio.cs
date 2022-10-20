using Imageapp.Models.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Imageapp.Models.Propiedades
{
    public class P_Inicio
    {
        #region Propiedades

        public String usuario { get; set; }
        public String password { get; set; }

        public P_Inicio()
        {
            this.usuario = string.Empty;
            this.password = string.Empty;
        }

        #endregion
    }
}