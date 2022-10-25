using Imageapp.Models.DAL;
using Imageapp.Models.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Imageapp.Controllers
{
    public class ProspectosController : Controller
    {
        [SessionAuthorize]
        public ActionResult ClientesProspectos()
        {
            if (!ValidarAccesoVista("Prospectos", "ClientesProspectos"))
                return RedirectToAction("Inicio", "Inicio");
            return View();
        }


        public string GetListaProspectos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetListaProspectos(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string AddProspecto(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.p_Clientes.id_RVA = id_RVA;
            dAL_Clientes.AddProspecto(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string UpdateProspecto(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.p_Clientes.id_RVA = id_RVA;
            dAL_Clientes.UpdateProspecto(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string GetSeguimiento(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetSeguimiento(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }

        public string AddSeguimiento(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.AddSeguimiento(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string DeleteSeguimiento(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.DeleteSeguimiento(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        #region Clientes_Servicios
        public string AddProspectoServicio(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes_Servicio.id_RV = id_RV;
            dAL_Clientes.AddProspectoServicio(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string SelProspectoServicio(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes_Servicio.id_RV = id_RV;
            dAL_Clientes.SelProspectoServicio(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string DelProspectoServicio(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes_Servicio.id_RV = id_RV;
            dAL_Clientes.DelProspectoServicio(jsonJS);
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