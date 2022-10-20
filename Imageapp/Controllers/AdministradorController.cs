using Imageapp.Models.DAL;
using Imageapp.Models.Propiedades;
using Imageapp.Models.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Imageapp.Controllers
{
    public class AdministradorController : Controller
    {
        Result result = new Result();

        #region Usuarios
        [SessionAuthorize]
        public ActionResult Usuarios()
        {
            if (!ValidarAccesoVista("Administrador", "Usuarios"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetUsuarios(string jsonJS, int? id_RV)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.GetUsuarios(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string AddUsuario(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.p_Administrador.id_RVA = id_RVA;
            dAL_Administrador.AddUsuario(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string UpdateUsuario(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.p_Administrador.id_RVA = id_RVA;
            dAL_Administrador.UpdateUsuario(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string DeleteUsuario(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.p_Administrador.id_RVA = id_RVA;
            dAL_Administrador.DeleteUsuario(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        #endregion

        #region Roles
        [SessionAuthorize]
        public ActionResult Roles()
        {
            if (!ValidarAccesoVista("Administrador", "Roles"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetRoles(string jsonJS, int? id_RV)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.GetRoles(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string AddRol(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.p_Administrador.id_RVA = id_RVA;
            dAL_Administrador.AddRol(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string UpdateRol(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.p_Administrador.id_RVA = id_RVA;
            dAL_Administrador.UpdateRol(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string DeleteRol(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.p_Administrador.id_RVA = id_RVA;
            dAL_Administrador.DeleteRol(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string GetRlVista(string jsonJS, int? id_RV)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.GetRlVista(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string GetRlVistaAccion(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.p_Administrador.id_RVA = id_RVA;
            dAL_Administrador.GetRlVistaAccion(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }
        #endregion

        #region Vistas
        [SessionAuthorize]
        public ActionResult Vistas()
        {
            if (!ValidarAccesoVista("Administrador", "Vistas"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetVistas(string jsonJS, int? id_RV)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.GetVistas(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string AddVista(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.p_Administrador.id_RVA = id_RVA;
            dAL_Administrador.AddVista(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string UpdateVista(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.p_Administrador.id_RVA = id_RVA;
            dAL_Administrador.UpdateVista(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string DeleteVista(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.p_Administrador.id_RVA = id_RVA;
            dAL_Administrador.DeleteVista(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        #endregion

        #region Acciones
        [SessionAuthorize]
        public ActionResult Acciones()
        {
            if (!ValidarAccesoVista("Administrador", "Acciones"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetAcciones(string jsonJS, int? id_RV)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.GetAcciones(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string AddAccion(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.p_Administrador.id_RVA = id_RVA;
            dAL_Administrador.AddAccion(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string UpdateAccion(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.p_Administrador.id_RVA = id_RVA;
            dAL_Administrador.UpdateAccion(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string DeleteAccion(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.p_Administrador.id_RVA = id_RVA;
            dAL_Administrador.DeleteAccion(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        #endregion

        #region Menus
        [SessionAuthorize]
        public ActionResult Menus()
        {
            if (!ValidarAccesoVista("Administrador", "Menus"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetMenus(string jsonJS, int? id_RV)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.GetMenus(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string AddMenu(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.p_Administrador.id_RVA = id_RVA;
            dAL_Administrador.AddMenu(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string UpdateMenu(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.p_Administrador.id_RVA = id_RVA;
            dAL_Administrador.UpdateMenu(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        public string DeleteMenu(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Administrador dAL_Administrador = new DAL_Administrador();
            dAL_Administrador.p_Administrador.id_RV = id_RV;
            dAL_Administrador.p_Administrador.id_RVA = id_RVA;
            dAL_Administrador.DeleteMenu(jsonJS);
            return dAL_Administrador.result.returnToJsonString();
        }

        #endregion

        #region FUNCIONES PRIVADAS
        private bool ValidarAccesoVista(string controlador,string vista)
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