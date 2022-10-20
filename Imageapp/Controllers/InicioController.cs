using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Imageapp.Models.DAL;
using Imageapp.Models.Utils;

namespace Imageapp.Controllers
{
    public class InicioController : Controller
    {
        Result result = new Result();
        Helper helper = new Helper();

        public ActionResult Login()
        {
            setErrorViewBagFromTempData();
            return View();
        }

        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult Login([Bind(Include = "p_Inicio")] DAL_Inicio dal_Inicio)
        {
            //! Envio de datos
            dal_Inicio.VerficarUsuario();

            if (dal_Inicio.result.status == (int)ListaEstatus.Success)
            {
                //! Asignar a la variables de session la session del usuario
                tbc_Usuarios user = dal_Inicio.result.returnJson<tbc_Usuarios>();
                Session["tbc_Usuarios"] = user;


                if (user.activo == 2)
                {
                    Result resultado = new Result
                    {
                        msnError = "El usuario esta inactivo.",
                        msnErrorComplete = "El usuario esta inactivo."
                    };
                    setErrorViewBagFromResult(resultado);
                    return View();
                }

                if (user.id_rol == 7)
                {
                    if (user.ultimo_movimiento != null && user.ultimo_movimiento != "")
                    {
                        DateTime fechaUno = DateTime.Parse(user.ultimo_movimiento);
                        DateTime fechaDos = DateTime.Now;
                        TimeSpan difFechas = fechaUno - fechaDos;
                        if (difFechas.Days <= 0)
                        {
                            Result resultado = new Result
                            {
                                msnError = "Su plazo de prueba a terminado.",
                                msnErrorComplete = "Su plazo de prueba a terminado."
                            };
                            setErrorViewBagFromResult(resultado);
                            return View();
                        }
                    }
                    return RedirectToAction("Inicio", "Cliente");
                }

                if (user.id_rol == 16)
                {
                    return RedirectToAction("ClientesProspectos", "Prospectos");
                }

                return RedirectToAction("Inicio");
            }
            else
            {
                setErrorViewBagFromResult(dal_Inicio.result);
                return View();
            }
        }

        [SessionAuthorize]
        public ActionResult Inicio()
        {
            setErrorViewBagFromTempData();
                       

            Imageapp.Datos.DB_MenuEntities conexion = new Imageapp.Datos.DB_MenuEntities();           
            var lista = conexion.tbc_Clientes.Where(s => s.id_estatus == 1 && s.fecha_caducidad_fiel != null).OrderBy(s => s.fecha_caducidad_fiel).ToList();           

            return View(lista);
        }

        public ActionResult Logout()
        {
            //! Cerrar sesion
            Session.Clear();
            return RedirectToAction("Login", "Inicio");
        }

        //! Obtener las crendeciales del usuario para mostrar en el menu
        public String GetUsuario()
        {
            DAL_Utils dAL_Utils = new DAL_Utils();
            //! Validar session activa
            if (!dAL_Utils.isSessionActive())
                return dAL_Utils.result.returnToJsonString();

            result = dAL_Utils.result;

            tbc_Usuarios tbc_Usuarios = Session["tbc_Usuarios"] as tbc_Usuarios;

            dynamic data = new ExpandoObject();
            if (tbc_Usuarios.id_rol == 7)
            {
                data.nombre = tbc_Usuarios.nombre;
                data.apellido_paterno = tbc_Usuarios.apellido_paterno;
                data.rfc = tbc_Usuarios.usuario;
                data.razon = tbc_Usuarios.apellido_materno;
                data.fecha = "";
                if (tbc_Usuarios.ultimo_movimiento != null && tbc_Usuarios.ultimo_movimiento != "")
                {
                    DateTime fechaUno = DateTime.Parse(tbc_Usuarios.ultimo_movimiento);
                    DateTime fechaDos = DateTime.Now;
                    TimeSpan difFechas = fechaUno - fechaDos;
                    if (difFechas.Days > 0)
                    {
                        data.fecha = "Cuenta con " + (difFechas.Days) + " días de prueba.";
                    }
                }
            }
            else
            {
                data.nombre = tbc_Usuarios.nombre;
                data.apellido_paterno = tbc_Usuarios.apellido_paterno + " " + tbc_Usuarios.apellido_materno;
                data.rfc = tbc_Usuarios.usuario;
                data.razon = "";
                data.fecha = "";
            }
            
            result.msnSuccess = helper.returnToJsonString(data);
            result.status = (int)ListaEstatus.Success;


            return result.returnToJsonString();
        }

        //! Obtener los menus y submenus a los que tiene acceso el usuario
        public String GetMenus()
        {
            DAL_Inicio dal_Inicio = new DAL_Inicio();
            dal_Inicio.GetMenus();

            return dal_Inicio.result.returnToJsonString();
        }

        #region "FUNCIONES PRIVADAS"
        private string setErrorViewBagFromTempData()
        {
            var error = string.Empty;

            //? Si se detona la vista, verificar si contiene mensaje de error de la vista que lo detono
            error = TempData["Error"] != null ? TempData["Error"].ToString() : string.Empty;

            ModelState.AddModelError("", error);
            ViewBag.msnError = error;
            ViewBag.msnErrorComplete = TempData["ErrorComplete"] != null ? TempData["ErrorComplete"].ToString() : "";

            return error;
        }

        private void setErrorViewBagFromResult(Result result)
        {
            //? En caso de no validar la credenciales mandar el error
            ModelState.AddModelError("", result.msnError);
            ViewBag.msnError = result.msnError;
            ViewBag.msnErrorComplete = result.msnErrorComplete;
        }
        #endregion
    }
}