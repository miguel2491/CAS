using System;
using System.Collections;
using System.Data;
using System.IO;
using System.IO.Compression;
//using System.Windows.Forms;
using System.Xml.Linq;

namespace sat_ws
{
    class ReadXMLCFDI33ToObject
    {
        //private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        public static CFDINominaObject Get(DataSet dsXMLCFDI, string RutaXML, string Origen)
        {
            Hashtable HTPercepciones = new Hashtable();
            Hashtable HTDeducciones = new Hashtable();
            try
            {
                CFDINominaObject CFDINomina = new CFDINominaObject();

                //Nodo Comprobante
                foreach (DataRow dato in dsXMLCFDI.Tables["Comprobante"].Rows)
                {
                    try
                    {
                        CFDINomina.EfectoComprobante = dato["TipoDeComprobante"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.Total = dato["Total"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.SubTotal = dato["SubTotal"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.FechaGeneracion = dato["Fecha"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.Version = dato["Version"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.Serie = dato["Serie"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.Folio = dato["Folio"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.LugarExpedicion = dato["LugarExpedicion"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.MetodoPago = dato["metododePago"].ToString();
                    }
                    catch (Exception)
                    {
                        try
                        {
                            CFDINomina.MetodoPago = dato["MetodoPago"].ToString();
                        }
                        catch (Exception)
                        { }
                    }

                    try
                    {
                        CFDINomina.FormaPago = dato["formadePago"].ToString();
                    }
                    catch (Exception)
                    {
                        try
                        {
                            CFDINomina.FormaPago = dato["FormaPago"].ToString();
                        }
                        catch (Exception)
                        { }
                    }

                    try
                    {
                        CFDINomina.Moneda = dato["Moneda"].ToString();
                    }
                    catch (Exception)
                    { }
                }


                //Nodo Emisor
                foreach (DataRow dato in dsXMLCFDI.Tables["Emisor"].Rows)
                {
                    try
                    {
                        CFDINomina.NombreEmisor = dato["Nombre"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.RfcEmisor = dato["Rfc"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.RegimenFiscalEmsior = dato["RegimenFiscal"].ToString();
                    }
                    catch (Exception)
                    { }
                }

                //Nodo Receptor                
                foreach (DataRow dato in dsXMLCFDI.Tables["Receptor"].Rows)
                {
                    try
                    {
                        CFDINomina.NombreReceptor = dato["Nombre"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.RfcReceptor = dato["Rfc"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.UsoCFDI = dato["UsoCFDI"].ToString();
                    }
                    catch (Exception)
                    { }
                }


                try
                {
                    foreach (DataRow ComplementoPagos in dsXMLCFDI.Tables["Complemento"].DataSet.Tables["Pagos"].DataSet.Tables["Pago"].Rows)
                    {
                        try
                        {
                            CFDINomina.ComplementoPagosFechaPago = ComplementoPagos["FechaPago"].ToString();
                        }
                        catch (Exception)
                        { }

                        try
                        {
                            CFDINomina.ComplementoPagosMonto = ComplementoPagos["Monto"].ToString();
                        }
                        catch (Exception)
                        { }

                        try
                        {
                            CFDINomina.ComplementoPagosMoneda = ComplementoPagos["MonedaP"].ToString();
                        }
                        catch (Exception)
                        { }
                    }


                }
                catch(Exception ex)
                {

                }

                try
                {
                    //Nodo CFDI Relacionados
                    int b = 0;
                    DataTable DTCFDIRelacionados = new DataTable();
                    DataRow rowR;
                    DataColumn columnR;

                    columnR = new DataColumn();
                    columnR.DataType = System.Type.GetType("System.String");
                    columnR.ColumnName = "UUIDRelacionado";
                    DTCFDIRelacionados.Columns.Add(columnR);


                    //Nodo CFDI Relacionados              
                    foreach (DataRow dato in dsXMLCFDI.Tables["CfdiRelacionados"].Rows)
                    {
                        try
                        {
                            CFDINomina.TipoRelacion = dato["TipoRelacion"].ToString();
                        }
                        catch (Exception)
                        { }
                    }


                    //Nodo CFDI Relacionado         
                    foreach (DataRow dato in dsXMLCFDI.Tables["CfdiRelacionado"].Rows)
                    {
                        rowR = DTCFDIRelacionados.NewRow();
                        try
                        {
                            rowR["UUIDRelacionado"] = dato["UUID"].ToString();
                        }
                        catch (Exception)
                        { }


                        DTCFDIRelacionados.Rows.Add(rowR);
                        b = b + 1;
                    }
                    CFDINomina.CFDIRelacionados = DTCFDIRelacionados;
                }
                catch(Exception ex)
                { }
                


                //Nodo Conceptos
                int a = 0;
                DataTable DTConceptos = new DataTable();
                DataRow row;
                DataColumn column;

                column = new DataColumn();
                column.DataType = System.Type.GetType("System.String");
                column.ColumnName = "Descripcion";
                DTConceptos.Columns.Add(column);

                column = new DataColumn();
                column.DataType = System.Type.GetType("System.String");
                column.ColumnName = "Importe";
                DTConceptos.Columns.Add(column);

                column = new DataColumn();
                column.DataType = System.Type.GetType("System.String");
                column.ColumnName = "ValorUnitario";
                DTConceptos.Columns.Add(column);

                column = new DataColumn();
                column.DataType = System.Type.GetType("System.String");
                column.ColumnName = "ClaveUnidad";
                DTConceptos.Columns.Add(column);

                column = new DataColumn();
                column.DataType = System.Type.GetType("System.String");
                column.ColumnName = "Cantidad";
                DTConceptos.Columns.Add(column);

                column = new DataColumn();
                column.DataType = System.Type.GetType("System.String");
                column.ColumnName = "ClaveProdServ";
                DTConceptos.Columns.Add(column);

                foreach (DataRow dato in dsXMLCFDI.Tables["Concepto"].Rows)
                {
                    row = DTConceptos.NewRow();
                    try
                    {
                        row["Descripcion"] = dato["Descripcion"].ToString();
                    }
                    catch (Exception)
                    { }
                    try
                    {
                        row["Importe"] = dato["importe"].ToString();
                    }
                    catch (Exception)
                    { }
                    try
                    {
                        row["ValorUnitario"] = dato["valorUnitario"].ToString();
                    }
                    catch (Exception)
                    { }
                    try
                    {
                        row["Cantidad"] = dato["cantidad"].ToString();
                    }
                    catch (Exception)
                    { }
                    try
                    {
                        row["ClaveUnidad"] = dato["ClaveUnidad"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        row["ClaveProdServ"] = dato["ClaveProdServ"].ToString();
                    }
                    catch (Exception)
                    { }
                    DTConceptos.Rows.Add(row);
                    a = a + 1;
                }
                CFDINomina.Conceptos = DTConceptos;

                try
                {
                    foreach (DataRow dato in dsXMLCFDI.Tables["Traslado"].Rows)
                    {
                        CFDINomina.TotalImpuestosTrasladados = dato["Importe"].ToString();
                    }
                }
                catch(Exception ex)
                { }

                try
                {
                    foreach (DataRow dato in dsXMLCFDI.Tables["Retencion"].Rows)
                    {
                        CFDINomina.TotalImpuestosTrasladados = dato["Importe"].ToString();
                    }
                }
                catch (Exception ex)
                { CFDINomina.TotalImpuestosTrasladados = "0.00"; }


                try
                {
                    foreach (DataRow dato in dsXMLCFDI.Tables["Impuestos"].Rows)
                    {
                        try
                        {
                            CFDINomina.TotalImpuestosTrasladados = dato["TotalImpuestosTrasladados"].ToString();
                        }
                        catch (Exception ex)
                        { }

                        try
                        {
                            CFDINomina.TotalImpuestosRetenidos = dato["TotalImpuestosRetenidos"].ToString();
                        }
                        catch (Exception ex)
                        { }
                    }
                }
                catch (Exception ex)
                { }                

                //Nodo TFD
                foreach (DataRow dato in dsXMLCFDI.Tables["TimbreFiscalDigital"].Rows)
                {
                    try
                    {
                        CFDINomina.UUID = dato["UUID"].ToString();
                        CFDINomina.RfcProvCertif = dato["RfcProvCertif"].ToString();
                        CFDINomina.FechaTimbrado = dato["FechaTimbrado"].ToString();
                        CFDINomina.SelloSAT = dato["selloSAT"].ToString();
                        CFDINomina.SelloCFDI = dato["selloCFD"].ToString();
                        CFDINomina.NumeroSerieCertificadoSAT = dato["noCertificadoSAT"].ToString();
                    }
                    catch (Exception ex)
                    { }
                }                

                return CFDINomina;
            }
            catch (Exception ex)
            {
                //log.Error("Message: " + ex.Message + "######### StackTrace: " + ex.StackTrace.ToString());
                return null;
            }
        }

    }
}
