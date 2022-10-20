using System;
using System.Collections;
using System.Data;
using System.IO;
using System.IO.Compression;
//using System.Windows.Forms;
using System.Xml.Linq;

namespace sat_ws
{
    class ReadXMLCFDI32Nomina11
    {
        //private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        public static bool Get( DataSet dsXMLCFDI, DataSet dsXMLCFDINomina,  XDocument xmlDoc, string version)
        {
            try
            {
                CFDINomina CFDINomina = new CFDINomina();

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
                
                foreach (DataRow dato in dsXMLCFDI.Tables[5].Rows)
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
                        CFDINomina.Curp = dato["Curp"].ToString();
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
                        CFDINomina.FechaInicioRelLaboral = dato["FechaInicioRelLaboral"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.Antiguedad = dato["Antiguedad"].ToString();
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
                        CFDINomina.TipoJornada = dato["TipoJornada"].ToString();
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
                        CFDINomina.Departamento = dato["Departamento"].ToString();
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
                        CFDINomina.PeriodicidadPago = dato["PeriodicidadPago"].ToString();
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
                        CFDINomina.CuentaBancaria = dato["CLABE"].ToString();
                    }
                    catch (Exception)
                    { }


                    try
                    {
                        CFDINomina.SalarioDiarioIntegrado = dato["SalarioDiarioIntegrado"].ToString();
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
                        CFDINomina.ImporteMonetario = dato["Descuento"].ToString();
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

                Hashtable HTPercepciones = new Hashtable();
                decimal SumPecepcionGravada = 0;
                decimal SumPecepcionExenta = 0;
                //Inicializando HTPercepciones
                for (int a = 1; a < 40; a++)
                {
                    HTPercepciones.Add(a + "-G", "0.00");
                    HTPercepciones.Add(a + "-E", "0.00");
                    HTPercepciones.Add(a + "-T", "0.00");

                    foreach (DataRow dato in dsXMLCFDINomina.Tables["Percepcion"].Rows)
                    {
                        if(Convert.ToInt16(dato["TipoPercepcion"].ToString()) == a)
                        {
                            SumPecepcionGravada = SumPecepcionGravada + Convert.ToDecimal(dato["ImporteGravado"].ToString());
                            SumPecepcionExenta = SumPecepcionExenta + Convert.ToDecimal(dato["ImporteExento"].ToString());
                        }                                          
                    }
                    HTPercepciones[a + "-G"] = SumPecepcionGravada;
                    HTPercepciones[a + "-E"] = SumPecepcionExenta;
                    HTPercepciones[a + "-T"] = SumPecepcionGravada + SumPecepcionExenta;
                    SumPecepcionGravada = 0;
                    SumPecepcionExenta = 0;
                }


                // Deducciones
                foreach (DataRow dato in dsXMLCFDINomina.Tables["Deducciones"].Rows)
                {
                    try
                    {
                        CFDINomina.TotalDeduccionesImpuestosRetenidos = dato["TotalGravado"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.TotalDeduccionesOtrasDeducciones = dato["TotalExento"].ToString();
                    }
                    catch (Exception)
                    { }
                }

                Hashtable HTDeducciones = new Hashtable();
                decimal SumDeduccionGravada = 0;
                decimal SumDeduccionExcenta = 0;
                //Inicializando HTDeducciones
                for (int a = 1; a < 22; a++)
                {
                    HTDeducciones.Add(a + "-G", "0.00");
                    HTDeducciones.Add(a + "-E", "0.00");
                    HTDeducciones.Add(a + "-T", "0.00");
                    foreach (DataRow dato in dsXMLCFDINomina.Tables["Deduccion"].Rows)
                    {
                        if (Convert.ToInt16(dato["TipoDeduccion"].ToString()) == a)
                        {
                            SumDeduccionGravada = SumDeduccionGravada + Convert.ToDecimal(dato["ImporteGravado"].ToString());
                            SumDeduccionExcenta = SumDeduccionExcenta + Convert.ToDecimal(dato["ImporteExento"].ToString());
                        }                        
                    }
                    HTDeducciones[a.ToString() + "-G"] = SumDeduccionGravada;
                    HTDeducciones[a.ToString() + "-E"] = SumDeduccionExcenta;
                    HTDeducciones[a.ToString() + "-T"] = SumDeduccionExcenta + SumDeduccionGravada;
                    SumDeduccionGravada = 0;
                    SumDeduccionExcenta = 0;
                }



                //Nodo TFD
                foreach (DataRow dato in dsXMLCFDI.Tables["TimbreFiscalDigital"].Rows)
                {
                    try
                    {
                        CFDINomina.UUID = dato["UUID"].ToString();
                        CFDINomina.FechaTimbrado = dato["FechaTimbrado"].ToString();                        
                    }
                    catch(Exception ex)
                    {
                        return false;
                    }                    
                }
                XMLConcentradoCFDINomina.CrearXMLConcentradoCFDINomina();
                XMLConcentradoCFDINomina.AgregarCFDINominaXML11(CFDINomina, HTPercepciones, HTDeducciones, xmlDoc, version, true);

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
