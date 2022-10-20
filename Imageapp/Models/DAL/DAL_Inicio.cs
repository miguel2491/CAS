using Imageapp.Models.Propiedades;
using Imageapp.Models.Utils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;

namespace Imageapp.Models.DAL
{
    public class DAL_Inicio
    {
        #region Procedimientos
        public enum Procedimientos
        {
            Inicio_SEL_ValidarUsuario,
            Inicio_SEL_Menus
        }
        #endregion

        #region Propiedades

        public P_Inicio p_Inicio { get; set; }
        public Result result { get; set; }

        #endregion

        #region Constructores
        public DAL_Inicio()
        {
            p_Inicio = new P_Inicio();
            result = new Result();
        }

        #endregion
        
        public void VerficarUsuario()
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Inicio_SEL_ValidarUsuario.ToString(), p_Inicio);
                storedProcedure._isLogin = true;
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al validar el usuario", e);
            }            
        }

        public void GetMenus()
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Inicio_SEL_Menus.ToString(), p_Inicio);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener menus", e);
            }
        }
    }
}