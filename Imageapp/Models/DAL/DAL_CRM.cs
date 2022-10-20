using Imageapp.Models.Propiedades;
using Imageapp.Models.Utils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Web;

namespace Imageapp.Models.DAL
{
    public class DAL_CRM
    {
        #region Procedimientos
        public enum Procedimientos
        {
            Catalogo_SEL_InicioCRM,
            Catalogo_SEL_IngresosCRM,
            Catalogo_SEL_EgresosCRM,

            Catalogo_SEL_SueldosCRM,
            Catalogo_SEL_NominasCRM,

            Catalogo_SEL_ComplementosCobroCRM,
            Catalogo_SEL_NotasCreditoCRM,

            Catalogo_SEL_ComplementosPagoCRM,
            Catalogo_SEL_NotasCreditoGastoCRM,

            Catalogo_SEL_CanceladosRecibidosCRM,
            Catalogo_SEL_CanceladosEmitidosCRM,

            Catalogo_SEL_DocuemntosCRM,
            Catalogo_SEL_DocuemntosNominasCRM,
            Catalogo_SEL_EntregablesCRM,
            Catalogo_SEL_EdoCuentaCRM,

            Catalogo_SEL_ListaClientesCRM,
            Catalogo_SEL_ListaProveedoresCRM,

            Catalogo_SEL_ListaTramitesCRM,
            Catalogo_ADD_Tramite,

            Catalogo_SEL_ListaNotificacionesCRM
        }
        #endregion

        #region Propiedades

        public P_CRM p_CRM { get; set; }
        public Result result { get; set; }

        #endregion

        #region Constructores
        public DAL_CRM()
        {
            p_CRM = new P_CRM();
            result = new Result();
        }
        #endregion

        #region Inicio
        public void GetInicio(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_InicioCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener el inicio del CRM", e);
            }
        }

        public void GetIngresos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_IngresosCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener los ingresos del CRM", e);
            }
        }

        public void GetSueldos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_SueldosCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener los sueldos del CRM", e);
            }
        }

        public void GetComplementoCobro(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ComplementosCobroCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener los complemento de cobro del CRM", e);
            }
        }

        public void GetNotaCredito(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_NotasCreditoCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener las notas de credito del CRM", e);
            }
        }

        public void GetNominas(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_NominasCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener las nominas del CRM", e);
            }
        }

        public void GetEgresos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_EgresosCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener los gastos del CRM", e);
            }
        }

        public void GetComplementoPago(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ComplementosPagoCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener los complemento de cobro del CRM", e);
            }
        }

        public void GetNotaCreditoGasto(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_NotasCreditoGastoCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener las notas de credito del CRM", e);
            }
        }

        public void GetCanceladosRecibidos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_CanceladosRecibidosCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener los cfdi recibidos cancelados del CRM", e);
            }
        }

        public void GetCanceladosEmitidos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_CanceladosEmitidosCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener los cfdi emitidos cancelados del CRM", e);
            }
        }


        

        public void GetDocumentos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_DocuemntosCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener los archivos del CRM", e);
            }
        }

        public void GetDocumentosNominas(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_DocuemntosNominasCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener los archivos del CRM", e);
            }
        }

        public void GetEntregables(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_EntregablesCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener los entregables del CRM", e);
            }
        }

        public void GetEdoCuenta(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_EdoCuentaCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener los estados de cuenta del CRM", e);
            }
        }
        public void GetListaClientes(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaClientesCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener la lista de clientes del CRM", e);
            }
        }

        public void GetListaProveedores(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaProveedoresCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener la lista de proveedores del CRM", e);
            }
        }

        public void GetListaTramites(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaTramitesCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener la lista de tramites del CRM", e);
            }
        }

        public void AddTramite(string jsonJS, HttpRequestBase request, string path)
        {
            result = new Result();

            try
            {
                var fileName = string.Empty;

                foreach (string file in request.Files)
                {
                    if (file == "url_comprobante")
                    {
                        var fileContent = request.Files[file];
                        if (fileContent != null && fileContent.ContentLength > 0)
                        {
                            //! Nombre del archivo
                            fileName = Guid.NewGuid() + Path.GetExtension(fileContent.FileName);

                            dynamic data = new ExpandoObject();
                            data = JsonConvert.DeserializeObject(jsonJS);

                            //! Carpeta
                            var ruta = Path.Combine(path, "");
                            if (!Directory.Exists(ruta)) Directory.CreateDirectory(ruta);

                            //! Ruta completa
                            ruta = Path.Combine(ruta, fileName);
                            fileContent.SaveAs(ruta);

                            p_CRM.url_comprobante = fileName;
                        }
                    }
                    else if (file == "url_identificacion")
                    {
                        var fileContent = request.Files[file];
                        if (fileContent != null && fileContent.ContentLength > 0)
                        {
                            //! Nombre del archivo
                            fileName = Guid.NewGuid() + Path.GetExtension(fileContent.FileName);

                            dynamic data = new ExpandoObject();
                            data = JsonConvert.DeserializeObject(jsonJS);

                            //! Carpeta
                            var ruta = Path.Combine(path, "");
                            if (!Directory.Exists(ruta)) Directory.CreateDirectory(ruta);

                            //! Ruta completa
                            ruta = Path.Combine(ruta, fileName);
                            fileContent.SaveAs(ruta);

                            p_CRM.url_identificacion = fileName;
                        }
                    }
                    else if (file == "url_tarjeta_patronal")
                    {
                        var fileContent = request.Files[file];
                        if (fileContent != null && fileContent.ContentLength > 0)
                        {
                            //! Nombre del archivo
                            fileName = Guid.NewGuid() + Path.GetExtension(fileContent.FileName);

                            dynamic data = new ExpandoObject();
                            data = JsonConvert.DeserializeObject(jsonJS);

                            //! Carpeta
                            var ruta = Path.Combine(path, "");
                            if (!Directory.Exists(ruta)) Directory.CreateDirectory(ruta);

                            //! Ruta completa
                            ruta = Path.Combine(ruta, fileName);
                            fileContent.SaveAs(ruta);

                            p_CRM.url_tarjeta_patronal = fileName;
                        }
                    }
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_Tramite.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar archivo a tramites", e);
            }
        }


        public void GetNotificaciones(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaNotificacionesCRM.ToString(), p_CRM, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener la lista de de notificaciones del CRM", e);
            }
        }

        #endregion
    }
}