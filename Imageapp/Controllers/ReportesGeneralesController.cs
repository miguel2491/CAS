using Imageapp.Models.DAL;
using Imageapp.Models.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Imageapp.Controllers
{
    public class ReportesGeneralesController : Controller
    {
        [SessionAuthorize]
        public ActionResult ConcentradoAnual()
        {
            if (!ValidarAccesoVista("ReportesGenerales", "ConcentradoAnual"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetReporteGeneral(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteGeneral(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult ConcentradoMensual()
        {
            if (!ValidarAccesoVista("ReportesGenerales", "ConcentradoMensual"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }
        
        public string GetReporteGeneralAnual(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteGeneralAnual(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult EstadosCuenta()
        {
            if (!ValidarAccesoVista("ReportesGenerales", "EstadosCuenta"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetReporteEstadosCuenta(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteEstadosCuenta(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

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