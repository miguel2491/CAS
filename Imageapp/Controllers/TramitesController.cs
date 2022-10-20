using Imageapp.Models.DAL;
using Imageapp.Models.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Imageapp.Controllers
{
    public class TramitesController : Controller
    {
        [SessionAuthorize]
        public ActionResult ListaTramites()
        {
            if (!ValidarAccesoVista("Tramites", "ListaTramites"))
                return RedirectToAction("Inicio", "Inicio");
            return View();
        }

        public string GetListaTramites(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetListaTramites(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult TramitesIMSS()
        {
            if (!ValidarAccesoVista("Tramites", "TramitesIMSS"))
                return RedirectToAction("Inicio", "Inicio");
            return View();
        }

        public string GetListaTramitesIMSS(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetListaTramitesIMSS(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }


        public string AddDocumentoTramite(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/CRM");
            dAL_Clientes.AddDocumentoTramite(jsonJS, Request, path);
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