using Imageapp.Models.DAL;
using Imageapp.Models.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Imageapp.Controllers
{
    public class ReportesEntregablesController : Controller
    {
        // GET: ReportesEntregables
        [SessionAuthorize]
        public ActionResult EntregablesRIF()
        {
            if (!ValidarAccesoVista("ReportesEntregables", "EntregablesRIF"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }


        public string GetReporteEntregablesRIF(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteEntregablesRIF(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult EntregablesArrendamiento()
        {
            if (!ValidarAccesoVista("ReportesEntregables", "EntregablesArrendamiento"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }
        public string GetReporteEntregablesArrendamiento(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteEntregablesArrendamiento(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }
        [SessionAuthorize]
        public ActionResult EntregablesHonorarios()
        {
            if (!ValidarAccesoVista("ReportesEntregables", "EntregablesHonorarios"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }
        public string GetReporteEntregablesHonorarios(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteEntregablesHonorarios(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }
        [SessionAuthorize]
        public ActionResult EntregablesPFAE()
        {
            if (!ValidarAccesoVista("ReportesEntregables", "EntregablesPFAE"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }
        public string GetReporteEntregablesPFAE(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteEntregablesPFAE(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }
        [SessionAuthorize]
        public ActionResult EntregablesPM()
        {
            if (!ValidarAccesoVista("ReportesEntregables", "EntregablesPM"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }
        public string GetReporteEntregablesPM(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteEntregablesPM(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public ActionResult EntregablesAsesoria()
        {
            if (!ValidarAccesoVista("ReportesEntregables", "EntregablesAsesoria"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }
        public string GetReporteEntregablesAsesoria(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteEntregablesAsesoria(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public ActionResult EntregablesCOI()
        {
            if (!ValidarAccesoVista("ReportesEntregables", "EntregablesCOI"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }
        public string GetReporteEntregablesCOI(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteEntregablesCOI(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult EntregablesEDO()
        {
            if (!ValidarAccesoVista("ReportesEntregables", "EntregablesEDO"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }


        public string GetReporteEntregablesEDO(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteEntregablesEDO(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }


        [SessionAuthorize]
        public ActionResult EntregablesSueldos()
        {
            if (!ValidarAccesoVista("ReportesEntregables", "EntregablesSueldos"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }


        public string GetReporteEntregablesSueldos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetReporteEntregablesSueldos(jsonJS);
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