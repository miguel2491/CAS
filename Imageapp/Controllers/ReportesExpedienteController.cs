using Imageapp.Models.DAL;
using Imageapp.Models.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Imageapp.Controllers
{
    public class ReportesExpedienteController : Controller
    {
        [SessionAuthorize]
        public ActionResult ExpedienteFiscalRIF()
        {
            if (!ValidarAccesoVista("ReportesExpediente", "ExpedienteFiscalRIF"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }


        public string GetReporteExpedienteFiscalRIF(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteExpedienteFiscalRIF(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult ExpedienteFiscalPFAE()
        {
            if (!ValidarAccesoVista("ReportesExpediente", "ExpedienteFiscalPFAE"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetReporteExpedienteFiscalPFAE(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteExpedienteFiscalPFAE(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult ExpedienteFiscalPM()
        {
            if (!ValidarAccesoVista("ReportesExpediente", "ExpedienteFiscalPFAE"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetReporteExpedienteFiscalPM(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteExpedienteFiscalPM(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult ExpedienteFiscalArrendamiento()
        {
            if (!ValidarAccesoVista("ReportesExpediente", "ExpedienteFiscalArrendamiento"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetReporteExpedienteFiscalArrendamiento(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteExpedienteFiscalArrendamiento(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult ExpedienteFiscalHonorarios()
        {
            if (!ValidarAccesoVista("ReportesExpediente", "ExpedienteFiscalHonorarios"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetReporteExpedienteFiscalHonorarios(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteExpedienteFiscalHonorarios(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult ExpedienteFiscalSueldos()
        {
            if (!ValidarAccesoVista("ReportesExpediente", "ExpedienteFiscalSueldos"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetReporteExpedienteFiscalSueldos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteExpedienteFiscalSueldos(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult PropuestasEconomicas()
        {
            if (!ValidarAccesoVista("ReportesExpediente", "PropuestasEconomicas"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetReportePropuestasEconomicas(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReportePropuestasEconomicas(jsonJS);
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