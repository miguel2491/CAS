using Imageapp.Models.Propiedades;
using Imageapp.Models.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Imageapp.Models.DAL
{
    public class DAL_Utils
    {
        #region Procedimientos
        public enum Procedimientos
        {
            Utils_SEL_ValidarAccesoVista,
            Utils_SEL_Catalogos,
            Utils_SEL_Permisos,
            Integracion_SEL_DatosConfiguracion
        }
        #endregion

        #region Propiedades
        public P_Utils p_Utils { get; set; }
        public Result result { get; set; }
        #endregion

        #region Constructores
        public DAL_Utils()
        {
            result = new Result();
            p_Utils = new P_Utils();
        }
        #endregion

        public bool isSessionActive()
        {
            result = new Result();

            if (HttpContext.Current.Session["tbc_Usuarios"] == null)
            {
                result.setError("La session ha expirado, favor de reingresar al sistema");
                return false;
            }

            return true;
        }

        public bool ValidarAccesoVista()
        {
            try
            {
                result = new Result();

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Utils_SEL_ValidarAccesoVista.ToString(), p_Utils);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();

                return result.status == (int)ListaEstatus.Success;
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al validar el acceso a la vista", e);

                return false;
            }
        }

        public void GetCatalogos(string jsonJS)
        {
            try
            {
                result = new Result();

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Utils_SEL_Catalogos.ToString(),jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener el catálogo", e);
            }
        }

        public void GetPermisos()
        {
            try
            {
                result = new Result();

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Utils_SEL_Permisos.ToString(),p_Utils);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener la lista de permisos", e);
            }
        }

        public void GetConfiguracionServidor()
        {
            try
            {
                result = new Result();

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Integracion_SEL_DatosConfiguracion.ToString(), p_Utils);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener la configuración de servidor", e);
            }
        }
    }
}