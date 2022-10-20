using Imageapp.Models.DAL;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Imageapp.Controllers
{
    public class ValidacionesSATController : ApiController
    {
        [HttpPost]
        [Route("api/Castelan/ValidacionSAT")]
        public String ValidacionSAT()
        {
            var httpContext = HttpContext.Current;
            string parametros = httpContext.Request.Form.GetValues("params").First();
            NameValueCollection vals2 = HttpUtility.ParseQueryString(parametros);
            string jsonJS = vals2.GetValues("jsonJS").First();
            dynamic data = new ExpandoObject();
            data = JsonConvert.DeserializeObject(jsonJS);

            String url = data.url;

            String rfcEmisor = data.rfcEmisor;
            String rfcReceptor = data.rfcReceptor;
            String UUID = data.UUID;
            String Total_String = data.total;
            Decimal Total = Convert.ToDecimal(Total_String);            
            String FolioFiscal = "";
            String Estatus = "";
            String CodigoEstatus = "";
            String ValidacionEFOS = "";
            String xml = url.Replace("|", "\\");
            ValidaEstatusSATCFDI validaEstatusSATCFDI = new ValidaEstatusSATCFDI();

            validaEstatusSATCFDI.ValidaEstatus(rfcEmisor, rfcReceptor, Total, UUID, out FolioFiscal, out Estatus, out CodigoEstatus, out ValidacionEFOS);
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = 0;     
            
            dAL_Clientes.ValidaSATWS(jsonJS, Estatus, ValidacionEFOS);
            return Estatus;
        }
    }
}
