using Imageapp.Models.Propiedades;
using Imageapp.Models.Utils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Web;
using Word = Microsoft.Office.Interop.Word;

namespace Imageapp.Models.DAL
{
    public class DAL_Clientes
    {
        #region Procedimientos
        public enum Procedimientos
        {
            Catalogo_SEL_ListaClientes,
            Catalogo_SEL_ListaClientesLinea,

            Catalogo_ADD_Cliente,
            Catalogo_UPD_Cliente,
            Catalogo_DEL_Cliente,

            Catalogo_SEL_XMLEmitidos,
            Catalogo_SEL_XMLRecibidos,

            Catalogo_GET_ClienteRIF,
            Catalogo_UPD_ClienteRIF,

            Catalogo_SEL_ListaRepositorio,
            Catalogo_ADD_Repositorio,
            Catalogo_ADD_RepositorioC,
            Catalogo_UPD_Repositorio,
            Catalogo_DEL_Repositorio,
            Catalogo_SEL_ListaDocumentosDigitales,

            Catalogo_SEL_ListaRepositorioNomina,
            Catalogo_ADD_RepositorioNomina,
            Catalogo_ADD_RepositorioNomina2,
            Catalogo_UPD_RepositorioNomina,
            Catalogo_DEL_RepositorioNomina,
            Catalogo_SEL_ListaDocumentosNomina,

            Catalogo_SEL_ListaEntregables,
            Catalogo_ADD_Entregables,
            Catalogo_UPD_Entregables,
            Catalogo_DEL_Entregables,

            Catalogo_SEL_ListaEstadosCuenta,
            Catalogo_ADD_EstadoCuenta,
            Catalogo_ADD_EstadoCuentaC,
            Catalogo_DEL_EstadoCuenta,

            Catalogo_SEL_ListaOtrosServicios,
            Catalogo_ADD_OtrosServicios,
            Catalogo_DEL_OtrosServicios,

            Catalogo_SET_FechaPago,
            Catalogo_SET_EstatusSAT,
            Catalogo_SET_EstatusSATWS,
            Catalogo_SET_EstatusXML,

            Catalogo_SEL_ListaDeposito,
            Catalogo_ADD_Deposito,
            Catalogo_SEL_EliminarDeposito,

            Catalogo_SEL_Bimestres_RIF,
            Catalogo_SEL_XMLIngresos,
            Catalogo_SEL_XMLEgresos,

            Catalogo_SEL_XMLDPersonales,
            Catalogo_SEL_XMLNominas,
            Catalogo_SEL_XMLSueldos,
            Catalogo_SEL_XMLDepreciaciones,
            Catalogo_SEL_XMLNoDeducible,

            Catalogo_SEL_ListaPagos,
            Catalogo_ADD_Pago,
            Catalogo_SEL_EliminarPago_RIF,

            Catalogo_SEL_ListaPagos_ISR,
            Catalogo_ADD_Pago_ISR,
            Catalogo_SEL_EliminarPago_RIF_ISR,

            Catalogo_SEL_Recalcular_RIF,
            Catalogo_SEL_Recalcular_RIF_ISR,


            Catalogo_SEL_ListaActivoFijo,
            Catalogo_ADD_ActivoFijo,
            Catalogo_SEL_EliminarActivoFijo,


            Catalogo_SEL_ListaConceptos,
            Catalogo_SEL_XMLZip,
            Catalogo_SEL_XMLZipCRMIngresos,
            Catalogo_SEL_XMLZipCRMGastos,

            Catalogo_SEL_GetXMLCancelados,




            //Reportes
            Catalogo_SEL_ReporteEntregablesRIF,
            Catalogo_SEL_ReporteEntregablesArrendamiento,
            Catalogo_SEL_ReporteEntregablesHonorarios,
            Catalogo_SEL_ReporteEntregablesPFAE,
            Catalogo_SEL_ReporteEntregablesPM,
            Catalogo_SEL_ReporteEntregablesAsesoria,
            Catalogo_SEL_ReporteEntregablesCOI,
            Catalogo_SEL_ReporteEntregablesEDO,
            Catalogo_SEL_ReporteEntregablesSueldos,

            Catalogo_SEL_ReporteEntregablesNomina,

            ReportesGenerales_SEL_EstadoCuenta,

            Catalogo_SEL_ReportePropuestasEconomicas,

            //Expediente Fiscal
            Catalogo_SEL_ReporteExpedienteFiscalRIF,
            Catalogo_SEL_ReporteExpedienteFiscalPFAE,
            Catalogo_SEL_ReporteExpedienteFiscalPM,
            Catalogo_SEL_ReporteExpedienteFiscalArrendamiento,
            Catalogo_SEL_ReporteExpedienteFiscalHonorarios,
            Catalogo_SEL_ReporteExpedienteFiscalSueldos,


            //Calendario Actividades
            Catalogo_SEL_CalendarioActividadesLP1,
            Catalogo_SEL_CalendarioActividades,
            Catalogo_ADD_FechaCalendarioActividades,
            Catalogo_DEL_FechaCalendarioActividades,
            Catalogo_UPD_CalendarioActividades,

            //Reporte General
            Catalogo_SEL_ReporteGeneral,
            Catalogo_SEL_ReporteGeneralAnual,

            //Actividades
            Catalogo_SEL_ListaActividades,
            Catalogo_ADD_Actividad,
            Catalogo_DEL_Actividad,

            //Contactos
            Catalogo_SEL_ListaContactos,
            Catalogo_ADD_Contactos,
            Catalogo_DEL_Contactos,

            //Servicios Adicionales
            Catalogo_SEL_ListaServiciosAdicionales,
            Catalogo_ADD_ServicioAdicional,
            Catalogo_DEL_ServicioAdicional,
            Catalogo_UPD_ServicioAdicional,

            //Estatus
            Catalogo_SEL_ListaEstatus,
            Catalogo_ADD_Estatus,
            Catalogo_DEL_Estatus,

            //Otros Gastos
            Catalogo_SEL_ListaOtrosGastos,
            Catalogo_ADD_OtroGasto,
            Catalogo_SEL_EliminarOtroGasto,

            //Formatos
            Catalogo_SEL_ListaFormatos,
            Catalogo_ADD_Formato,
            Catalogo_DEL_Formato,


            //Actividades Calendario
            Catalogo_SEL_ListaActividadesCalendario,
            Catalogo_ADD_ActividadCalendario,

            Catalogo_SEL_ListaActividadesProduccion,
            Catalogo_ADD_ActividadProduccion,

            Catalogo_UPD_FichaTecnica,
            Catalogo_SEL_FichaTecnica,
            Catalogo_SEL_Cliente,


            //Tramites
            Catalogo_SEL_ListaTramites,
            Catalogo_SEL_ListaTramitesIMSS,
            Catalogo_ADD_DocumentoTramite,


            //Notificaciones
            Catalogo_SEL_ListaNotificaciones,
            Catalogo_ADD_Notificacion,
            Catalogo_DEL_Notificacion,
            Catalogo_ADD_DocumentoNotificacion,


            //Prospectos
            Catalogo_SEL_ListaProspectos,
            Catalogo_ADD_Prospecto,
            Catalogo_UPD_Prospecto,

            //Seguimiento
            Catalogo_SEL_ListaSeguimiento,
            Catalogo_ADD_Seguimiento,
            Catalogo_DEL_Seguimiento,



        }
        #endregion

        #region Propiedades

        public P_Clientes p_Clientes { get; set; }
        public Result result { get; set; }

        #endregion

        #region Constructores
        public DAL_Clientes()
        {
            p_Clientes = new P_Clientes();
            result = new Result();
        }
        #endregion


        #region Prospectos

        public void GetListaProspectos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaProspectos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de clientes", e);
            }
        }

        public void AddProspecto(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_Prospecto.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar cliente", e);
            }
        }

        public void UpdateProspecto(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_UPD_Prospecto.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al actualizar el usuario", e);
            }
        }

        #endregion

        #region Seguimiento

        public void GetSeguimiento(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaSeguimiento.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de contactos", e);
            }
        }

        public void AddSeguimiento(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_Seguimiento.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar un contacto", e);
            }
        }

        public void DeleteSeguimiento(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_DEL_Seguimiento.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar un contacto", e);
            }
        }


        #endregion

        #region Clientes

        public void GetListaClientes(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaClientes.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de clientes", e);
            }
        }

        public void GetListaClientesLinea(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaClientesLinea.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de clientes por línea", e);
            }
        }

        public void AddCliente(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_Cliente.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar cliente", e);
            }
        }

        public void UpdateCliente(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_UPD_Cliente.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al actualizar el usuario", e);
            }
        }

        public void DeleteCliente(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_DEL_Cliente.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar el usuario", e);
            }
        }

        #endregion

        #region RIF

        public void GetXMLEmitidos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_XMLEmitidos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de XML Emitidos", e);
            }
        }

        public void GetXMLRecibidos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_XMLRecibidos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de XML Recibidos", e);
            }
        }

        public void GetXMLIngresos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_XMLIngresos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de XML Ingresos", e);
            }
        }

        public void GetXMLEgresos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_XMLEgresos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de XML Egresos", e);
            }
        }

        public void GetXMLDPersonales(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_XMLDPersonales.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de XML Ingresos", e);
            }
        }

        public void GetXMLNominas(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_XMLNominas.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de XML Egresos", e);
            }
        }

        public void GetXMLSueldos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_XMLSueldos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de XML Egresos", e);
            }
        }

        public void GetXMLDepreciaciones(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_XMLDepreciaciones.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de XML Egresos", e);
            }
        }

        public void GetXMLNoDeducible(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_XMLNoDeducible.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de XML Egresos", e);
            }
        }

        public void GetClienteRIF(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_GET_ClienteRIF.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener datos del cliente [RIF]", e);
            }
        }

        public void SaveClienteRIF(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_UPD_ClienteRIF.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al actualizar datos del cliente [RIF]", e);
            }
        }

        public void GetDatosClienteTecnica(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_FichaTecnica.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener los datos de la ficha técnica", e);
            }
        }

        public void UpdateClienteTecnica(string jsonJS, HttpRequestBase request, string path, int? id_cliente = null)
        {
            result = new Result();
            dynamic url = new ExpandoObject();
            string fileNamePDF = "";
            
            try
            {
                if (id_cliente == null) throw new Exception("Favor de indicar el id_cliente");

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_UPD_FichaTecnica.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();

                if (result.status != 0) throw new Exception(result.msnError);

                foreach (string file in request.Files)
                {
                    var fileContent = request.Files[file];
                    if (fileContent != null && fileContent.ContentLength > 0)
                    {

                        var stream = fileContent.InputStream;
                        var fileName = Guid.NewGuid().ToString() + ".docx";
                        fileNamePDF = id_cliente.ToString() + ".pdf";

                        var pathDoc = Path.Combine(path, fileName);
                        using (var fileStream = System.IO.File.Create(pathDoc))
                        {
                            stream.CopyTo(fileStream);
                        }
                        Word.Application appWord = new Word.Application();
                        wordDocument = appWord.Documents.Open(pathDoc);
                        string pathPDF = Path.Combine(path, fileNamePDF);

                        wordDocument.ExportAsFixedFormat(pathPDF, Word.WdExportFormat.wdExportFormatPDF);
                        wordDocument.Close();

                        try
                        {
                            File.Delete(pathDoc);
                        }
                        catch (Exception){ throw; }

                        //fileNamePDF = fileNamePDF;
                    }
                }

                result.status = 0;
                result.resultStoredProcedure.status = 0;
                result.resultStoredProcedure.msnSuccess = fileNamePDF;

            }
            catch (Exception e)
            {
                result.setErrorExeption("Al generar ficha técnica", e);
                if (wordDocument != null)
                {
                    wordDocument.Close();
                }
            }
        }

        public Word.Document wordDocument { get; set; }

        public void UpdateServicioAdicional(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_UPD_ServicioAdicional.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al actualizar servicio adicional", e);
            }
        }

        #endregion

        #region Repositorio Clientes
        public void GetRepositorio(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaRepositorio.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de repositorio del cliente", e);
            }
        }

        public void GetDocumentosDigitales(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaDocumentosDigitales.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de documentos digitales del cliente", e);
            }
        }



        public void AddRepositorios(string jsonJS, HttpRequestBase request, string path)
        {
            result = new Result();

            try
            {
                var fileName = string.Empty;

                foreach (string file in request.Files)
                {
                    var fileContent = request.Files[file];
                    if (fileContent != null && fileContent.ContentLength > 0)
                    {
                        //! Nombre del archivo
                        fileName = Guid.NewGuid() + Path.GetExtension(fileContent.FileName);

                        dynamic data = new ExpandoObject();
                        data = JsonConvert.DeserializeObject(jsonJS);
                        String id_cliente = data.id_cliente;
                        //! Carpeta
                        var ruta = Path.Combine(path, id_cliente);
                        if (!Directory.Exists(ruta)) Directory.CreateDirectory(ruta);

                        //! Ruta completa
                        ruta = Path.Combine(ruta, fileName);
                        fileContent.SaveAs(ruta);

                        p_Clientes.nombre_archivo = fileName;
                    }
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_Repositorio.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar archivo al repositorio", e);
            }
        }

        public void AddRepositoriosC(string jsonJS, HttpRequestBase request, string path)
        {
            result = new Result();

            try
            {
                var fileName = string.Empty;

                foreach (string file in request.Files)
                {
                    var fileContent = request.Files[file];
                    if (fileContent != null && fileContent.ContentLength > 0)
                    {
                        //! Nombre del archivo
                        fileName = Guid.NewGuid() + Path.GetExtension(fileContent.FileName);

                        dynamic data = new ExpandoObject();
                        data = JsonConvert.DeserializeObject(jsonJS);
                        String id_cliente = data.rfc;
                        //! Carpeta
                        var ruta = Path.Combine(path, id_cliente);
                        if (!Directory.Exists(ruta)) Directory.CreateDirectory(ruta);

                        //! Ruta completa
                        ruta = Path.Combine(ruta, fileName);
                        fileContent.SaveAs(ruta);

                        p_Clientes.nombre_archivo = fileName;
                    }
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_RepositorioC.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar archivo al repositorio", e);
            }
        }

        public void UpdRepositorios(string jsonJS, string path)
        {
            result = new Result();

            try
            {
                dynamic data = new ExpandoObject();
                data = JsonConvert.DeserializeObject(jsonJS);
                String nombre_archivo = data.nombre_archivo;
                String id_cliente = data.id_cliente;
                var ruta = Path.Combine(path, id_cliente);
                ruta = Path.Combine(ruta, nombre_archivo);

                //! Por el momento no se debe eliminar los registros
                //if (File.Exists(ruta))
                //{
                //    File.Delete(ruta);
                //}

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_UPD_Repositorio.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar archivo del repositorio", e);
            }
        }

        public void EliminarRepositorio(string jsonJS, string path)
        {
            result = new Result();

            try
            {
                dynamic data = new ExpandoObject();
                data = JsonConvert.DeserializeObject(jsonJS);
                String nombre_archivo = data.nombre_archivo;
                String id_cliente = data.id_cliente;
                var ruta = Path.Combine(path, id_cliente);
                ruta = Path.Combine(ruta, nombre_archivo);

                //!Por el momento no se debe eliminar los registros
                if (File.Exists(ruta))
                {
                    File.Delete(ruta);
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_DEL_Repositorio.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar archivo del repositorio", e);
            }
        }


        #endregion

        #region Repositorio Nomina Clientes
        public void GetRepositorioNomina(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaRepositorioNomina.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de repositorio nominas del cliente", e);
            }
        }

        public void GetDocumentosNomina(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaDocumentosNomina.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de los entregables de nomina del cliente", e);
            }
        }

        public void AddRepositoriosNomina(string jsonJS, HttpRequestBase request, string path)
        {
            result = new Result();

            try
            {
                var fileName = string.Empty;

                foreach (string file in request.Files)
                {
                    var fileContent = request.Files[file];
                    if (fileContent != null && fileContent.ContentLength > 0)
                    {
                        //! Nombre del archivo
                        fileName = Guid.NewGuid() + Path.GetExtension(fileContent.FileName);

                        dynamic data = new ExpandoObject();
                        data = JsonConvert.DeserializeObject(jsonJS);
                        String id_cliente = data.id_cliente;
                        //! Carpeta
                        var ruta = Path.Combine(path, id_cliente);
                        if (!Directory.Exists(ruta)) Directory.CreateDirectory(ruta);

                        //! Ruta completa
                        ruta = Path.Combine(ruta, fileName);
                        fileContent.SaveAs(ruta);

                        p_Clientes.nombre_archivo = fileName;
                    }
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_RepositorioNomina.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar archivo al repositorio nomina", e);
            }
        }

        public void AddRepositoriosNomina2(string jsonJS, HttpRequestBase request, string path)
        {
            result = new Result();

            try
            {
                var fileName = string.Empty;

                foreach (string file in request.Files)
                {
                    var fileContent = request.Files[file];
                    if (fileContent != null && fileContent.ContentLength > 0)
                    {
                        //! Nombre del archivo
                        fileName = Guid.NewGuid() + Path.GetExtension(fileContent.FileName);

                        dynamic data = new ExpandoObject();
                        data = JsonConvert.DeserializeObject(jsonJS);
                        String id_cliente = data.id_cliente;
                        //! Carpeta
                        var ruta = Path.Combine(path, id_cliente);
                        if (!Directory.Exists(ruta)) Directory.CreateDirectory(ruta);

                        //! Ruta completa
                        ruta = Path.Combine(ruta, fileName);
                        fileContent.SaveAs(ruta);

                        p_Clientes.nombre_archivo = fileName;
                    }
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_RepositorioNomina2.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar archivo al repositorio nomina", e);
            }
        }

        public void UpdRepositoriosNomina(string jsonJS, string path)
        {
            result = new Result();

            try
            {
                dynamic data = new ExpandoObject();
                data = JsonConvert.DeserializeObject(jsonJS);
                String nombre_archivo = data.nombre_archivo;
                String id_cliente = data.id_cliente;
                var ruta = Path.Combine(path, id_cliente);
                ruta = Path.Combine(ruta, nombre_archivo);

                //! Por el momento no se debe eliminar los registros
                //if (File.Exists(ruta))
                //{
                //    File.Delete(ruta);
                //}

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_UPD_RepositorioNomina.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar archivo del repositorio nomina", e);
            }
        }

        public void EliminarRepositorioNomina(string jsonJS, string path)
        {
            result = new Result();

            try
            {
                dynamic data = new ExpandoObject();
                data = JsonConvert.DeserializeObject(jsonJS);
                String nombre_archivo = data.nombre_archivo;
                String id_cliente = data.id_cliente;
                var ruta = Path.Combine(path, id_cliente);
                ruta = Path.Combine(ruta, nombre_archivo);

                //!Por el momento no se debe eliminar los registros
                if (File.Exists(ruta))
                {
                    File.Delete(ruta);
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_DEL_RepositorioNomina.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar archivo del repositorio nomina", e);
            }
        }


        #endregion

        #region Entregables Clientes
        public void GetEntregables(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaEntregables.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de entregables del cliente", e);
            }
        }

        public void AddEntregables(string jsonJS, HttpRequestBase request, string path)
        {
            result = new Result();

            try
            {
                var fileName = string.Empty;

                foreach (string file in request.Files)
                {
                    var fileContent = request.Files[file];
                    if (fileContent != null && fileContent.ContentLength > 0)
                    {
                        //! Nombre del archivo
                        fileName = Guid.NewGuid() + Path.GetExtension(fileContent.FileName);

                        dynamic data = new ExpandoObject();
                        data = JsonConvert.DeserializeObject(jsonJS);
                        String id_cliente = data.id_cliente;
                        //! Carpeta
                        var ruta = Path.Combine(path, id_cliente);
                        if (!Directory.Exists(ruta)) Directory.CreateDirectory(ruta);

                        //! Ruta completa
                        ruta = Path.Combine(ruta, fileName);
                        fileContent.SaveAs(ruta);

                        p_Clientes.nombre_archivo = fileName;
                    }
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_Entregables.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar archivo al entregable", e);
            }
        }

        public void UpdEntregables(string jsonJS, string path)
        {
            result = new Result();

            try
            {
                dynamic data = new ExpandoObject();
                data = JsonConvert.DeserializeObject(jsonJS);
                String nombre_archivo = data.nombre_archivo;
                String id_cliente = data.id_cliente;
                var ruta = Path.Combine(path, id_cliente);
                ruta = Path.Combine(ruta, nombre_archivo);

                //! Por el momento no se debe eliminar los registros
                //if (File.Exists(ruta))
                //{
                //    File.Delete(ruta);
                //}

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_UPD_Entregables.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar archivo del repositorio nomina", e);
            }
        }

        public void EliminarEntregables(string jsonJS, string path)
        {
            result = new Result();

            try
            {
                dynamic data = new ExpandoObject();
                data = JsonConvert.DeserializeObject(jsonJS);
                String nombre_archivo = data.nombre_archivo;
                String id_cliente = data.id_cliente;
                var ruta = Path.Combine(path, id_cliente);
                ruta = Path.Combine(ruta, nombre_archivo);

                //!Por el momento no se debe eliminar los registros
                if (File.Exists(ruta))
                {
                    File.Delete(ruta);
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_DEL_Entregables.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar archivo del repositorio nomina", e);
            }
        }


        #endregion

        #region Estados Cuenta Clientes
        public void GetEstadosCuenta(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaEstadosCuenta.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de estados de cuenta del cliente", e);
            }
        }

        public void AddEstadoCuenta(string jsonJS, HttpRequestBase request, string path)
        {
            result = new Result();

            try
            {
                var fileName = string.Empty;

                foreach (string file in request.Files)
                {
                    var fileContent = request.Files[file];
                    if (fileContent != null && fileContent.ContentLength > 0)
                    {
                        //! Nombre del archivo
                        fileName = Guid.NewGuid() + Path.GetExtension(fileContent.FileName);

                        dynamic data = new ExpandoObject();
                        data = JsonConvert.DeserializeObject(jsonJS);
                        String id_cliente = data.rfc;
                        //! Carpeta
                        var ruta = Path.Combine(path, id_cliente);
                        if (!Directory.Exists(ruta)) Directory.CreateDirectory(ruta);

                        //! Ruta completa
                        ruta = Path.Combine(ruta, fileName);
                        fileContent.SaveAs(ruta);

                        p_Clientes.nombre_archivo = fileName;
                    }
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_EstadoCuenta.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar archivo del estado de cuenta", e);
            }
        }

        public void AddEstadoCuentaC(string jsonJS, HttpRequestBase request, string path)
        {
            result = new Result();

            try
            {
                var fileName = string.Empty;

                foreach (string file in request.Files)
                {
                    var fileContent = request.Files[file];
                    if (fileContent != null && fileContent.ContentLength > 0)
                    {
                        //! Nombre del archivo
                        fileName = Guid.NewGuid() + Path.GetExtension(fileContent.FileName);

                        dynamic data = new ExpandoObject();
                        data = JsonConvert.DeserializeObject(jsonJS);
                        String id_cliente = data.rfc;
                        //! Carpeta
                        var ruta = Path.Combine(path, id_cliente);
                        if (!Directory.Exists(ruta)) Directory.CreateDirectory(ruta);

                        //! Ruta completa
                        ruta = Path.Combine(ruta, fileName);
                        fileContent.SaveAs(ruta);

                        p_Clientes.nombre_archivo = fileName;
                    }
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_EstadoCuentaC.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar archivo del estado de cuenta", e);
            }
        }

        public void EliminarEstadoCuenta(string jsonJS, string path)
        {
            result = new Result();

            try
            {
                dynamic data = new ExpandoObject();
                data = JsonConvert.DeserializeObject(jsonJS);
                String nombre_archivo = data.nombre_archivo;
                String id_cliente = data.id_cliente;
                var ruta = Path.Combine(path, id_cliente);
                ruta = Path.Combine(ruta, nombre_archivo);

                //!Por el momento no se debe eliminar los registros
                if (File.Exists(ruta))
                {
                    File.Delete(ruta);
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_DEL_EstadoCuenta.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar archivo del estado de cuenta", e);
            }
        }


        #endregion

        #region Estados Cuenta Clientes
        public void GetNotificaciones(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaNotificaciones.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de notificaciones del cliente", e);
            }
        }

        public void AddDocumentoNotificacion(string jsonJS, HttpRequestBase request, string path)
        {
            result = new Result();

            try
            {
                var fileName = string.Empty;

                foreach (string file in request.Files)
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

                        p_Clientes.nombre_archivo = fileName;
                    }
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_DocumentoNotificacion.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar archivos de notificación del cliente", e);
            }
        }

        public void AddNotificacion(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_Notificacion.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Alcargar notificación del cliente", e);
            }
        }
           


        public void EliminarNotificacion(string jsonJS, string path)
        {
            result = new Result();

            try
            {
                //dynamic data = new ExpandoObject();
                //data = JsonConvert.DeserializeObject(jsonJS);
                //String nombre_archivo = data.nombre_archivo;
                //String id_cliente = data.id_cliente;
                //var ruta = Path.Combine(path, id_cliente);
                //ruta = Path.Combine(ruta, nombre_archivo);

                ////!Por el momento no se debe eliminar los registros
                //if (File.Exists(ruta))
                //{
                //    File.Delete(ruta);
                //}

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_DEL_Notificacion.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar notificación del cliente", e);
            }
        }


        #endregion

        #region OtrosServicios Clientes
        public void GetOtrosServicios(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaOtrosServicios.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de entregables otros servicios del cliente", e);
            }
        }

        public void AddOtrosServicios(string jsonJS, HttpRequestBase request, string path)
        {
            result = new Result();

            try
            {
                var fileName = string.Empty;

                foreach (string file in request.Files)
                {
                    var fileContent = request.Files[file];
                    if (fileContent != null && fileContent.ContentLength > 0)
                    {
                        //! Nombre del archivo
                        fileName = Guid.NewGuid() + Path.GetExtension(fileContent.FileName);

                        dynamic data = new ExpandoObject();
                        data = JsonConvert.DeserializeObject(jsonJS);
                        String id_cliente = data.id_cliente;
                        //! Carpeta
                        var ruta = Path.Combine(path, id_cliente);
                        if (!Directory.Exists(ruta)) Directory.CreateDirectory(ruta);

                        //! Ruta completa
                        ruta = Path.Combine(ruta, fileName);
                        fileContent.SaveAs(ruta);

                        p_Clientes.nombre_archivo = fileName;
                    }
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_OtrosServicios.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar archivo al entregable de otro servicio", e);
            }
        }

       

        public void EliminarOtrosServicios(string jsonJS, string path)
        {
            result = new Result();

            try
            {
                dynamic data = new ExpandoObject();
                data = JsonConvert.DeserializeObject(jsonJS);
                String nombre_archivo = data.nombre_archivo;
                String id_cliente = data.id_cliente;
                var ruta = Path.Combine(path, id_cliente);
                ruta = Path.Combine(ruta, nombre_archivo);

                //!Por el momento no se debe eliminar los registros
                if (File.Exists(ruta))
                {
                    File.Delete(ruta);
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_DEL_OtrosServicios.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar archivo de otro servicio", e);
            }
        }


        #endregion

        #region Set Fecha Pago

        public void SetFechaPago(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SET_FechaPago.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de XML Emitidos", e);
            }
        }
        #endregion

        #region Set Estatus XML

        public void SetEstatusXML(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SET_EstatusXML.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al cambiar el estatus del XML", e);
            }
        }
        #endregion

        #region Valida SAT

        public void ValidaSAT(string jsonJS, string estatus, string efos)
        {
            result = new Result();

            try
            {

                dynamic data = new ExpandoObject();
                data = JsonConvert.DeserializeObject(jsonJS);
                data.estatus = estatus.ToUpper();
                data.efos = (efos == "100" ? 1 : 0);
                jsonJS = JsonConvert.SerializeObject(data);
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SET_EstatusSAT.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al cambiar estatus del XML", e);
            }
        }

        public void ValidaSATWS(string jsonJS, string estatus, string efos)
        {
            result = new Result();

            try
            {

                dynamic data = new ExpandoObject();
                data = JsonConvert.DeserializeObject(jsonJS);
                data.estatus = estatus.ToUpper();
                data.efos = (efos == "100" ? 1 : 0);
                jsonJS = JsonConvert.SerializeObject(data);
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SET_EstatusSATWS.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.EjecutarValidacion();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al cambiar estatus del XML", e);
            }
        }


        #endregion

        #region Deposito Clientes
        public void GetDeposito(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaDeposito.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de depositos del cliente", e);
            }
        }

        public void AddDeposito(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_Deposito.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar deposito al cliente", e);
            }
        }

        public void EliminarDeposito(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_EliminarDeposito.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar deposito al cliente", e);
            }
        }


        #endregion

        #region Pagos Clientes
        public void GetPagos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaPagos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de pagos del cliente", e);
            }
        }

        public void AddPagos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_Pago.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar pago del cliente", e);
            }
        }

        public void EliminarPago(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_EliminarPago_RIF.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener bimestres RIF del cliente", e);
            }
        }


        #endregion

        #region Pagos Clientes ISR
        public void GetPagosISR(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaPagos_ISR.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de pagos del cliente", e);
            }
        }

        public void AddPagosISR(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_Pago_ISR.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar pago del cliente", e);
            }
        }

        public void EliminarPagoISR(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_EliminarPago_RIF_ISR.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener bimestres RIF del cliente", e);
            }
        }

        #endregion

        #region BimestresRIF

        public void GetBimestresRIF(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_Bimestres_RIF.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener bimestres RIF del cliente", e);
            }
        }

        #endregion

        #region Recalcular RIF

        public void RecalcularRIF(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_Recalcular_RIF.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener bimestres RIF del cliente", e);
            }
        }

        public void RecalcularRIFISR(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_Recalcular_RIF_ISR.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener bimestres RIF del cliente", e);
            }
        }

        #endregion

        #region Activo Fijo

        public void GetActivoFijo(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaActivoFijo.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de depositos del cliente", e);
            }
        }

        public void AddActivoFijo(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_ActivoFijo.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar deposito al cliente", e);
            }
        }

        public void EliminarActivoFijo(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_EliminarActivoFijo.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar deposito al cliente", e);
            }
        }

        #endregion

        #region Conceptos
        public void GetConceptos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaConceptos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de conceptos", e);
            }
        }
        
        public void GetCliente(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_Cliente.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener el cliente", e);
            }
        }

        #endregion

        #region Descarga Zip
        public void GetXMLZip(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_XMLZip.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de conceptos", e);
            }
        }

        public void GetXMLZipCRMIngresos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_XMLZipCRMIngresos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener url ingresos cliente", e);
            }
        }

        public void GetXMLZipCRMGastos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_XMLZipCRMGastos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener url gastos cliente", e);
            }
        }


        #endregion

        #region Cancelados

        public void GetXMLCancelados(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_GetXMLCancelados.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de XML Cancelados", e);
            }
        }


        #endregion

        #region ReportesEntregables

        public void GetReporteEntregablesRIF(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteEntregablesRIF.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de entregables del RIF", e);
            }
        }

        public void GetReporteEntregablesArrendamiento(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteEntregablesArrendamiento.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de entregables de Arrendamiento", e);
            }
        }

        public void GetReporteEntregablesHonorarios(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteEntregablesHonorarios.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de entregables de Honorarios", e);
            }
        }

        public void GetReporteEntregablesPFAE(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteEntregablesPFAE.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de entregables de PFAE", e);
            }
        }

        public void GetReporteEntregablesPM(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteEntregablesPM.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de entregables de PM", e);
            }
        }

        public void GetReporteEntregablesAsesoria(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteEntregablesAsesoria.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de entregables de Asesoria", e);
            }
        }

        public void GetReporteEntregablesCOI(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteEntregablesCOI.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de entregables de COI", e);
            }
        }

        public void GetReporteEntregablesEDO(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteEntregablesEDO.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de entregables de estado financiero", e);
            }
        }

        public void GetReporteEntregablesSueldos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteEntregablesSueldos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de entregables de sueldos y salarios", e);
            }
        }
        

        #endregion

        #region ReportesExpediente

        public void GetReporteExpedienteFiscalRIF(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteExpedienteFiscalRIF.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de expediente fiscal RIF", e);
            }
        }

        public void GetReporteExpedienteFiscalPFAE(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteExpedienteFiscalPFAE.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de expediente fiscal PFAE", e);
            }
        }

        public void GetReporteExpedienteFiscalPM(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteExpedienteFiscalPM.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de expediente fiscal PM", e);
            }
        }

        public void GetReporteExpedienteFiscalArrendamiento(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteExpedienteFiscalArrendamiento.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de expediente fiscal Arrendamiento", e);
            }
        }

        public void GetReporteExpedienteFiscalHonorarios(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteExpedienteFiscalHonorarios.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de expediente fiscal Honorarios", e);
            }
        }

        public void GetReporteExpedienteFiscalSueldos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteExpedienteFiscalSueldos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de expediente fiscal Sueldos y Salarios", e);
            }
        }

        public void GetReportePropuestasEconomicas(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReportePropuestasEconomicas.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de propuestas economicas", e);
            }
        }

        

        #endregion

        #region Calendario Actividades

        public void GetCalendarioLP1(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_CalendarioActividadesLP1.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener calendario de actividades LP1", e);
            }
        }

        public void GetCalendario(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_CalendarioActividades.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener calendario de actividades", e);
            }
        }


        public void SetActividadesProduccion(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_UPD_CalendarioActividades.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al actualizar avance de la actividad del calendario", e);
            }
        }

        

        public void AgregarFechaCalendario(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_FechaCalendarioActividades.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar fecha al calendario de actividades", e);
            }
        }

        public void QuitarFechaCalendario(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_DEL_FechaCalendarioActividades.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al quitar fecha al calendario de actividades", e);
            }
        }

        #endregion

        #region Reportes Generales
        
        public void GetReporteGeneral(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteGeneral.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte general de ingresos y gastos", e);
            }
        }

        public void GetReporteGeneralAnual(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteGeneralAnual.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte general de ingresos y gastos anual", e);
            }
        }

        public void GetReporteEstadosCuenta(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.ReportesGenerales_SEL_EstadoCuenta.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de estados de cuenta", e);
            }
        }
        #endregion


        #region Actividades

        public void GetActividades(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaActividades.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de actividades", e);
            }
        }

        public void AddActividad(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_Actividad.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar una actividad", e);
            }
        }

        public void DeleteActividad(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_DEL_Actividad.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar una actividad", e);
            }
        }


        #endregion

        #region Servicios Adicionales

        public void GetServiciosAdicionales(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaServiciosAdicionales.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de servicios adicionales", e);
            }
        }

        public void AddServicioAdicional(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_ServicioAdicional.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar un servicio adicional", e);
            }
        }

        public void DeleteServicioAdicional(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_DEL_ServicioAdicional.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar un servicio adicional", e);
            }
        }


        #endregion

        #region Estatus

        public void GetEstatus(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaEstatus.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de estatus", e);
            }
        }

        public void AddEstatus(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_Estatus.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar un estatus", e);
            }
        }

        public void DeleteEstatus(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_DEL_Estatus.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar un estatus", e);
            }
        }


        #endregion

        #region Contactos

        public void GetContactos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaContactos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de contactos", e);
            }
        }

        public void AddContactos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_Contactos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar un contacto", e);
            }
        }

        public void DeleteContactos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_DEL_Contactos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar un contacto", e);
            }
        }


        #endregion

        #region Otros Gastos Clientes
        public void GetOtrosGastos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaOtrosGastos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de otros gastos del cliente", e);
            }
        }

        public void AddOtroGasto(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_OtroGasto.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar otro gasto al cliente", e);
            }
        }

        public void EliminarOtroGasto(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_EliminarOtroGasto.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar otro gasto al cliente", e);
            }
        }


        #endregion

        #region Formatos

        public void GetFormatos(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaFormatos.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de formatos y plantillas", e);
            }
        }
        public void AddFormato(string jsonJS, HttpRequestBase request, string path)
        {
            result = new Result();

            try
            {
                var fileName = string.Empty;

                foreach (string file in request.Files)
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

                        p_Clientes.nombre_archivo = fileName;
                    }
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_Formato.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar archivo a formatos y plantillas", e);
            }
        }

        
        public void EliminarFormato(string jsonJS, string path)
        {
            result = new Result();

            try
            {
                dynamic data = new ExpandoObject();
                data = JsonConvert.DeserializeObject(jsonJS);
                String nombre_archivo = data.nombre_archivo;
                
                var ruta = Path.Combine(path, "");
                ruta = Path.Combine(ruta, nombre_archivo);

                //!Por el momento no se debe eliminar los registros
                if (File.Exists(ruta))
                {
                    File.Delete(ruta);
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_DEL_Formato.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al eliminar archivo de formatos y plantillas", e);
            }
        }

        #endregion

        #region Calendario de Actividades

        public void GetActividadesCalendario(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaActividadesCalendario.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de actividades calendario", e);
            }
        }
        public void AddActividadesCalendario(string jsonJS)
        {
            result = new Result();

            try
            {               

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_ActividadCalendario.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar actividad al calendario", e);
            }
        }


        public void GetActividadesProduccion(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaActividadesProduccion.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de actividades calendario Produccion", e);
            }
        }
        public void AddActividadesProduccion(string jsonJS)
        {
            result = new Result();

            try
            {

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_ActividadProduccion.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar actividad al calendario Produccion", e);
            }
        }


        #endregion



        #region Nominas

        public void GetReporteEntregablesNomina(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ReporteEntregablesNomina.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener reporte de entregables de Nomina", e);
            }
        }

        #endregion


        #region Tramites

        public void GetListaTramites(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaTramites.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de trámites", e);
            }
        }

        public void GetListaTramitesIMSS(string jsonJS)
        {
            result = new Result();

            try
            {
                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_SEL_ListaTramitesIMSS.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al obtener lista de trámites", e);
            }
        }

        
        public void AddDocumentoTramite(string jsonJS, HttpRequestBase request, string path)
        {
            result = new Result();

            try
            {
                var fileName = string.Empty;

                foreach (string file in request.Files)
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

                        p_Clientes.nombre_archivo = fileName;
                    }
                }

                //! Ejecutar stored procedure
                StoredProcedure storedProcedure = new StoredProcedure(Procedimientos.Catalogo_ADD_DocumentoTramite.ToString(), p_Clientes, jsonJS);
                storedProcedure.InicializarStored();
                result = storedProcedure.Ejecutar();
            }
            catch (Exception e)
            {
                result.setErrorExeption("Al agregar archivo al tramite", e);
            }
        }



        #endregion
    }
}