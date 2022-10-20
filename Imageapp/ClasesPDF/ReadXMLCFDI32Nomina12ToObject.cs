using System;
using System.Collections;
using System.Data;
using System.IO;
using System.IO.Compression;
//using System.Windows.Forms;
using System.Xml.Linq;

namespace sat_ws
{
    class ReadXMLCFDI32Nomina12ToObject
    {
        //private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        public static bool Get(DataSet dsXMLCFDI, DataSet dsXMLCFDINomina, XDocument xmlDoc, string version, string RutaXML)
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
                    { }

                    try
                    {
                        CFDINomina.FormaPago = dato["formadePago"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.Moneda = dato["Moneda"].ToString();
                    }
                    catch (Exception)
                    { }
                }

                //Nodo Emisor
                foreach (DataRow dato in dsXMLCFDI.Tables[1].Rows)
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
                        foreach (DataRow datoRegimen in dsXMLCFDI.Tables[1].DataSet.Tables["RegimenFiscal"].Rows)
                        {
                            try
                            {
                                CFDINomina.RegimenFiscalEmsior = datoRegimen["Regimen"].ToString();
                            }
                            catch (Exception)
                            { }
                        }
                    }
                    catch (Exception)
                    { }
                }

                //Nodo Receptor                
                foreach (DataRow dato in dsXMLCFDI.Tables[3].Rows)
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
                }


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

                foreach (DataRow dato in dsXMLCFDI.Tables[5].Rows)
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
                        row["ClaveUnidad"] = dato["unidad"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        row["ValorUnitario"] = dato["ClaveProdServ"].ToString();
                    }
                    catch (Exception)
                    { }
                    DTConceptos.Rows.Add(row);
                    a = a + 1;
                }
                CFDINomina.Conceptos = DTConceptos;


                //Nodo Impuestos                
                foreach (DataRow dato in dsXMLCFDI.Tables[9].Rows)
                {
                    try
                    {
                        CFDINomina.TotalImpuestosTrasladados = dato["totalImpuestosTrasladados"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.TotalImpuestosRetenidos = dato["totalImpuestosRetenidos"].ToString();
                    }
                    catch (Exception)
                    { }
                }

                // Nodo Nómina
                foreach (DataRow dato in dsXMLCFDINomina.Tables["Nomina"].Rows)
                {
                    try
                    {
                        CFDINomina.TipoNomina = dato["TipoNomina"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.FechaPago = dato["FechaPago"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.FechaInicialPago = dato["FechaInicialPago"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.FechaFinalPago = dato["FechaFinalPago"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.NumDiasPagados = dato["NumDiasPagados"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.TotalDeducciones = dato["TotalDeducciones"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.TotalPercepciones = dato["TotalPercepciones"].ToString();
                    }
                    catch (Exception)
                    { }
                }


                // Nodo Emisor Nómina
                foreach (DataRow dato in dsXMLCFDINomina.Tables["Receptor"].Rows)
                {
                    try
                    {
                        CFDINomina.SalarioDiarioIntegrado = dato["SalarioDiarioIntegrado"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.RiesgoPuesto = dato["RiesgoPuesto"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.SalarioDiarioIntegrado = dato["SalarioBaseCotApor"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.PeriodicidadPago = dato["PeriodicidadPago"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.TipoJornada = dato["TipoJornada"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.TipoContrato = dato["TipoContrato"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.FechaInicioRelLaboral = dato["FechaInicioRelLaboral"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.Banco = dato["Banco"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.Departamento = dato["Departamento"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.NumSeguridadSocial = dato["NumSeguridadSocial"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.TipoRegimen = dato["TipoRegimen"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.NumeroEmpleado = dato["NumEmpleado"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.ClaveEntFed = dato["ClaveEntFed"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.Sindicalizado = dato["Sindicalizado"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.Antiguedad = dato["Antigüedad"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.Curp = dato["Curp"].ToString();
                    }
                    catch (Exception)
                    { }
                }


                // Nodo Horas extra
                foreach (DataRow dato in dsXMLCFDINomina.Tables["HorasExtra"].Rows)
                {
                    try
                    {
                        CFDINomina.Dias = dato["Dias"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.TipoHoras = dato["TipoHoras"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.HorasExtra = dato["HorasExtra"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.ImportePagado = dato["ImportePagado"].ToString();
                    }
                    catch (Exception)
                    { }
                }

                // Nodo Incapacidad
                foreach (DataRow dato in dsXMLCFDINomina.Tables["Incapacidad"].Rows)
                {
                    try
                    {
                        CFDINomina.DiasIncapacidad = dato["DiasIncapacidad"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.TipoIncapacidad = dato["TipoIncapacidad"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.ImporteMonetario = dato["ImporteMonetario"].ToString();
                    }
                    catch (Exception)
                    { }
                }


                // Percepciones
                foreach (DataRow dato in dsXMLCFDINomina.Tables["Percepciones"].Rows)
                {
                    try
                    {
                        CFDINomina.TotalPercepcionesGravadas = dato["TotalGravado"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.TotalPercepcionesExentas = dato["TotalExento"].ToString();
                    }
                    catch (Exception)
                    { }                    
                }


                decimal SumPecepcionGravada = 0;
                decimal SumPecepcionExenta = 0;
                string ConceptoPercepcion = "";
                //Inicializando HTPercepciones
                for (int n = 1; n < 40; n++)
                {
                    HTPercepciones.Add(n + "-G", "0.00");
                    HTPercepciones.Add(n + "-E", "0.00");
                    HTPercepciones.Add(n + "-T", "0.00");

                    foreach (DataRow dato in dsXMLCFDINomina.Tables["Percepcion"].Rows)
                    {
                        if (Convert.ToInt16(dato["TipoPercepcion"].ToString()) == n)
                        {
                            SumPecepcionGravada = SumPecepcionGravada + Convert.ToDecimal(dato["ImporteGravado"].ToString());
                            SumPecepcionExenta = SumPecepcionExenta + Convert.ToDecimal(dato["ImporteExento"].ToString());
                            ConceptoPercepcion = dato["Concepto"].ToString();
                        }
                        
                    }
                    HTPercepciones[n + "-G"] = SumPecepcionGravada;
                    HTPercepciones[n + "-E"] = SumPecepcionExenta;
                    HTPercepciones[n + "-T"] = SumPecepcionGravada + SumPecepcionExenta;
                    HTPercepciones[n + "-C"] = ConceptoPercepcion;
                    SumPecepcionGravada = 0;
                    SumPecepcionExenta = 0;
                }


                // Deducciones
                foreach (DataRow dato in dsXMLCFDINomina.Tables["Deducciones"].Rows)
                {
                    try
                    {
                        CFDINomina.TotalDeduccionesImpuestosRetenidos = dato["TotalImpuestosRetenidos"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.TotalDeduccionesOtrasDeducciones = dato["TotalOtrasDeducciones"].ToString();
                    }
                    catch (Exception)
                    { }
                }

                
                decimal SumDeduccion = 0;
                string Concepto = "";
                //Inicializando HTDeducciones
                for (int m = 1; m < 22; m++)
                {
                    HTDeducciones.Add(m.ToString(), "0.00");
                    foreach (DataRow dato in dsXMLCFDINomina.Tables["Deduccion"].Rows)
                    {
                        if (Convert.ToInt16(dato["TipoDeduccion"].ToString()) == m)
                        {
                            SumDeduccion = SumDeduccion + Convert.ToDecimal(dato["Importe"].ToString());
                            Concepto = dato["Concepto"].ToString();
                        }                       
                    }
                    HTDeducciones[m.ToString()] = SumDeduccion + "&" + Concepto;
                    SumDeduccion = 0;
                }



                //Nodo TFD
                foreach (DataRow dato in dsXMLCFDI.Tables["TimbreFiscalDigital"].Rows)
                {
                    try
                    {
                        CFDINomina.UUID = dato["UUID"].ToString();
                        CFDINomina.FechaTimbrado = dato["FechaTimbrado"].ToString();
                        CFDINomina.SelloSAT = dato["selloSAT"].ToString();
                        CFDINomina.SelloCFDI = dato["selloCFD"].ToString();
                        CFDINomina.NumeroSerieCertificadoSAT = dato["noCertificadoSAT"].ToString();
                    }
                    catch (Exception)
                    { }
                }
                GeneraPDFFactura.GeneraRepresentacionImpresa(RutaXML.Replace(".xml", ".pdf").Replace(".XML", ".pdf"), CFDINomina, HTPercepciones, HTDeducciones, version);

                return true;
            }
            catch (Exception ex)
            {
                //log.Error("Message: " + ex.Message + "######### StackTrace: " + ex.StackTrace.ToString());
                return false;
            }
        }

    }
}
