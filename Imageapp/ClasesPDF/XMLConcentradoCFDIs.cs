using System;
using System.Linq;
//using System.Windows.Forms;
using System.Xml.Linq;
using System.IO;
using System.Collections.Generic;
using System.Text;
using System.Data;

namespace sat_ws
{
    class XMLConcentradoCFDIs
    {
        //private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        /// <summary>
        /// Método encargado de Genenerar un XML para el seguimiento de Solicitudes generadas al SAT para su descarga
        /// </summary>
        public static void CrearXMLConcentradoCFDIs(string Origen)
        {
            var RutaRelativaXML = "";
            if (Origen == "Externo")
                RutaRelativaXML =  "\\XMLConcentradoCFDIsTemporal.xml";
            if (Origen == "Interno")
                RutaRelativaXML =  "\\XMLConcentradoCFDIs.xml";

            if (!File.Exists(RutaRelativaXML))
            {
                XDocument miXML = new XDocument(new XDeclaration("1.0", "utf-8", "yes"),
                    new XElement("CFDIMetadatos"
                    ));
                miXML.Save(RutaRelativaXML);
            }
        }

        /// <summary>
        /// Método encargado de Genenerar un XML para el seguimiento de Solicitudes generadas al SAT para su descarga
        /// </summary>
        public static void CrearXMLConcentradoCFDIsDesdeXML()
        {
            var RutaRelativaXML =  "\\XMLConcentradoCFDIsDesdeXML.xml";
            if (!File.Exists(RutaRelativaXML))
            {
                XDocument miXML = new XDocument(new XDeclaration("1.0", "utf-8", "yes"),
                    new XElement("CFDIXML"
                    ));
                miXML.Save(RutaRelativaXML);
            }
        }

        public static void CrearXMLConcentradoCFDIsDesdeXMLTemporal()
        {
            var RutaRelativaXML = "\\XMLConcentradoCFDIsDesdeXMLTemporal.xml";
            if (!File.Exists(RutaRelativaXML))
            {
                XDocument miXML = new XDocument(new XDeclaration("1.0", "utf-8", "yes"),
                    new XElement("CFDIXML"
                    ));
                miXML.Save(RutaRelativaXML);
            }
        }

        


        public static bool AgregarCFDIsXML(string RutaTXTAProcesar, string Origen)
        {
            string[] lines;
            var list = new List<string>();
            CrearXMLConcentradoCFDIs(Origen);
            try
            {
                var fileStream = new FileStream(RutaTXTAProcesar, FileMode.Open, FileAccess.Read);
                using (var streamReader = new StreamReader(fileStream, Encoding.UTF8))
                {
                    string line;
                    while ((line = streamReader.ReadLine()) != null)
                    {
                        string[] atributos = line.Split('~');
                        if (atributos[0] != "Uuid")
                        {
                            if (!ExisteCFDIEnXML(atributos[0], Origen))
                            {
                                AgregarCFDIAXML(Origen, atributos[0], atributos[1], atributos[2], atributos[3], atributos[4], atributos[5], atributos[6], atributos[7], atributos[8], atributos[9], atributos[10], atributos[11]);
                            }
                        }
                    }
                }
                lines = list.ToArray();
                return true;
            }
            catch(Exception ex)
            {
                //log.Error("Message: " + ex.Message + "######### StackTrace: " + ex.StackTrace.ToString());
                return false;
            }           
        }

        public static bool AgregarCFDIsXMLaXML(string RutaXMLAProcesar, string Origen)
        {
            try
            {

                #region "Version Anterior"
                //DataSet dsXMLCFDI = new DataSet();
                //dsXMLCFDI.ReadXml(RutaXMLAProcesar);
                //var NombreArchivo = Path.GetFileName(RutaXMLAProcesar);

                //var uuid = "";
                //var RfcEmisor = "";
                //var NombreEmisor = "";
                //var RfcReceptor = "";
                //var NombreReceptor = "";
                //var RCFPac = "";
                //var FechaEmision = "";
                //var FechaCertificacionSat = "";
                //var Monto = "";
                //var EfectoComprobante = "";

                ////Comprobante
                //foreach (DataRow dato in dsXMLCFDI.Tables["Comprobante"].Rows)
                //{
                //    EfectoComprobante = dato["TipoDeComprobante"].ToString();
                //    Monto = dato["Total"].ToString();
                //    FechaEmision = dato["Fecha"].ToString();
                //}

                ////Emisor
                //foreach (DataRow dato in dsXMLCFDI.Tables["Emisor"].Rows)
                //{
                //    try
                //    {
                //        NombreEmisor = dato["Nombre"].ToString();
                //    }catch (Exception)
                //    { NombreEmisor = ""; }

                //    try
                //    {
                //        RfcEmisor = dato["Rfc"].ToString();
                //    }
                //    catch (Exception)
                //    { RfcEmisor = ""; }
                //}

                ////Receptor
                //foreach (DataRow dato in dsXMLCFDI.Tables[2].Rows)
                //{
                //    try
                //    {
                //        NombreReceptor = dato["Nombre"].ToString();
                //    }catch(Exception)
                //    { NombreReceptor = ""; }

                //    try
                //    {
                //        RfcReceptor = dato["Rfc"].ToString();
                //    }
                //    catch (Exception)
                //    { RfcReceptor = ""; }
                //}

                ////TFD                
                //foreach (DataRow dato in dsXMLCFDI.Tables["TimbreFiscalDigital"].Rows)
                //{
                //    try
                //    {
                //        uuid = dato["UUID"].ToString();
                //    }
                //    catch (Exception)
                //    { uuid = ""; }

                //    try
                //    {
                //        FechaCertificacionSat = dato["FechaTimbrado"].ToString();
                //    }
                //    catch (Exception)
                //    { FechaCertificacionSat = ""; }

                //    try
                //    {
                //        RCFPac = dato["RfcProvCertif"].ToString();
                //    }
                //    catch (Exception)
                //    { RCFPac = ""; }

                //}

                #endregion

                //var RutaRelativaXML = Application.StartupPath + "\\XMLConcentradoCFDINomina.xml";
                //XDocument xmlDocConcentrado = XDocument.Load(RutaRelativaXML);

                DataSet dsXMLCFDI33 = new DataSet();
                string VersionNomina = "";
                string VersionCFDI = "";
                var NombreArchivo = Path.GetFileName(RutaXMLAProcesar);
                
                DataSet dsXMLCFDI = new DataSet();
                DataSet dsXMLCFDICompConcepto = new DataSet();
                try
                {
                    dsXMLCFDI.ReadXml(RutaXMLAProcesar);
                }
                catch(Exception ex)
                {

                    string xmlString = System.IO.File.ReadAllText(RutaXMLAProcesar);
                    using (StringReader stringReader = new StringReader(xmlString.Replace("terceros:Impuestos", "terceros:ImpuestosCompConcep").Replace("terceros:Traslados", "terceros:TrasladosCompConcep").Replace("terceros:Traslado ", "terceros:TrasladoCompConcep ")))
                    {
                        dsXMLCFDI.Reset();
                        dsXMLCFDI.ReadXml(stringReader);
                    }
                }
                
                foreach (DataRow dato in dsXMLCFDI.Tables["Comprobante"].Rows)
                {
                    try
                    {
                        VersionCFDI = dato["version"].ToString();
                    }
                    catch (Exception)
                    {
                        VersionCFDI = dato["Version"].ToString();
                    }
                }

                XDocument XMLDoc = XDocument.Load(RutaXMLAProcesar);
               
                CFDINominaObject oCFDI = new CFDINominaObject();
                if (VersionCFDI == "3.2")
                {

                }

                if (VersionCFDI == "3.3")
                {
                    oCFDI = ReadXMLCFDI33ToObject.Get(dsXMLCFDI, RutaXMLAProcesar, Origen);
                }
                    


                string RutaCarpetaDestino = "\\ContenedorInternoCFDI\\ContenedorPrincipal\\" + RecuperaEstructuraCarpeta(oCFDI.RfcEmisor, oCFDI.RfcReceptor, oCFDI.FechaTimbrado);

                if(!Directory.Exists(RutaCarpetaDestino))
                {
                    Directory.CreateDirectory(RutaCarpetaDestino);
                }

                string RutaCompletaXMLDestino = RutaCarpetaDestino + Path.GetFileName(RutaXMLAProcesar);

                if (!File.Exists(RutaCompletaXMLDestino))
                {
                    File.Copy(RutaXMLAProcesar, RutaCompletaXMLDestino, true);
                }

                if (!ExisteCFDIXMLEnXML(oCFDI.UUID, Origen))
                {
                    AgregarCFDIXMLAXML(oCFDI, NombreArchivo, Origen);
                }
                return true;
            }
            catch (Exception ex)
            {
                //log.Error("Message: " + ex.Message + "######### StackTrace: " + ex.StackTrace.ToString());
                return false;
            }
        }

        public static string RecuperaEstructuraCarpeta(string RFCEmisor, string RFCReceptor, string FechaCertificacion)
        {
            string TipoEstructuraCarpetas = XMLConfiguracion.LeerAtributoConfiguracionXML("TipoOrganizacionCarpetas");

            if(TipoEstructuraCarpetas == "1")
            {
                TipoEstructuraCarpetas = RFCEmisor + "\\";
            }
            else if (TipoEstructuraCarpetas == "2")
            {

                TipoEstructuraCarpetas = Convert.ToString(Convert.ToDateTime(FechaCertificacion).Year) + "\\" + Convert.ToString(Convert.ToDateTime(FechaCertificacion).Month) + "\\" + RFCEmisor + "\\";
            }
            else if (TipoEstructuraCarpetas == "3")
            {
                
                TipoEstructuraCarpetas =  RFCEmisor + "\\" + Convert.ToString(Convert.ToDateTime(FechaCertificacion).Year) + "\\" + Convert.ToString(Convert.ToDateTime(FechaCertificacion).Month) + "\\"; 
            }
            else if (TipoEstructuraCarpetas == "4")
            {

                TipoEstructuraCarpetas = RFCEmisor + "\\" + Convert.ToString(Convert.ToDateTime(FechaCertificacion).Year) + "\\" + "\\" + Convert.ToString(Convert.ToDateTime(FechaCertificacion).Month) + "\\" + RFCReceptor + "\\"; 
            }

            return TipoEstructuraCarpetas;
        }

        public static bool ExisteCFDIEnXML(string Uuid, string Origen)
        {
            CrearXMLConcentradoCFDIs(Origen);
            var RutaRelativaXML = "";
            if (Origen == "Externo")
                RutaRelativaXML = "\\XMLConcentradoCFDIsTemporal.xml";
            if (Origen == "Interno")
                RutaRelativaXML =  "\\XMLConcentradoCFDIs.xml";

            CrearXMLConcentradoCFDIs(Origen);


            XDocument xmlFile = XDocument.Load(RutaRelativaXML);

            var Consulta = from c in xmlFile.Elements("CFDIMetadatos").Elements("CFDI")
                           select c;

            foreach (XElement Solicitud in Consulta)
            {
                var UuidEvaluar = Solicitud.Attribute("Uuid").Value;
                if (UuidEvaluar == Uuid)
                {
                    return true;
                }
            }
            return false;
        }

        public static void AgregarCFDIAXML(string Origen, string Uuid, string RfcEmisor, string NombreEmisor, string RfcReceptor, string NombreReceptor, string RfcPac, string FechaEmision, string FechaCertificacionSat, string Monto, string EfectoComprobante, string Estatus, string FechaCancelacion)
        {
            CrearXMLConcentradoCFDIs(Origen);
            var RutaRelativaXML = "";
            if(Origen == "Externo")
                RutaRelativaXML =  "\\XMLConcentradoCFDIsTemporal.xml";
            if(Origen == "Interno")
                RutaRelativaXML = "\\XMLConcentradoCFDIs.xml";

            XDocument xmlDoc = XDocument.Load(RutaRelativaXML);
            xmlDoc.Element("CFDIMetadatos").Add(
                new XElement("CFDI",
                new XAttribute("Uuid", Uuid),
                new XAttribute("RfcEmisor", RfcEmisor),
                new XAttribute("NombreEmisor", NombreEmisor),
                new XAttribute("RfcReceptor", RfcReceptor),
                new XAttribute("NombreReceptor", NombreReceptor),
                new XAttribute("RfcPac", RfcPac),
                new XAttribute("FechaEmision", FechaEmision),
                new XAttribute("FechaCertificacionSat", FechaCertificacionSat),
                new XAttribute("Monto", Monto),
                new XAttribute("EfectoComprobante", EfectoComprobante),
                new XAttribute("Estatus", Estatus),
                new XAttribute("FechaCancelacion", FechaCancelacion)
            )
            );
            xmlDoc.Save(RutaRelativaXML);
        }

        public static void AgregarCFDIAXMLTemporal(string Uuid, string RfcEmisor, string NombreEmisor, string RfcReceptor, string NombreReceptor, string RfcPac, string FechaEmision, string FechaCertificacionSat, string Monto, string EfectoComprobante, string Estatus, string FechaCancelacion)
        {
            
            var RutaRelativaXML =  "\\XMLConcentradoCFDIs.xml";

            XDocument xmlDoc = XDocument.Load(RutaRelativaXML);
            xmlDoc.Element("CFDIMetadatos").Add(
                new XElement("CFDI",
                new XAttribute("Uuid", Uuid),
                new XAttribute("RfcEmisor", RfcEmisor),
                new XAttribute("NombreEmisor", NombreEmisor),
                new XAttribute("RfcReceptor", RfcReceptor),
                new XAttribute("NombreReceptor", NombreReceptor),
                new XAttribute("RfcPac", RfcPac),
                new XAttribute("FechaEmision", FechaEmision),
                new XAttribute("FechaCertificacionSat", FechaCertificacionSat),
                new XAttribute("Monto", Monto),
                new XAttribute("EfectoComprobante", EfectoComprobante),
                new XAttribute("Estatus", Estatus),
                new XAttribute("FechaCancelacion", FechaCancelacion)
            )
            );
            xmlDoc.Save(RutaRelativaXML);
        }


        public static void AgregarCFDIXMLAXML(CFDINominaObject oCFDI, string NombreArchivo, string Origen)
        {
            var RutaRelativaXML = "";
            if (Origen == "Externo")
                RutaRelativaXML =  "\\XMLConcentradoCFDIsDesdeXMLTemporal.xml";
            if (Origen == "Interno")
                RutaRelativaXML =  "\\XMLConcentradoCFDIsDesdeXML.xml";

            var CFDIRelacionados = "";
            try
            {                
                for (int a = 0; a < oCFDI.CFDIRelacionados.Rows.Count; a++)
                {
                    if (a == 0)
                        CFDIRelacionados = oCFDI.CFDIRelacionados.Rows[a]["UUIDRelacionado"].ToString();
                    else
                        CFDIRelacionados = CFDIRelacionados + ", " + oCFDI.CFDIRelacionados.Rows[a]["UUIDRelacionado"];
                }
            }
            catch (Exception ex)
            { }

            var PartidasDescripcion = "";
            var Importes = "";
            var ValoresUnitarios = "";
            var Cantidades = "";
            var ClavesUnidad = "";
            var ClavesProdServ = "";
            

            try
            {                
                for (int a = 0; a < oCFDI.Conceptos.Rows.Count; a++)
                {
                    if (a == 0)
                    {
                        PartidasDescripcion = oCFDI.Conceptos.Rows[a]["Descripcion"].ToString();
                        Importes = oCFDI.Conceptos.Rows[a]["Importe"].ToString();
                        ValoresUnitarios = oCFDI.Conceptos.Rows[a]["ValorUnitario"].ToString();
                        Cantidades = oCFDI.Conceptos.Rows[a]["Cantidad"].ToString();
                        ClavesUnidad = oCFDI.Conceptos.Rows[a]["ClaveUnidad"].ToString();
                        ClavesProdServ = oCFDI.Conceptos.Rows[a]["ClaveProdServ"].ToString();
                    }                        
                    else
                    {
                        PartidasDescripcion = PartidasDescripcion + " | " + oCFDI.Conceptos.Rows[a]["Descripcion"];
                        Importes = Importes + " | " + oCFDI.Conceptos.Rows[a]["Importe"].ToString();
                        ValoresUnitarios = ValoresUnitarios + " | " + oCFDI.Conceptos.Rows[a]["ValorUnitario"].ToString();
                        Cantidades = Cantidades + " | " + oCFDI.Conceptos.Rows[a]["Cantidad"].ToString();
                        ClavesUnidad = ClavesUnidad + " | " + oCFDI.Conceptos.Rows[a]["ClaveUnidad"].ToString();
                        ClavesProdServ = ClavesProdServ + " | " + oCFDI.Conceptos.Rows[a]["ClaveProdServ"].ToString();
                    }                       
                }

            }
            catch (Exception ex)
            { }


            XDocument xmlDoc = XDocument.Load(RutaRelativaXML);
            xmlDoc.Element("CFDIXML").Add(
                new XElement("CFDI",
                new XAttribute("Version", oCFDI.Version),
                new XAttribute("Serie", oCFDI.Serie),
                new XAttribute("Folio", oCFDI.Folio),
                new XAttribute("Uuid", oCFDI.UUID),
                new XAttribute("FechaEmision", oCFDI.FechaGeneracion),
                new XAttribute("RfcEmisor", oCFDI.RfcEmisor),
                new XAttribute("NombreEmisor", oCFDI.NombreEmisor),
                new XAttribute("RfcReceptor", oCFDI.RfcReceptor),
                new XAttribute("NombreReceptor", oCFDI.NombreReceptor),
                new XAttribute("RegimenFiscal", oCFDI.RegimenFiscalEmsior),
                new XAttribute("LugarExpedicion", oCFDI.LugarExpedicion),
                new XAttribute("UsoCFDI", oCFDI.UsoCFDI),
                new XAttribute("FormaPago", oCFDI.FormaPago),
                new XAttribute("MetodoPago", oCFDI.MetodoPago),
                new XAttribute("EfectoComprobante", oCFDI.EfectoComprobante),
                new XAttribute("Moneda", oCFDI.Moneda),
                new XAttribute("SubTotal", oCFDI.SubTotal),
                new XAttribute("Total", oCFDI.Total),
                new XAttribute("TotalImpuestosTrasladados", oCFDI.TotalImpuestosTrasladados),
                new XAttribute("TotalImpuestosRetenidos", oCFDI.TotalImpuestosRetenidos),
                new XAttribute("Descripcion", PartidasDescripcion),
                new XAttribute("Importe", Importes),
                new XAttribute("ValorUnitario", ValoresUnitarios),
                new XAttribute("Cantidad", Cantidades),
                new XAttribute("ClaveUnidad", ClavesUnidad),
                new XAttribute("ClaveProdServ", ClavesProdServ), 
                new XAttribute("TipoRelacion", oCFDI.TipoRelacion),
                new XAttribute("CFDIRelacionados", CFDIRelacionados),
                new XAttribute("NoCertificadoSAT", oCFDI.NumeroSerieCertificadoSAT),
                new XAttribute("RfcPac", oCFDI.RfcProvCertif),                
                new XAttribute("FechaCertificacionSat", oCFDI.FechaTimbrado),
                new XAttribute("ComplementoPagosFechaPago", oCFDI.ComplementoPagosFechaPago),
                new XAttribute("ComplementoPagoMonto", oCFDI.ComplementoPagosMonto),
                new XAttribute("ComplementoPagoMoneda", oCFDI.ComplementoPagosMoneda),

                new XAttribute("NombreArchivo", NombreArchivo)
            )
            );
            xmlDoc.Save(RutaRelativaXML);
        }

        public static bool ExisteCFDIXMLEnXML(string Uuid, string Origen)
        {
            var RutaRelativaXML = "";
            if (Origen == "Externo")
                RutaRelativaXML =  "\\XMLConcentradoCFDIsDesdeXMLTemporal.xml";
            if (Origen == "Interno")
                RutaRelativaXML =  "\\XMLConcentradoCFDIsDesdeXML.xml";

            XDocument xmlFile = XDocument.Load(RutaRelativaXML);

            var Consulta = from c in xmlFile.Elements("CFDIXML").Elements("CFDI")
                           select c;

            foreach (XElement Solicitud in Consulta)
            {
                var UuidEvaluar = Solicitud.Attribute("Uuid").Value;
                if (UuidEvaluar == Uuid)
                {
                    return true;
                }
            }
            return false;
        }
        
        public static void EliminarXMLConcentradoCFDIs(string Origen)
        {

            var RutaRelativaXML = "";
            if (Origen == "Externo")
                RutaRelativaXML =  "\\XMLConcentradoCFDIsTemporal.xml";
            if (Origen == "Interno")
                RutaRelativaXML =  "\\XMLConcentradoCFDIs.xml";
            if (File.Exists(RutaRelativaXML))
            {
                try
                {
                    File.Delete(RutaRelativaXML);
                }
                catch (Exception ex)
                {
                    //log.Error("Message: " + ex.Message + "######### StackTrace: " + ex.StackTrace.ToString());
                }
            }
        }
    }
}



