using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Imageapp.Models.Utils
{
    public class SessionAuthorizeAttribute: AuthorizeAttribute
    {
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            return httpContext.Session["tbc_Usuarios"] != null;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            filterContext.Controller.TempData["Error"] = "La session ha caducado, favor de reingresar al sistema";
            filterContext.Controller.TempData["ErrorComplete"] = "La session ha caducado, favor de reingresar al sistema";
            filterContext.Result = new RedirectResult("~/Inicio/Login/");
        }
    }
}