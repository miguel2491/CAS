using sat_ws;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;

namespace XMLtoPDF
{
    public static class funciones
    {
        public static void CargaXMLtoPDF(String xml)
        {

            var RutaXML = xml;


            try
            {

                bool EsquemaNominaFunciona = true;

                try
                {
                    DataSet dsXMLCFDINomina12 = new DataSet();
                    DataSet dsXMLCFDINomina11 = new DataSet();
                    string VersionNomina = "";
                    string VersionCFDI = "";
                    try
                    {
                        DataSet dsXMLCFDI = new DataSet();

                        try
                        {
                            dsXMLCFDI.ReadXml(RutaXML);
                        }
                        catch (Exception ex)
                        {
                            dsXMLCFDI = new DataSet();
                            dsXMLCFDI.ReadXml(RutaXML, XmlReadMode.ReadSchema);
                            //dsXMLCFDI.ReadXml(doc);

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


                        XDocument XMLDoc = XDocument.Load(RutaXML);
                        try
                        {
                            dsXMLCFDINomina11.ReadXmlSchema("\\Schemas\\nomina11.xsd");
                            dsXMLCFDINomina11.ReadXml(RutaXML, XmlReadMode.ReadSchema);
                            if (dsXMLCFDINomina11.Tables[0].Rows.Count > 0)
                            {
                                VersionNomina = "1.1";
                            }
                            else
                            {
                                if (EsquemaNominaFunciona)
                                {
                                    dsXMLCFDINomina12.ReadXmlSchema("\\Schemas\\nomina12.xsd");
                                    dsXMLCFDINomina12.ReadXml(RutaXML, XmlReadMode.ReadSchema);
                                    VersionNomina = "1.2";
                                }

                            }

                        }
                        catch (Exception ex)
                        {
                            //log.Error("Message: " + ex.Message + "######### StackTrace: " + ex.StackTrace.ToString());
                            EsquemaNominaFunciona = false;
                        }


                        //El CFDI cargado es un CFDI sin complemento adicional al TFD
                        if (VersionNomina.Length == 0)
                        {
                            if (VersionCFDI == "3.2")
                            {
                                ReadXMLCFDI32Nomina12ToObject.Get(dsXMLCFDI, dsXMLCFDINomina12, XMLDoc, VersionNomina, RutaXML);
                            }

                            if (VersionCFDI == "3.3")
                            {
                                ReadXMLCFDI33Nomina12ToObject.Get(dsXMLCFDI, dsXMLCFDINomina12, XMLDoc, VersionNomina, RutaXML);
                            }

                            if (VersionCFDI == "4.0")
                            {
                                ReadXMLCFDI33Nomina12ToObject.Get(dsXMLCFDI, dsXMLCFDINomina12, XMLDoc, VersionNomina, RutaXML);
                            }
                        }

                        //El CFDI cargado es un CFDI de un Recibo de nómina
                        if (VersionNomina.Length > 0)
                        {
                            if (VersionNomina == "1.1")
                            {
                                ReadXMLCFDI32Nomina11ToObject.Get(dsXMLCFDI, dsXMLCFDINomina11, XMLDoc, VersionNomina, RutaXML);
                            }

                            if (VersionNomina == "1.2" && VersionCFDI == "3.2")
                            {
                                ReadXMLCFDI32Nomina12ToObject.Get(dsXMLCFDI, dsXMLCFDINomina12, XMLDoc, VersionNomina, RutaXML);
                            }

                            if (VersionNomina == "1.2" && VersionCFDI == "3.3")
                            {
                                ReadXMLCFDI33Nomina12ToObject.Get(dsXMLCFDI, dsXMLCFDINomina12, XMLDoc, VersionNomina, RutaXML);
                            }

                            if (VersionNomina == "1.2" && VersionCFDI == "4.0")
                            {
                                ReadXMLCFDI33Nomina12ToObject.Get(dsXMLCFDI, dsXMLCFDINomina12, XMLDoc, VersionNomina, RutaXML);
                            }
                        }
                        //BKWorkerObject.ReportProgress(a + 1);
                    }
                    catch (Exception ex)
                    {
                        //log.Error("Message: " + ex.Message + "######### StackTrace: " + ex.StackTrace.ToString());
                    }
                }
                catch (Exception ex)
                {
                    //log.Error("Message: " + ex.Message + "######### StackTrace: " + ex.StackTrace.ToString());
                }

            }
            catch (Exception ex)
            {
                //log.Error("Message: " + ex.Message + "######### StackTrace: " + ex.StackTrace.ToString());
            }


        }

    }
}
