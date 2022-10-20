using Imageapp.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Imageapp.Datos;

namespace Imageapp.Controllers
{
    public class MarketingController : Controller
    {
        // GET: Marketing
        public ActionResult FormularioContacto()
        {
            if (!ValidarAccesoVista("Marketing", "FormularioContacto"))
                return RedirectToAction("Inicio", "Inicio");


            DB_MenuEntities db = new DB_MenuEntities();
            DateTime ahora = DateTime.Now;
            DateTime _fechaInicioDate = new DateTime(ahora.Year, ahora.Month, ahora.Day);
            DateTime _fechaFinalDate = _fechaInicioDate.AddDays(1);

            var tbd_Formulario = db.tbd_Formulario.Where(s => s.fecha >= _fechaInicioDate && s.fecha < _fechaFinalDate).ToList();

            return View(tbd_Formulario);
        }

        [HttpPost]
        public ActionResult FormularioContacto(FormCollection formCollection)
        {
            if (!ValidarAccesoVista("Marketing", "FormularioContacto"))
                return RedirectToAction("Inicio", "Inicio");


            string _fechaInicio = formCollection["txtBuscarFechaInicio"];
            string _fechaFinal = formCollection["txtBuscarFechaFinal"];

            DateTime _fechaInicioDate = DateTime.Parse(_fechaInicio);
            DateTime _fechaFinalDate = DateTime.Parse(_fechaFinal).AddDays(1);

            DB_MenuEntities db = new DB_MenuEntities();

            var tbd_Formulario = db.tbd_Formulario.Where(s => s.fecha >= _fechaInicioDate && s.fecha < _fechaFinalDate).ToList();

            return View(tbd_Formulario);
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

        #endregion 
    }
}