using System;
using System.IO;
using System.IO.Compression;
using System.Xml;
using System.Text;
using Imageapp.wsSATValidacionCFDI;

namespace Imageapp.Controllers
{
    class ValidaEstatusSATCFDI
    {
        
        /// <summary>
        /// Metodo encargado de validar el estatus de un CFDI ante Web Service de SAT
        /// </summary>
        /// <param name="xmlCFDI">Cadena del XML del CFDI a validar</param>
        /// <param name="FolioFiscal">Parametro de respuesta con el Folio Fiscal del CFDI validado</param>
        /// <param name="Estatus">Parametro de respuesta con el Estatus del CFDI validado</param>
        /// <returns></returns>
        public bool ValidaEstatus( string rfcEmisor, string rfcReceptor, decimal total, string _UUID, out string FolioFiscal, out string Estatus, out string CodigoEstatus, out string ValidacionEFOS)
        {
            FolioFiscal = "";
            Estatus = "";
            CodigoEstatus = "";
            ValidacionEFOS = "";
            try
            {
                //Recuperamos los datos del XML
                //XmlDocument xmlDoc = new XmlDocument();
                //xmlDoc.Load(xmlCFDI);

                string expresionImpresa = "";
                //string rfcEmisor = xmlDoc.GetElementsByTagName("cfdi:Emisor").Item(0).Attributes["Rfc"].Value.ToString();
                //string rfcReceptor = xmlDoc.GetElementsByTagName("cfdi:Receptor").Item(0).Attributes["Rfc"].Value.ToString();
                //decimal total = Convert.ToDecimal(xmlDoc.GetElementsByTagName("cfdi:Comprobante").Item(0).Attributes["Total"].Value.ToString());
                //Guid UUID = Guid.Parse(xmlDoc.GetElementsByTagName("tfd:TimbreFiscalDigital").Item(0).Attributes["UUID"].Value.ToString());

                Guid UUID = Guid.Parse(_UUID);

                FolioFiscal = UUID.ToString();
                expresionImpresa = "?re=" + rfcEmisor.ToUpper().Replace("&", "&amp;") + "&rr=" + rfcReceptor.ToUpper().Replace("&", "&amp;") + "&tt=" + total.ToString() + "&id=" + UUID.ToString().ToUpper();

                string error = "";
               
                if (!WSSAT(expresionImpresa,  out Estatus, out CodigoEstatus, out error, out ValidacionEFOS))
                    return false;

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static bool WSSAT(string expresionImpresa, out string Estatus, out string CodigoEstatus, out string error, out string ValidacionEFOS)
        {
            error = "";
            Estatus = "";
            CodigoEstatus = "";
            ValidacionEFOS = "";
            try
            {
                ConsultaCFDIServiceClient consultaSAT = new ConsultaCFDIServiceClient();
                Acuse respuesta = consultaSAT.Consulta(expresionImpresa);
                Estatus = respuesta.Estado;
                CodigoEstatus = respuesta.CodigoEstatus;
                ValidacionEFOS = respuesta.ValidacionEFOS;
                return true;
            }
            catch(Exception ex)
            {
                error = ex.Message;
                return false;
            }
            
        }

    }
}
