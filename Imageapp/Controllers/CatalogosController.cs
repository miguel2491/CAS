﻿using Imageapp.Models.DAL;
using Imageapp.Models.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


using OfficeOpenXml;
using OfficeOpenXml.Table;
using System.Data;
using Excel;
using System.IO;
using System.Drawing;
using System.Dynamic;
using Newtonsoft.Json;
using System.Threading.Tasks;
using Imageapp.Models;
using Imageapp.Datos;
using System.Net.Mail;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Net.Security;
using System.Globalization;
//using Word = Microsoft.Office.Interop.Word;

namespace Imageapp.Controllers
{
    public class CatalogosController : Controller
    {
        Result result = new Result();

        #region Clientes
        [SessionAuthorize]
        public ActionResult ListaClientes()
        {
            if (!ValidarAccesoVista("Catalogos", "ListaClientes"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        [SessionAuthorize]
        public ActionResult ListaClientesLinea()
        {
            if (!ValidarAccesoVista("Catalogos", "ListaClientesLinea"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        [SessionAuthorize]
        public ActionResult ImpuestosCliente(string frs_id_cliente, string frs_id_regimen, string frs_rfc, string frs_nombre_razon)
        {
            if (!ValidarAccesoVista("Catalogos", "ImpuestosCliente"))
                return RedirectToAction("Inicio", "Inicio");

            TempData["id_cliente"] = frs_id_cliente;
            TempData["id_regimen"] = frs_id_regimen;
            TempData["rfc"] = frs_rfc;
            TempData["nombre_razon"] = frs_nombre_razon;

            switch (frs_id_regimen)
            {
                case "1":
                    return RedirectToAction("ClienteRIF");
                case "2":
                    return RedirectToAction("ClienteArrendamiento");
                default:
                    return RedirectToAction("Inicio", "Inicio");
            }
        }


        [SessionAuthorize]
        public ActionResult ClienteRIF()
        {
            if (!ValidarAccesoVista("Catalogos", "ClienteRIF"))
                return RedirectToAction("Inicio", "Inicio");

            if (TempData["id_cliente"] != null && TempData["id_regimen"] != null)
            {
                ViewBag.id_cliente = TempData["id_cliente"];
                ViewBag.nombre_razon = TempData["nombre_razon"];
                ViewBag.rfc = TempData["rfc"];
                return View();
            }
            else
            {
                return RedirectToAction("Inicio", "Inicio");
            }

        }

        [SessionAuthorize]
        public ActionResult ClienteArrendamiento()
        {
            if (!ValidarAccesoVista("Catalogos", "ClienteArrendamiento"))
                return RedirectToAction("Inicio", "Inicio");

            if (TempData["id_cliente"] != null && TempData["id_regimen"] != null)
            {
                ViewBag.id_cliente = TempData["id_cliente"];
                ViewBag.nombre_razon = TempData["nombre_razon"];
                ViewBag.rfc = TempData["rfc"];
                return View();
            }
            else
            {
                return RedirectToAction("Inicio", "Inicio");
            }

        }


        public string GetClientes(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetListaClientes(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string GetClientesLinea(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetListaClientesLinea(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string AddCliente(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.p_Clientes.id_RVA = id_RVA;
            dAL_Clientes.AddCliente(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string UpdateCliente(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.p_Clientes.id_RVA = id_RVA;
            dAL_Clientes.UpdateCliente(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string DeleteCliente(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.p_Clientes.id_RVA = id_RVA;
            dAL_Clientes.DeleteCliente(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }


        public string GetXMLEmitidos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetXMLEmitidos(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string GetXMLRecibidos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetXMLRecibidos(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string GetXMLIngresos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetXMLIngresos(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string GetXMLEgresos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetXMLEgresos(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string GetXMLDPersonales(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetXMLDPersonales(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string GetXMLNominas(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetXMLNominas(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string GetXMLSueldos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetXMLSueldos(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string GetXMLDepreciaciones(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetXMLDepreciaciones(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string GetXMLNoDeducible(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetXMLNoDeducible(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }




        public string GetClienteRIF(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetClienteRIF(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string SaveClienteRIF(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.SaveClienteRIF(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string GetDatosClienteTecnica(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetDatosClienteTecnica(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string UpdateClienteTecnica(string jsonJS, int? id_RV, int? id_cliente = null)
        {
            string path = Path.Combine(Server.MapPath("~/Documentos/FichaTecnica/"));

            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.UpdateClienteTecnica(jsonJS, Request, path, id_cliente);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string UpdateServicioAdicional(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.UpdateServicioAdicional(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        #endregion

        #region Repositorios Cliente
        public string GetRepositorio(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetRepositorio(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        public string GetDocumentosDigitales(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetDocumentosDigitales(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        //[HttpPost]
        public string AddRepositorio(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/Repositorio");
            dAL_Clientes.AddRepositorios(jsonJS, Request, path);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string UpdRepositorio(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/Repositorio");
            dAL_Clientes.UpdRepositorios(jsonJS, path);
            return dAL_Clientes.result.returnToJsonString();
        }


        public string EliminarRepositorio(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/Repositorio");
            dAL_Clientes.EliminarRepositorio(jsonJS, path);
            return dAL_Clientes.result.returnToJsonString();
        }

        #endregion

        #region Repositorios Nomina Cliente
        public string GetRepositorioNomina(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetRepositorioNomina(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        public string GetDocumentosNomina(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetDocumentosNomina(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        //[HttpPost]
        public string AddRepositorioNomina(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/RepositorioNomina");
            dAL_Clientes.AddRepositoriosNomina(jsonJS, Request, path);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string AddRepositorioNomina2(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/Entregables");
            dAL_Clientes.AddRepositoriosNomina2(jsonJS, Request, path);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string UpdRepositorioNomina(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/RepositorioNomina");
            dAL_Clientes.UpdRepositoriosNomina(jsonJS, path);
            return dAL_Clientes.result.returnToJsonString();
        }


        public string EliminarRepositorioNomina(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/RepositorioNomina");
            dAL_Clientes.EliminarRepositorioNomina(jsonJS, path);
            return dAL_Clientes.result.returnToJsonString();
        }

        #endregion

        #region Entregables cliente
        public string GetEntregables(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetEntregables(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        //[HttpPost]
        public string AddEntregables(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/Entregables");
            dAL_Clientes.AddEntregables(jsonJS, Request, path);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string UpdEntregables(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/Entregables");
            dAL_Clientes.UpdEntregables(jsonJS, path);
            return dAL_Clientes.result.returnToJsonString();
        }


        public string EliminarEntregables(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/Entregables");
            dAL_Clientes.EliminarEntregables(jsonJS, path);
            return dAL_Clientes.result.returnToJsonString();
        }

        #endregion

        #region Estados de Cuenta cliente
        public string GetEstadosCuenta(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetEstadosCuenta(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        //[HttpPost]
        public string AddEstadoCuenta(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/EstadoCuenta");
            dAL_Clientes.AddEstadoCuenta(jsonJS, Request, path);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string EliminarEstadoCuenta(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/EstadoCuenta");
            dAL_Clientes.EliminarEstadoCuenta(jsonJS, path);
            return dAL_Clientes.result.returnToJsonString();
        }

        #endregion

        #region Notificaciones
        public string GetNotificaciones(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetNotificaciones(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        //[HttpPost]
        public string AddNotificacion(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
           
            dAL_Clientes.AddNotificacion(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string AddDocumentoNotificacion(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/Notificaciones");
            dAL_Clientes.AddDocumentoNotificacion(jsonJS, Request, path);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string EliminarNotificacion(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/EstadoCuenta");
            dAL_Clientes.EliminarNotificacion(jsonJS, path);
            return dAL_Clientes.result.returnToJsonString();
        }

        #endregion

        #region Set Fecha Pago

        public string SetFechaPago(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.SetFechaPago(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }


        public string SendCorreo(Int32 id_cliente, Int32 mes, Int32 periodo, int? id_RV)
        {
            try
            {

            
            String[] meses = { "", "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE" };
            DB_MenuEntities db = new DB_MenuEntities();
            string cuerpo = "";
            var cliente = db.tbc_Clientes.Where(s => s.id_cliente == id_cliente).SingleOrDefault();
            if (cliente != null)
            {
                tbr_Cliente_Usuario relacion = db.tbr_Cliente_Usuario.Where(s => s.id_cliente == cliente.id_cliente).SingleOrDefault();
                if (relacion != null)
                {
                    var usuario_cliente = db.tbc_Usuarios.Where(s => s.id_usuario == relacion.id_usuario).SingleOrDefault();
                    if (usuario_cliente != null)
                    {
                        if (usuario_cliente.correo_electronico != "")
                        {
                            cuerpo = @"
                                                                                    <center>



                                                                                    <div style='width:700px; text-align:left; background-size: 100% 100%; background-image: url(""data:image/png;base64,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D7z+4MTK6AoQIECAAAECBAhsTkDg3Zy1mwgQIECAAAECBLYgsFDgfeSRR5776G8e/coW+nQlAQIECBAgQIAAgaUEFgq8KaV/zE3+m6VucogAAQIECBAgQIDAFgQWCryTOLm5yc01W+jTlQQIECBAgAABAgSWElg08N7T5ObIUjc5RIAAAQIECBAgQGALAnMH3mPHjl169MjRO7fQoysJECBAgAABAgQILC0wd+A9fvz4NYcPHb556ZscJECAAAECBAgQILAFgbkDb13X765C9Y4t9OhKAgQIECBAgAABAksLzB14U51+mEO+YumbHCRAgAABAgQIECCwBYG5A2/0F9a2sB5XEiBAgAABAgQIrCog8K4q6DwBAgQIECBAgEDRAnMF3r29R567M/IX1orepOYIECBAgAABAgTOKTBX4I1x+qGQZ29iSIAAAQIECBAgQKBrAnMF3nqv/mo1qv60a8PplwABAgQIECBAgMBcgTfV6c4c8qW4CBAgQIAAAQIECHRN4MDAm3PeTTHd37XB9EuAAAECBAgQIEDgtMCBgXc8zleMqvRDXAQIECBAgAABAgS6KHBg4H2kfuT5j4ZHv9TF4fRMgAABAgQIECBA4MDAG2P8SMjhDagIECBAgAABAgQIdFHgwMCb6vSjHPKTuzicngkQIECAAAECBAgcGHj9SWEvCQECBAgQIECAQJcFBN4ub0/vBAgQIECAAAECBwpcMPCePHny8t2d3dsPrOIBAgQIECBAgAABAoUKXDDwTqfT1872Zx8rtHdtESBAgAABAgQIEDhQ4IKBN8b46ZDDyw+s4gECBAgQIECAAAEChQpcMPBO4uSmJjfXFtq7tggQIECAAAECBAgcKHDBwJtiujvnfPGBVTxAgAABAgQIECBAoFCB8wbenPNuiun+QvvWFgECBAgQIECAAIG5BM4beMfj8RWjavTDuap4iAABAgQIECBAgEChAucNvKdOnLpuf3f/m4X2rS0CBAgQIECAAAECcwmcN/DGvfjGMAofnquKhwgQIECAAAECBAgUKnD+wBsnnw25eWmhfWuLAAECBAgQIECAwFwC5w+8dXxwrgoeIkCAAAECBAgQIFCwgMBb8HK0RoAAAQIECBAgsLqAwLu6oQoECBAgQIAAAQIFCwi8BS9HawQIECBAgAABAqsLnDPwjsfj542q0ZdXL68CAQIE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"");'>

                                                                                        <img style='width:100%;' src='data:image/png;base64,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' /><br /><br />


                                                                                        <div style='width:100%; text-align:right;'>
                                                                                            <h4>" + DateTime.Now.ToString("dd") + " DE " + meses[DateTime.Now.Month] +" "+ DateTime.Now.ToString("yyyy") + @" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h4>
                                                                                        </div>
                                                                                        <br />
                                                                                        <div style='width:100%; padding-left:40px; padding-right:45px;'>

                                                                                        <h3>Estimado Cliente:</h3>
                                                                                        <h5> " + cliente.nombre_razon + @"</h5>
                                                                                        <h5>RFC: " + cliente.rfc + @"</h5>
                                                                                        
                                                                                        <p style='text-align:justify; padding-right:45px;'>
A lo largo de los últimos años nos hemos destacado por buscar siempre la satisfacción de nuestros clientes a través de mejorar la calidad de los servicios 
que otorgamos; motivo por el cual requerimos siempre trabajar en conjunto.<br><br>

Solicitamos su apoyo para subir su información contable del mes de <b>"+ meses[mes] +@" "+ periodo + @"</b>, a nuestra plataforma Digital: 
<a href='http://castelanauditores.com/Castelan/'>http://castelanauditores.com/Castelan/</a> Ingresando con su usuario y contraseña, que la consultoría le proporciono, 
en el apartado de:
</p>
<ul style = 'padding-right:45px;'>
<li>Estado de cuenta, campo de “<b>consulta de movimientos del mes.</b>”</li>
</ul>

<p style='color: #20A9E5;'>En caso de no poder enviarlo sea tan amable de darnos aviso por este mismo medio.</p>
<p style='text-align:justify; padding-right:45px;'>
Podemos por medio de la página del SAT descargar todas las facturas emitidas y recibidas del mes, sin embargo, requerimos de lo siguiente para alcanzar el nivel de 
satisfacción que diariamente buscamos:<br><br>

Carpeta con terminación .ZIP con el siguiente contenido:

<ul style = 'list-style-type: decimal; padding-right:45px;'>
<li>Estado de cuenta Bancario Fiscal o bien, el Estado de movimientos bancarios completo y posteriormente hacernos llegar el Estado de cuenta bancario fiscal cuando lo 
obtenga</li>
<li>Papel de trabajo con controles internos, en caso de llevar un control de bancos y clientes internos.</li>
</ul>

Cada mes subsecuente al cierre del periodo fiscal provisional usted recibirá:

<ul style = 'padding-right:45px;'>
<li>Los días 10: línea de captura para el pago de cuotas obrero-patronales, en caso de existir.</li>
<li>Del día 15 al 21: línea de captura del pago de impuestos del periodo correspondiente.</li>
</ul>

<p style='text-align:justify; padding-right:45px;'>
Para cumplir adecuadamente con las fechas estipuladas en el párrafo anterior, es importante cumplir con las fechas de recepción de su información, si ésta sucede 
después del día 6 del mes subsecuente, representa para nuestros clientes un riesgo de pago en cuanto a recargos y actualizaciones, mismas que quedarían bajo su 
responsabilidad.<br><br>

Agradecemos la atención que sirva prestar al presente.
                                                                                        </p>

                                                                                            <br /><br />

                                                                                        </div>
                                                                                    <center>

                                                                                            <h3>Atentamente:</h3>                                                                                            

                                                                                            <h3>CASTELÁN AUDITORES SC</h3>


                                                                                    </center>
                                                                                        <br /><br /> <br />
                                                                              <img style='width:100%;' src='data:image/png;base64,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' /><br /><br />

                                                                                    </div>
                                                                                </center>";



                            /***NUEVO CORREO ****/


                            //        cuerpo = @"
                            //                                                                               <center>

                            //        <p>Si no puede ver el contenido de este correo, de clic <a href='http://castelanauditores.com/img/madre/index.html' target='_blank'>aqui</a></p>
                            //        <br /><br />

                            //        <div style='width:700px; '>
                            //                                                            <img src='http://castelanauditores.com/img/mail/top.png' style='width:500px;' />
                            //<br /><br />
                            //<img src='http://castelanauditores.com/img/madre/ilustracion.png' style='width:700px;' />
                            //<br /><br />
                            //<img src='http://castelanauditores.com/img/madre/texto.png' style='width:700px;' />
                            //<br /><br />
                            //<img src='http://castelanauditores.com/img/madre/ilustracion_2.png' style='width:700px;' />
                            //<br /><br />

                            //<a href='http://castelanauditores.com/' target='_blank'><img src='http://castelanauditores.com/img/mail/boton.png' style='width:150px;' /></a>
                            //<br /><br />

                            //<a href='https://wa.me/5222224306602' target='_blank'><img src='http://castelanauditores.com/img/mail/boton_w.png' style='width:50px;' /></a>
                            //<br />
                            //<a href='https://www.facebook.com/castelanauditoresmx' target='_blank'><img src='http://castelanauditores.com/img/mail/boton_f.png' style='width:50px;' /> </a>
                            //<br />
                            //<a href='https://www.linkedin.com/company/73499029/admin/' target='_blank'><img src='http://castelanauditores.com/img/mail/boton_l.png' style='width:50px;' /></a>
                            //<br />
                            //<a href='https://www.instagram.com/castelanauditoresmx/' target='_blank'><img src='http://castelanauditores.com/img/mail/boton_i.png' style='width:50px;' /></a>
                            //<br />
                            //<a href='https://twitter.com/castelanconsult?lang=es' target='_blank'><img src='http://castelanauditores.com/img/mail/boton_t.png' style='width:50px;' /></a>
                            //<br />

                            //                                                               </div>





                            //                                                        </center>

                            //                                                            ";







                            try
                            {
                                string email = "contabilidad@consultoriacastelan.com";
                                //String email = "comunicados@facturafast.mx";

                                MailMessage msg = new MailMessage();
                                string DireccionaEnviar = usuario_cliente.correo_electronico;
                                msg.To.Add(DireccionaEnviar);
                                msg.From = new MailAddress(email, "CASTELÁN AUDITORES S.C.", System.Text.Encoding.UTF8);
                                //msg.From = new MailAddress("comunicados@facturafast.mx", "FACTURAFAST ", System.Text.Encoding.UTF8);

                                msg.Subject = "Solicitud de estado de cuenta.";
                                msg.SubjectEncoding = System.Text.Encoding.UTF8;
                                msg.Body =
                                @"<!DOCTYPE html>
                <html>
                <head>
                    <title>CASTELAN</title>
                    <meta charset='utf-8' />
                </head>
                <body>
                    " + cuerpo + @"
                </body>
                </html>";
                                /*Archivo adjunto*/
                                //Attachment data = new Attachment("C:/Salarios Minimos Generales y Profesionales 2022.pdf", MediaTypeNames.Application.Pdf);
                                //msg.Attachments.Add(data);
                                /*****************/
                                msg.BodyEncoding = System.Text.Encoding.UTF8;
                                msg.IsBodyHtml = true;

                                SmtpClient client = new SmtpClient();
                                client.Credentials = new NetworkCredential(email, "29tR#+54thfq");

                                client.Port = 587;
                                client.Host = "mail.consultoriacastelan.com";
                                client.EnableSsl = false;
                                ServicePointManager.ServerCertificateValidationCallback = delegate (object s, X509Certificate certificate, X509Chain chai, SslPolicyErrors sslPolicyErrors)
                                { return true; };

                                //if (item.correo != "danae.zarate@consultoriacastelan.com")
                                //{
                                client.Send(msg);
                                //}                    
                            }
                            catch (Exception excp)
                            {
                                string error = excp.Message;
                            }
                            finally
                            {
                                GC.Collect();
                            }

                        }
                    }
                }
            }
            return "";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        #endregion

        #region Set Estatus XML

        public string SetEstatusXML(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.SetEstatusXML(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }


        #endregion

        #region Valida SAT

        public void ValidaSAT(string jsonJS, int? id_RV, string rfcEmisor, string rfcReceptor, string uuid, decimal total, decimal total_original, string moneda)
        {

            String FolioFiscal = "";
            String Estatus = "";
            String CodigoEstatus = "";
            String ValidacionEFOS = "";
            ValidaEstatusSATCFDI validaEstatusSATCFDI = new ValidaEstatusSATCFDI();

            decimal total_enviar = (moneda != "MXN" ? total_original : total);

            validaEstatusSATCFDI.ValidaEstatus(rfcEmisor, rfcReceptor, total_enviar, uuid, out FolioFiscal, out Estatus, out CodigoEstatus, out ValidacionEFOS);

            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;


            dAL_Clientes.ValidaSAT(jsonJS, Estatus, ValidacionEFOS);
            //return dAL_Clientes.result.returnToJsonString();

        }


        #endregion

        #region Depositos Cliente

        public string GetDeposito(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetDeposito(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        //[HttpPost]
        public string AddDeposito(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.AddDeposito(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }


        public string EliminarDeposito(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.EliminarDeposito(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        #endregion

        #region Pagos Cliente

        public string GetPagos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetPagos(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        //[HttpPost]
        public string AddPagos(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.AddPagos(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string EliminarPago(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.EliminarPago(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }
        #endregion

        #region Pagos Cliente ISR

        public string GetPagosISR(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetPagosISR(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        //[HttpPost]
        public string AddPagosISR(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.AddPagosISR(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string EliminarPagoISR(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.EliminarPagoISR(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }
        #endregion

        #region Bimestres RIF

        public string GetBimestresRIF(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetBimestresRIF(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        #endregion

        #region Recalcular RIF

        public string RecalcularRIF(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.RecalcularRIF(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string RecalcularRIFISR(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.RecalcularRIFISR(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }



        #endregion

        #region ActivoFijo

        public string GetActivoFijo(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetActivoFijo(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        //[HttpPost]
        public string AddActivoFijo(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.AddActivoFijo(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }


        public string EliminarActivoFijo(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.EliminarActivoFijo(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        #endregion

        #region Actividades

        public string GetActividades(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetActividades(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        public string AddActividad(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.AddActividad(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string DeleteActividad(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.DeleteActividad(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        #endregion

        #region Estatus

        public string GetEstatus(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetEstatus(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        public string AddEstatus(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.AddEstatus(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string DeleteEstatus(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.DeleteEstatus(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        #endregion

        #region Servicios Adicionales

        public string GetServiciosAdicionales(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetServiciosAdicionales(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        public string AddServicioAdicional(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.AddServicioAdicional(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string DeleteServicioAdicional(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.DeleteServicioAdicional(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        #endregion

        #region Contactos

        public string GetContactos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetContactos(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        public string AddContactos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.AddContactos(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string DeleteContactos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.DeleteContactos(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        #endregion

        #region Otros Gastos Cliente

        public string GetOtrosGastos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetOtrosGastos(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        //[HttpPost]
        public string AddOtroGasto(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.AddOtroGasto(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }


        public string EliminarOtroGasto(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.EliminarOtroGasto(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        #endregion

        #region Contraseñas Cliente
        [SessionAuthorize]
        public ActionResult ListaContraseñas()
        {
            if (!ValidarAccesoVista("Catalogos", "ListaContraseñas"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }
        #endregion

        #region Formatos y Plantillas

        [SessionAuthorize]
        public ActionResult FormatosPlantillas()
        {
            if (!ValidarAccesoVista("Catalogos", "FormatosPlantillas"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetFormatos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetFormatos(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }


        public string AddFormato(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/Formatos");
            dAL_Clientes.AddFormato(jsonJS, Request, path);
            return dAL_Clientes.result.returnToJsonString();
        }


        public string EliminarFormato(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/Formatos");
            dAL_Clientes.EliminarFormato(jsonJS, path);
            return dAL_Clientes.result.returnToJsonString();
        }


        #endregion

        public FileResult EntregablesRIF(string jsonJS, int? id_RV)
        {

            dynamic DatosJS = JsonConvert.DeserializeObject(jsonJS);


            var memoryStream = new MemoryStream();
            var excelPackage = new ExcelPackage(memoryStream);
            var worksheetIngresos = excelPackage.Workbook.Worksheets.Add("Ingresos");
            var worksheetEgresos = excelPackage.Workbook.Worksheets.Add("Egresos");
            var worksheetNominas = excelPackage.Workbook.Worksheets.Add("Nominas");
            var worksheetNoDeducibles = excelPackage.Workbook.Worksheets.Add("NoDeducibles");
            var worksheetDepreciacion = excelPackage.Workbook.Worksheets.Add("Depreciacion");

            Int32 empieza = 10;



            var img = System.Drawing.Image.FromFile(Server.MapPath("~/Imagenes/logo.jpg"));
            var pie = System.Drawing.Image.FromFile(Server.MapPath("~/Imagenes/pie.jpg"));

            worksheetIngresos.Drawings.AddPicture("logo", img).SetPosition(0, 0, 0, 0);
            worksheetEgresos.Drawings.AddPicture("logo", img).SetPosition(0, 0, 0, 0);
            worksheetNominas.Drawings.AddPicture("logo", img).SetPosition(0, 0, 0, 0);
            worksheetNoDeducibles.Drawings.AddPicture("logo", img).SetPosition(0, 0, 0, 0);
            worksheetDepreciacion.Drawings.AddPicture("logo", img).SetPosition(0, 0, 0, 0);

            //worksheetIngresos.Cells[empieza, 1].Style.Font.SetFromFont(new Font("Avenir Book", 16));

            //! Ingresos
            worksheetIngresos.Cells[empieza, 1].Value = Convert.ToString(DatosJS.fl_nombre_razon);
            worksheetIngresos.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetIngresos.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetIngresos.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#071B64"));
            worksheetIngresos.Cells[empieza, 1].Style.Font.Size = 16;
            worksheetIngresos.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetIngresos.Cells[empieza, 1, empieza, 21].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetIngresos.Cells[empieza, 1, empieza, 21].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetIngresos.Cells[empieza, 1, empieza, 21].Merge = true;
            empieza++;

            worksheetIngresos.Cells[empieza, 1].Value = Convert.ToString(DatosJS.fl_rfc);
            worksheetIngresos.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetIngresos.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetIngresos.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#071B64"));
            worksheetIngresos.Cells[empieza, 1].Style.Font.Size = 12;
            worksheetIngresos.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetIngresos.Cells[empieza, 1, empieza, 21].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetIngresos.Cells[empieza, 1, empieza, 21].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetIngresos.Cells[empieza, 1, empieza, 21].Merge = true;
            empieza++;

            worksheetIngresos.Cells[empieza, 1].Value = "RÉGIMEN DE INCORPORACIÓN FISCAL";
            worksheetIngresos.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetIngresos.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetIngresos.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#01818F"));
            worksheetIngresos.Cells[empieza, 1].Style.Font.Size = 12;
            worksheetIngresos.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetIngresos.Cells[empieza, 1, empieza, 21].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetIngresos.Cells[empieza, 1, empieza, 21].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetIngresos.Cells[empieza, 1, empieza, 21].Merge = true;
            empieza++;

            worksheetIngresos.Cells[empieza, 1].Value = "CUADRO DE INGRESOS";
            worksheetIngresos.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetIngresos.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetIngresos.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#071B64"));
            worksheetIngresos.Cells[empieza, 1].Style.Font.Size = 12;
            worksheetIngresos.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetIngresos.Cells[empieza, 1, empieza, 21].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetIngresos.Cells[empieza, 1, empieza, 21].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetIngresos.Cells[empieza, 1, empieza, 21].Merge = true;
            empieza++;

            List<String> encabezadosIngresos = new List<String> { "Estado SAT", "Tipo", "Fecha Emisión", "Fecha Timbrado", "Serie",
                "Folio", "UUID", "RFC Receptor", "Nombre Receptor", "UsoCFDI", "SubTotal", "Descuento", "SubTotal Neto", "IVA 16%", "Retenido IVA",
            "Retenido ISR", "Total", "Form de ePago", "Método de Pago", "Conceptos", "Fecha Aplicación Pago"};
            List<Int32> widthEncabezadosIngresos = new List<Int32> { 15, 15, 25, 25, 10, 10, 25, 20, 20, 15, 15, 15, 15,
            15,15,15,15,15,15,25,25};
            worksheetIngresos.Row(empieza).Height = 40;
            for (int i = 0; i < encabezadosIngresos.Count; i++)
            {
                worksheetIngresos.Column(i + 1).Width = widthEncabezadosIngresos[i];
                worksheetIngresos.Cells[empieza, i + 1].Value = encabezadosIngresos[i];
                worksheetIngresos.Cells[empieza, i + 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                worksheetIngresos.Cells[empieza, i + 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Bottom;
                worksheetIngresos.Cells[empieza, i + 1].Style.WrapText = true;
                worksheetIngresos.Cells[empieza, i + 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
                worksheetIngresos.Cells[empieza, i + 1].Style.Font.Size = 12;
                worksheetIngresos.Cells[empieza, i + 1].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                worksheetIngresos.Cells[empieza, i + 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#015174"));
            }

            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetXMLIngresos(jsonJS);

            dynamic SuccessIngresos = JsonConvert.DeserializeObject(dAL_Clientes.result.returnToJsonString());

            Int32 estatus = Convert.ToInt32(SuccessIngresos.status);
            Int32 estatus_sp = Convert.ToInt32(SuccessIngresos.resultStoredProcedure.status);

            if (estatus == 0 && estatus_sp == 0)
            {
                dynamic ListaIngresos = new ExpandoObject();
                if (dAL_Clientes.result.resultStoredProcedure.msnSuccess != null)
                {
                    ListaIngresos = JsonConvert.DeserializeObject(dAL_Clientes.result.resultStoredProcedure.msnSuccess);
                    foreach (var item in ListaIngresos)
                    {
                        var a = item;
                        empieza++;
                        List<String> lista = new List<String> { "estatus", "tipo", "fecha", "fecha_timbrado", "seria",
                        "folio", "UUID", "RFCReceptor", "nombre_receptor", "usoCFDI", "subtotal", "descuento", "subtotal_neto", "impuesto_trasladado",
                        "retencion_iva", "retencion_isr", "total", "forma_pago", "metodo_pago", "conceptos", "fecha_pago"};

                        for (int i = 0; i < lista.Count; i++)
                        {
                            if (lista[i] == "subtotal" ||
                                lista[i] == "descuento" ||
                                lista[i] == "subtotal_neto" ||
                                lista[i] == "impuesto_trasladado" ||
                                lista[i] == "retencion_iva" ||
                                lista[i] == "retencion_isr" ||
                                lista[i] == "total")
                            {
                                Decimal valor = 0;
                                if (Decimal.TryParse(Convert.ToString(item[lista[i]]), out valor))
                                {
                                    worksheetIngresos.Cells[empieza, i + 1].Value = valor;
                                    worksheetIngresos.Cells[empieza, i + 1].Style.Numberformat.Format = "$ #,##0.00";
                                }
                                else
                                {
                                    worksheetIngresos.Cells[empieza, i + 1].Value = Convert.ToString(item[lista[i]]);
                                }
                            }
                            else
                            {
                                worksheetIngresos.Cells[empieza, i + 1].Value = Convert.ToString(item[lista[i]]);
                            }

                        }

                    }
                }

            }

            empieza++; empieza++;
            worksheetIngresos.Drawings.AddPicture("pie", pie).SetPosition(empieza, 0, 2, 0);

            //! Egresos

            empieza = 10;

            worksheetEgresos.Cells[empieza, 1].Value = Convert.ToString(DatosJS.fl_nombre_razon);
            worksheetEgresos.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetEgresos.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetEgresos.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#071B64"));
            worksheetEgresos.Cells[empieza, 1].Style.Font.Size = 16;
            worksheetEgresos.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetEgresos.Cells[empieza, 1, empieza, 21].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetEgresos.Cells[empieza, 1, empieza, 21].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetEgresos.Cells[empieza, 1, empieza, 21].Merge = true;
            empieza++;

            worksheetEgresos.Cells[empieza, 1].Value = Convert.ToString(DatosJS.fl_rfc);
            worksheetEgresos.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetEgresos.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetEgresos.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#071B64"));
            worksheetEgresos.Cells[empieza, 1].Style.Font.Size = 12;
            worksheetEgresos.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetEgresos.Cells[empieza, 1, empieza, 21].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetEgresos.Cells[empieza, 1, empieza, 21].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetEgresos.Cells[empieza, 1, empieza, 21].Merge = true;
            empieza++;

            worksheetEgresos.Cells[empieza, 1].Value = "RÉGIMEN DE INCORPORACIÓN FISCAL";
            worksheetEgresos.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetEgresos.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetEgresos.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#01818F"));
            worksheetEgresos.Cells[empieza, 1].Style.Font.Size = 12;
            worksheetEgresos.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetEgresos.Cells[empieza, 1, empieza, 21].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetEgresos.Cells[empieza, 1, empieza, 21].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetEgresos.Cells[empieza, 1, empieza, 21].Merge = true;
            empieza++;

            worksheetEgresos.Cells[empieza, 1].Value = "CUADRO DE EGRESOS";
            worksheetEgresos.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetEgresos.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetEgresos.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#071B64"));
            worksheetEgresos.Cells[empieza, 1].Style.Font.Size = 12;
            worksheetEgresos.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetEgresos.Cells[empieza, 1, empieza, 21].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetEgresos.Cells[empieza, 1, empieza, 21].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetEgresos.Cells[empieza, 1, empieza, 21].Merge = true;
            empieza++;

            List<String> encabezadosEgresos = new List<String> { "Estado SAT", "Tipo", "Fecha Emisión", "Fecha Timbrado", "Serie",
                "Folio", "UUID", "RFC Emisor", "Nombre Emisor", "UsoCFDI", "SubTotal", "Descuento", "SubTotal Neto", "IVA 16%", "Retenido IVA",
            "Retenido ISR", "Total", "Forma de Pago", "Método de Pago", "Conceptos", "Fecha Aplicación Pago"};
            List<Int32> widthEncabezadosEgresos = new List<Int32> { 15, 15, 25, 25, 10, 10, 25, 20, 20, 15, 15, 15, 15,
            15,15,15,15,15,15,25,25};
            worksheetEgresos.Row(empieza).Height = 40;
            for (int i = 0; i < encabezadosEgresos.Count; i++)
            {
                worksheetEgresos.Column(i + 1).Width = widthEncabezadosEgresos[i];
                worksheetEgresos.Cells[empieza, i + 1].Value = encabezadosEgresos[i];
                worksheetEgresos.Cells[empieza, i + 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                worksheetEgresos.Cells[empieza, i + 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Bottom;
                worksheetEgresos.Cells[empieza, i + 1].Style.WrapText = true;
                worksheetEgresos.Cells[empieza, i + 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
                worksheetEgresos.Cells[empieza, i + 1].Style.Font.Size = 12;
                worksheetEgresos.Cells[empieza, i + 1].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                worksheetEgresos.Cells[empieza, i + 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#015174"));
            }


            dAL_Clientes.GetXMLEgresos(jsonJS);

            dynamic SuccessEgresos = JsonConvert.DeserializeObject(dAL_Clientes.result.returnToJsonString());

            estatus = Convert.ToInt32(SuccessEgresos.status);
            estatus_sp = Convert.ToInt32(SuccessEgresos.resultStoredProcedure.status);

            if (estatus == 0 && estatus_sp == 0)
            {
                dynamic ListaEgresos = new ExpandoObject();
                if (dAL_Clientes.result.resultStoredProcedure.msnSuccess != null)
                {
                    ListaEgresos = JsonConvert.DeserializeObject(dAL_Clientes.result.resultStoredProcedure.msnSuccess);
                    foreach (var item in ListaEgresos)
                    {
                        var a = item;
                        empieza++;
                        List<String> lista = new List<String> { "estatus", "tipo", "fecha", "fecha_timbrado", "seria",
                        "folio", "UUID", "RFCEmisor", "nombre_emisor", "usoCFDI", "subtotal", "descuento", "subtotal_neto", "impuesto_trasladado",
                        "retencion_iva", "retencion_isr", "total", "forma_pago", "metodo_pago", "conceptos", "fecha_pago"};

                        for (int i = 0; i < lista.Count; i++)
                        {
                            if (lista[i] == "subtotal" ||
                                lista[i] == "descuento" ||
                                lista[i] == "subtotal_neto" ||
                                lista[i] == "impuesto_trasladado" ||
                                lista[i] == "retencion_iva" ||
                                lista[i] == "retencion_isr" ||
                                lista[i] == "total")
                            {
                                Decimal valor = 0;
                                if (Decimal.TryParse(Convert.ToString(item[lista[i]]), out valor))
                                {
                                    worksheetEgresos.Cells[empieza, i + 1].Value = valor;
                                    worksheetEgresos.Cells[empieza, i + 1].Style.Numberformat.Format = "$ #,##0.00";
                                }
                                else
                                {
                                    worksheetEgresos.Cells[empieza, i + 1].Value = Convert.ToString(item[lista[i]]);
                                }
                            }
                            else
                            {
                                worksheetEgresos.Cells[empieza, i + 1].Value = Convert.ToString(item[lista[i]]);
                            }
                        }

                    }
                }

            }
            empieza++; empieza++;
            worksheetEgresos.Drawings.AddPicture("pie", pie).SetPosition(empieza, 0, 2, 0);


            //! Nomina

            empieza = 10;

            worksheetNominas.Cells[empieza, 1].Value = Convert.ToString(DatosJS.fl_nombre_razon);
            worksheetNominas.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetNominas.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetNominas.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#071B64"));
            worksheetNominas.Cells[empieza, 1].Style.Font.Size = 16;
            worksheetNominas.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetNominas.Cells[empieza, 1, empieza, 21].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetNominas.Cells[empieza, 1, empieza, 21].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetNominas.Cells[empieza, 1, empieza, 21].Merge = true;
            empieza++;

            worksheetNominas.Cells[empieza, 1].Value = Convert.ToString(DatosJS.fl_rfc);
            worksheetNominas.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetNominas.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetNominas.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#071B64"));
            worksheetNominas.Cells[empieza, 1].Style.Font.Size = 12;
            worksheetNominas.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetNominas.Cells[empieza, 1, empieza, 21].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetNominas.Cells[empieza, 1, empieza, 21].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetNominas.Cells[empieza, 1, empieza, 21].Merge = true;
            empieza++;

            worksheetNominas.Cells[empieza, 1].Value = "RÉGIMEN DE INCORPORACIÓN FISCAL";
            worksheetNominas.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetNominas.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetNominas.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#01818F"));
            worksheetNominas.Cells[empieza, 1].Style.Font.Size = 12;
            worksheetNominas.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetNominas.Cells[empieza, 1, empieza, 21].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetNominas.Cells[empieza, 1, empieza, 21].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetNominas.Cells[empieza, 1, empieza, 21].Merge = true;
            empieza++;

            worksheetNominas.Cells[empieza, 1].Value = "CONTROL DE NÓMINA";
            worksheetNominas.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetNominas.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetNominas.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#071B64"));
            worksheetNominas.Cells[empieza, 1].Style.Font.Size = 12;
            worksheetNominas.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetNominas.Cells[empieza, 1, empieza, 21].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetNominas.Cells[empieza, 1, empieza, 21].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetNominas.Cells[empieza, 1, empieza, 21].Merge = true;
            empieza++;

            List<String> encabezadosNomina = new List<String> { "Estado SAT", "Tipo", "Fecha Emision", "Fecha Timbrado", "Serie",
                "Folio", "UUID", "RFC Receptor", "Nombre Receptor", "Registro Patronal", "Tipo Nómina", "Fecha Pago", "Fecha Inicial Pago",
                "Fecha Final Pago", "Num Días Pagados", "Total Percepciones", "Total Deducciones", "Total Otros Pagos",
                "Subtotal", "Descuento", "ISR XML", "Total"};
            List<Int32> widthEncabezadosNomina = new List<Int32> { 15, 15, 25, 25, 10, 10, 25, 20, 20, 15, 15, 15, 15,
            15,15,15,15,15,15,25,25,15};
            worksheetNominas.Row(empieza).Height = 40;
            for (int i = 0; i < encabezadosNomina.Count; i++)
            {
                worksheetNominas.Column(i + 1).Width = widthEncabezadosNomina[i];
                worksheetNominas.Cells[empieza, i + 1].Value = encabezadosNomina[i];
                worksheetNominas.Cells[empieza, i + 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                worksheetNominas.Cells[empieza, i + 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Bottom;
                worksheetNominas.Cells[empieza, i + 1].Style.WrapText = true;
                worksheetNominas.Cells[empieza, i + 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
                worksheetNominas.Cells[empieza, i + 1].Style.Font.Size = 12;
                worksheetNominas.Cells[empieza, i + 1].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                worksheetNominas.Cells[empieza, i + 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#015174"));
            }


            dAL_Clientes.GetXMLNominas(jsonJS);

            dynamic SuccessNominas = JsonConvert.DeserializeObject(dAL_Clientes.result.returnToJsonString());

            estatus = Convert.ToInt32(SuccessNominas.status);
            estatus_sp = Convert.ToInt32(SuccessNominas.resultStoredProcedure.status);

            if (estatus == 0 && estatus_sp == 0)
            {
                dynamic ListaNominas = new ExpandoObject();
                if (dAL_Clientes.result.resultStoredProcedure.msnSuccess != null)
                {
                    ListaNominas = JsonConvert.DeserializeObject(dAL_Clientes.result.resultStoredProcedure.msnSuccess);
                    foreach (var item in ListaNominas)
                    {
                        var a = item;
                        empieza++;
                        List<String> lista = new List<String> { "estatus", "tipo", "fecha", "fecha_timbrado", "seria",
                        "folio", "UUID", "RFCReceptor", "nombre_receptor", "registropatronal", "tiponomina", "fechapago", "fechainicialpago",
                        "fechafinalpago", "numdiaspagados", "totalpercepciones", "totaldeducciones", "totalotrospagos", "subtotal", "descuento",
                        "isr_nomina", "Total"};

                        for (int i = 0; i < lista.Count; i++)
                        {
                            if (lista[i] == "totalpercepciones" ||
                               lista[i] == "totaldeducciones" ||
                               lista[i] == "totalotrospagos" ||
                               lista[i] == "subtotal" ||
                               lista[i] == "descuento" ||
                               lista[i] == "isr_nomina" ||
                               lista[i] == "total")
                            {
                                Decimal valor = 0;
                                if (Decimal.TryParse(Convert.ToString(item[lista[i]]), out valor))
                                {
                                    worksheetNominas.Cells[empieza, i + 1].Value = valor;
                                    worksheetNominas.Cells[empieza, i + 1].Style.Numberformat.Format = "$ #,##0.00";
                                }
                                else
                                {
                                    worksheetNominas.Cells[empieza, i + 1].Value = Convert.ToString(item[lista[i]]);
                                }
                            }
                            else
                            {
                                worksheetNominas.Cells[empieza, i + 1].Value = Convert.ToString(item[lista[i]]);
                            }
                        }

                    }

                }

            }

            empieza++; empieza++;
            worksheetNominas.Drawings.AddPicture("pie", pie).SetPosition(empieza, 0, 2, 0);

            //! NO DEDUCIBLE

            empieza = 10;

            worksheetNoDeducibles.Cells[empieza, 1].Value = Convert.ToString(DatosJS.fl_nombre_razon);
            worksheetNoDeducibles.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetNoDeducibles.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetNoDeducibles.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#071B64"));
            worksheetNoDeducibles.Cells[empieza, 1].Style.Font.Size = 16;
            worksheetNoDeducibles.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetNoDeducibles.Cells[empieza, 1, empieza, 21].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetNoDeducibles.Cells[empieza, 1, empieza, 21].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetNoDeducibles.Cells[empieza, 1, empieza, 21].Merge = true;
            empieza++;

            worksheetNoDeducibles.Cells[empieza, 1].Value = Convert.ToString(DatosJS.fl_rfc);
            worksheetNoDeducibles.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetNoDeducibles.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetNoDeducibles.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#071B64"));
            worksheetNoDeducibles.Cells[empieza, 1].Style.Font.Size = 12;
            worksheetNoDeducibles.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetNoDeducibles.Cells[empieza, 1, empieza, 21].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetNoDeducibles.Cells[empieza, 1, empieza, 21].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetNoDeducibles.Cells[empieza, 1, empieza, 21].Merge = true;
            empieza++;

            worksheetNoDeducibles.Cells[empieza, 1].Value = "RÉGIMEN DE INCORPORACIÓN FISCAL";
            worksheetNoDeducibles.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetNoDeducibles.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetNoDeducibles.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#01818F"));
            worksheetNoDeducibles.Cells[empieza, 1].Style.Font.Size = 12;
            worksheetNoDeducibles.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetNoDeducibles.Cells[empieza, 1, empieza, 21].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetNoDeducibles.Cells[empieza, 1, empieza, 21].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetNoDeducibles.Cells[empieza, 1, empieza, 21].Merge = true;
            empieza++;

            worksheetNoDeducibles.Cells[empieza, 1].Value = "DOCUMENTOS NO DEDUCIBLES";
            worksheetNoDeducibles.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetNoDeducibles.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetNoDeducibles.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#071B64"));
            worksheetNoDeducibles.Cells[empieza, 1].Style.Font.Size = 12;
            worksheetNoDeducibles.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetNoDeducibles.Cells[empieza, 1, empieza, 21].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetNoDeducibles.Cells[empieza, 1, empieza, 21].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetNoDeducibles.Cells[empieza, 1, empieza, 21].Merge = true;
            empieza++;

            List<String> encabezadosNoDeducibles = new List<String> { "Estado SAT", "Tipo", "Fecha Emisión", "Fecha Timbrado", "Serie",
                "Folio", "UUID", "RFC Emisor", "Nombre Emisor", "UsoCFDI", "SubTotal", "Descuento", "SubTotal Neto", "IVA 16%", "Retenido IVA",
            "Retenido ISR", "Total", "Forma de Pago", "Método de Pago", "Conceptos", "Fecha Aplicación Pago"};
            List<Int32> widthEncabezadosNoDeducibles = new List<Int32> { 15, 15, 25, 25, 10, 10, 25, 20, 20, 15, 15, 15, 15,
            15,15,15,15,15,15,25,25};
            worksheetNoDeducibles.Row(empieza).Height = 40;
            for (int i = 0; i < encabezadosEgresos.Count; i++)
            {
                worksheetNoDeducibles.Column(i + 1).Width = widthEncabezadosNoDeducibles[i];
                worksheetNoDeducibles.Cells[empieza, i + 1].Value = encabezadosNoDeducibles[i];
                worksheetNoDeducibles.Cells[empieza, i + 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                worksheetNoDeducibles.Cells[empieza, i + 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Bottom;
                worksheetNoDeducibles.Cells[empieza, i + 1].Style.WrapText = true;
                worksheetNoDeducibles.Cells[empieza, i + 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
                worksheetNoDeducibles.Cells[empieza, i + 1].Style.Font.Size = 12;
                worksheetNoDeducibles.Cells[empieza, i + 1].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                worksheetNoDeducibles.Cells[empieza, i + 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#015174"));
            }


            dAL_Clientes.GetXMLNoDeducible(jsonJS);

            dynamic SuccessNoDeducibles = JsonConvert.DeserializeObject(dAL_Clientes.result.returnToJsonString());

            estatus = Convert.ToInt32(SuccessNoDeducibles.status);
            estatus_sp = Convert.ToInt32(SuccessNoDeducibles.resultStoredProcedure.status);

            if (estatus == 0 && estatus_sp == 0)
            {
                dynamic ListaNoDeducibles = new ExpandoObject();
                if (dAL_Clientes.result.resultStoredProcedure.msnSuccess != null)
                {
                    ListaNoDeducibles = JsonConvert.DeserializeObject(dAL_Clientes.result.resultStoredProcedure.msnSuccess);
                    foreach (var item in ListaNoDeducibles)
                    {
                        var a = item;
                        empieza++;
                        List<String> lista = new List<String> { "estatus", "tipo", "fecha", "fecha_timbrado", "seria",
                        "folio", "UUID", "RFCEmisor", "nombre_emisor", "usoCFDI", "subtotal", "descuento", "subtotal_neto", "impuesto_trasladado",
                        "retencion_iva", "retencion_isr", "total", "forma_pago", "metodo_pago", "conceptos", "fecha_pago"};

                        for (int i = 0; i < lista.Count; i++)
                        {
                            if (lista[i] == "subtotal" ||
                               lista[i] == "descuento" ||
                               lista[i] == "subtotal_neto" ||
                               lista[i] == "impuesto_trasladado" ||
                               lista[i] == "retencion_iva" ||
                               lista[i] == "retencion_isr" ||
                               lista[i] == "total")
                            {
                                Decimal valor = 0;
                                if (Decimal.TryParse(Convert.ToString(item[lista[i]]), out valor))
                                {
                                    worksheetNoDeducibles.Cells[empieza, i + 1].Value = valor;
                                    worksheetNoDeducibles.Cells[empieza, i + 1].Style.Numberformat.Format = "$ #,##0.00";
                                }
                                else
                                {
                                    worksheetNoDeducibles.Cells[empieza, i + 1].Value = Convert.ToString(item[lista[i]]);
                                }
                            }
                            else
                            {
                                worksheetNoDeducibles.Cells[empieza, i + 1].Value = Convert.ToString(item[lista[i]]);
                            }
                        }

                    }
                }

            }
            empieza++; empieza++;
            worksheetNoDeducibles.Drawings.AddPicture("pie", pie).SetPosition(empieza, 0, 2, 0);


            //! DEPRECIACION

            empieza = 10;

            worksheetDepreciacion.Cells[empieza, 1].Value = Convert.ToString(DatosJS.fl_nombre_razon);
            worksheetDepreciacion.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetDepreciacion.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetDepreciacion.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#071B64"));
            worksheetDepreciacion.Cells[empieza, 1].Style.Font.Size = 16;
            worksheetDepreciacion.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetDepreciacion.Cells[empieza, 1, empieza, 9].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetDepreciacion.Cells[empieza, 1, empieza, 9].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetDepreciacion.Cells[empieza, 1, empieza, 9].Merge = true;
            empieza++;

            worksheetDepreciacion.Cells[empieza, 1].Value = Convert.ToString(DatosJS.fl_rfc);
            worksheetDepreciacion.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetDepreciacion.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetDepreciacion.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#071B64"));
            worksheetDepreciacion.Cells[empieza, 1].Style.Font.Size = 12;
            worksheetDepreciacion.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetDepreciacion.Cells[empieza, 1, empieza, 9].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetDepreciacion.Cells[empieza, 1, empieza, 9].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetDepreciacion.Cells[empieza, 1, empieza, 9].Merge = true;
            empieza++;

            worksheetDepreciacion.Cells[empieza, 1].Value = "RÉGIMEN DE INCORPORACIÓN FISCAL";
            worksheetDepreciacion.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetDepreciacion.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetDepreciacion.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#01818F"));
            worksheetDepreciacion.Cells[empieza, 1].Style.Font.Size = 12;
            worksheetDepreciacion.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetDepreciacion.Cells[empieza, 1, empieza, 9].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetDepreciacion.Cells[empieza, 1, empieza, 9].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetDepreciacion.Cells[empieza, 1, empieza, 9].Merge = true;
            empieza++;

            worksheetDepreciacion.Cells[empieza, 1].Value = "DEPRECIACIÓN";
            worksheetDepreciacion.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheetDepreciacion.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
            worksheetDepreciacion.Cells[empieza, 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#071B64"));
            worksheetDepreciacion.Cells[empieza, 1].Style.Font.Size = 12;
            worksheetDepreciacion.Cells[empieza, 1].Style.Font.Bold = true;
            worksheetDepreciacion.Cells[empieza, 1, empieza, 9].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheetDepreciacion.Cells[empieza, 1, empieza, 9].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
            worksheetDepreciacion.Cells[empieza, 1, empieza, 9].Merge = true;
            empieza++;

            List<String> encabezadosDepreciación = new List<String> { "No.", "Sigla", "Descripción", "Fecha Adquisición", "Fecha Baja",
                "MOI", "Depr. Acumulada", "Saldo por Reducir", "Reducción Mensual"};
            List<Int32> widthEncabezadosDepreciacion = new List<Int32> { 15, 15, 25, 25, 10, 10, 25, 20, 20 };
            worksheetDepreciacion.Row(empieza).Height = 40;
            for (int i = 0; i < encabezadosDepreciación.Count; i++)
            {
                worksheetDepreciacion.Column(i + 1).Width = widthEncabezadosDepreciacion[i];
                worksheetDepreciacion.Cells[empieza, i + 1].Value = encabezadosDepreciación[i];
                worksheetDepreciacion.Cells[empieza, i + 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                worksheetDepreciacion.Cells[empieza, i + 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Bottom;
                worksheetDepreciacion.Cells[empieza, i + 1].Style.WrapText = true;
                worksheetDepreciacion.Cells[empieza, i + 1].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#ffffff"));
                worksheetDepreciacion.Cells[empieza, i + 1].Style.Font.Size = 12;
                worksheetDepreciacion.Cells[empieza, i + 1].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                worksheetDepreciacion.Cells[empieza, i + 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#015174"));
            }


            //dAL_Clientes.GetXMLNoDeducible(jsonJS);

            //dynamic SuccessDepreciacion = JsonConvert.DeserializeObject(dAL_Clientes.result.returnToJsonString());

            //estatus = Convert.ToInt32(SuccessDepreciacion.status);
            //estatus_sp = Convert.ToInt32(SuccessDepreciacion.resultStoredProcedure.status);

            //if (estatus == 0 && estatus_sp == 0)
            //{
            //    dynamic ListaDepreciacion = new ExpandoObject();
            //    if (dAL_Clientes.result.resultStoredProcedure.msnSuccess != null)
            //    {
            //        ListaDepreciacion = JsonConvert.DeserializeObject(dAL_Clientes.result.resultStoredProcedure.msnSuccess);
            //        foreach (var item in ListaDepreciacion)
            //        {
            //            var a = item;
            //            empieza++;
            //            List<String> lista = new List<String> { "estatus", "tipo", "fecha", "fecha_timbrado", "seria",
            //            "folio", "UUID", "RFCReceptor", "nombre_receptor", "usoCFDI", "subtotal", "descuento", "subtotal_neto", "impuesto_trasladado",
            //            "retencion_iva", "retencion_isr", "total", "forma_pago", "metodo_pago", "conceptos", "fecha_pago"};

            //            for (int i = 0; i < lista.Count; i++)
            //            {
            //                worksheetDepreciacion.Cells[empieza, i + 1].Value = Convert.ToString(item[lista[i]]);
            //            }

            //        }
            //    }

            //}

            empieza++; empieza++;
            worksheetDepreciacion.Drawings.AddPicture("pie", pie).SetPosition(empieza, 0, 0, 0);

            var FileBytesArray = excelPackage.GetAsByteArray();

            return File(FileBytesArray, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Entregables_" + DatosJS.fl_rfc + ".xlsx");

        }
        
        #region Excel RIF

        [SessionAuthorize]
        [HttpPost]
        public ActionResult CierreAnual(string frs_id_cliente_2, string frs_rfc_2, string frs_nombre_razon_2, int frs_id_regimen_2)
        {
            if (!ValidarAccesoVista("Catalogos", "CierreAnual"))
                return RedirectToAction("Inicio", "Inicio");

            ViewBag.id_cliente = frs_id_cliente_2;
            ViewBag.nombre_razon = frs_nombre_razon_2;
            ViewBag.rfc = frs_rfc_2;
            ViewBag.id_regimen = frs_id_regimen_2;
            List<Balanzas> balanzas = new List<Balanzas>();
            if (Request.Files["file_Balanzas"] != null)
            {
                HttpPostedFileBase file = Request.Files["file_Balanzas"];
                using (var package = new ExcelPackage(file.InputStream))
                {                    
                    String[] Meses = { "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" };
                    foreach (var Mes in Meses)
                    {
                        var currentSheet = package.Workbook.Worksheets;
                        var workSheet = currentSheet[Mes];
                        int rowCount = workSheet.Dimension.End.Row;

                        for (int row = 2; row <= rowCount; row++)
                        {
                            if (workSheet.Cells[row, 1].Value != null)
                            {
                                String mes = Mes;
                                String cuenta = workSheet.Cells[row, 1].Value.ToString().Trim();
                                String descripcion = workSheet.Cells[row, 2].Value.ToString().Trim();
                                Decimal saldo_inicial = Convert.ToDecimal(workSheet.Cells[row, 3].Value.ToString().Trim());
                                Decimal debe = Convert.ToDecimal(workSheet.Cells[row, 4].Value.ToString().Trim());
                                Decimal haber = Convert.ToDecimal(workSheet.Cells[row, 5].Value.ToString().Trim());
                                Decimal saldo_final = Convert.ToDecimal(workSheet.Cells[row, 6].Value.ToString().Trim());
                                balanzas.Add(new Balanzas
                                {
                                    Cuenta = cuenta,
                                    Debe = debe,
                                    Descripcion = descripcion,
                                    Haber = haber,
                                    Mes = mes,
                                    Saldo_Final = saldo_final,
                                    Saldo_Inicial = saldo_inicial
                                });
                            }
                            else break;                            
                        }
                    }
                }
            }
            return View(balanzas);
        }

        

        #endregion

        #region Otros Serviios cliente
        public string GetOtrosServicios(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetOtrosServicios(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        //[HttpPost]
        public string AddOtrosServicios(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/OtrosServicios");
            dAL_Clientes.AddOtrosServicios(jsonJS, Request, path);
            return dAL_Clientes.result.returnToJsonString();
        }


        public string EliminarOtrosServicios(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/OtrosServicios");
            dAL_Clientes.EliminarOtrosServicios(jsonJS, path);
            return dAL_Clientes.result.returnToJsonString();
        }

        #endregion

        #region FUNCIONES PRIVADAS
        private bool ValidarAccesoVista(string controlador, string vista)
        {
            DAL_Utils dAL_Utils = new DAL_Utils();
            dAL_Utils.p_Utils.controlador = controlador;
            dAL_Utils.p_Utils.vista = vista;

            if (!dAL_Utils.ValidarAccesoVista())
            {
                TempData["Error"] = dAL_Utils.result.msnError;
                TempData["ErrorComplete"] = dAL_Utils.result.msnErrorComplete;
                return false;
            }

            ViewBag.id_RV = dAL_Utils.result.resultStoredProcedure.msnSuccess;

            return true;
        }

        public string GetCatalogos(string jsonJS)
        {
            DAL_Utils dAL_Utils = new DAL_Utils();
            dAL_Utils.GetCatalogos(jsonJS);
            return dAL_Utils.result.returnToJsonString();
        }

        public string GetPermisos(int? id_RV)
        {
            DAL_Utils dAL_Utils = new DAL_Utils();
            dAL_Utils.p_Utils.id_RV = id_RV;
            dAL_Utils.GetPermisos();
            return dAL_Utils.result.returnToJsonString();
        }
        #endregion 
    }
}