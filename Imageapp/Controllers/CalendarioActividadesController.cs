using Imageapp.Models.DAL;
using Imageapp.Models.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Imageapp.Controllers
{
    public class CalendarioActividadesController : Controller
    {

        [SessionAuthorize]
        public ActionResult CatalogoActividades()
        {
            if (!ValidarAccesoVista("CalendarioActividades", "CatalogoActividades"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }
        public string GetActividadesCalendario(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetActividadesCalendario(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }
        public string AddActividadesCalendario(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.AddActividadesCalendario(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }
                


        #region Configuracion

        [SessionAuthorize]
        public ActionResult ConfiguracionActividades()
        {
            if (!ValidarAccesoVista("CalendarioActividades", "ConfiguracionActividades"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetActividadesProduccion(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetActividadesProduccion(jsonJS);
            return dAL_Clientes.result.returnToJsonString();

        }


        public string AddActividadesProduccion(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.AddActividadesProduccion(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string SetActividadesProduccion(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.SetActividadesProduccion(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }
        #endregion


        [SessionAuthorize]
        public ActionResult CalendarioActividades()
        {
            if (!ValidarAccesoVista("CalendarioActividades", "CalendarioActividades"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetCalendario(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetCalendario(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }


        [SessionAuthorize]
        public ActionResult LineaProduccion1()
        {
            if (!ValidarAccesoVista("CalendarioActividades", "LineaProduccion1"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }
        public string GetCalendarioLP1(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetCalendarioLP1(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }
        public string AgregarFechaCalendario(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.AgregarFechaCalendario(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }
        public string QuitarFechaCalendario(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.QuitarFechaCalendario(jsonJS);
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