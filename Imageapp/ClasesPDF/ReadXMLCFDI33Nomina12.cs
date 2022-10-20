using System;
using System.Collections;
using System.Data;
using System.IO;
using System.IO.Compression;
//using System.Windows.Forms;
using System.Xml.Linq;

namespace sat_ws
{
    class ReadXMLCFDI33Nomina12
    {
        
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
                            CFDINomina.MetodoPago = dato["metodoPago"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                            CFDINomina.FormaPago = dato["formaPago"].ToString();
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
                        CFDINomina.RegimenFiscalEmsior = dato["RegimenFiscal"].ToString();
                    }
                    catch (Exception)
                    { }

                }

                //Nodo Receptor
                
                 
                foreach (DataRow dato in dsXMLCFDI.Tables[2].Rows)
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
                        CFDINomina.TotalPercepciones = dato["TotalPercepciones"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.TotalDeducciones = dato["TotalDeducciones"].ToString();
                    }
                    catch (Exception ex)
                    { }

                    try
                    {
                        CFDINomina.TotalOtrosPagos = dato["TotalOtrosPagos"].ToString();
                    }
                    catch (Exception ex)
                    { }

                }

                // Nodo Receptor
                foreach (DataRow dato in dsXMLCFDINomina.Tables["Receptor"].Rows)
                {
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
                        CFDINomina.Antiguedad = dato["Antigüedad"].ToString();
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
                        CFDINomina.Sindicalizado = dato["Sindicalizado"].ToString();
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
                        CFDINomina.CuentaBancaria = dato["CuentaBancaria"].ToString();
                    }
                    catch (Exception)
                    { }


                    try
                    {
                        CFDINomina.SalarioDiarioIntegrado = dato["SalarioDiarioIntegrado"].ToString();
                    }
                    catch (Exception)
                    { }


                    try
                    {
                        CFDINomina.ClaveEntFed = dato["ClaveEntFed"].ToString();
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

                // Separacion Indemnizacion
                foreach (DataRow dato in dsXMLCFDINomina.Tables["SeparacionIndemnizacion"].Rows)
                {
                    try
                    {
                        CFDINomina.IndemnizacionTotalPagado = dato["TotalPagado"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.IndemnizacionNumAñosServicio = dato["NumAñosServicio"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.IndemnizacionUltimoSueldoMensOrd = dato["UltimoSueldoMensOrd"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.IndemnizacionIngresoAcumulable = dato["IngresoAcumulable"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.IndemnizacionIngresoNoAcumulable = dato["IngresoNoAcumulable"].ToString();
                    }
                    catch (Exception)
                    { }
                }

                // Jubilacion Pension Retiro
                foreach (DataRow dato in dsXMLCFDINomina.Tables["JubilacionPensionRetiro"].Rows)
                {
                    try
                    {
                        CFDINomina.JubilacionTotalUnaExhibicion = dato["TotalUnaExhibicion"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.JubilacionTotalParcialidad = dato["TotalParcialidad"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.JubilacionMontoDiario = dato["MontoDiario"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.JubilacionIngresoAcumulable = dato["IngresoAcumulable"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.JubilacionIngresoNoAcumulable = dato["IngresoNoAcumulable"].ToString();
                    }
                    catch (Exception)
                    { }
                }

                // Subcontratación
                foreach (DataRow dato in dsXMLCFDINomina.Tables["SubContratacion"].Rows)
                {
                    try
                    {
                        CFDINomina.RfcLabora = dato["RfcLabora"].ToString();
                    }
                    catch (Exception)
                    { }

                    try
                    {
                        CFDINomina.PorcentajeTiempo = dato["PorcentajeTiempo"].ToString();
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

                Hashtable HTDeducciones = new Hashtable();
                decimal SumDeduccion = 0;
                //Inicializando HTDeducciones
                for (int a = 1; a < 22; a++)
                {
                    HTDeducciones.Add(a.ToString(), "0.00");
                    foreach (DataRow dato in dsXMLCFDINomina.Tables["Deduccion"].Rows)
                    {
                        if (Convert.ToInt16(dato["TipoDeduccion"].ToString()) == a)
                        {
                            SumDeduccion = SumDeduccion + Convert.ToDecimal(dato["Importe"].ToString());
                        }                        
                    }
                    HTDeducciones[a.ToString()] = SumDeduccion;
                    SumDeduccion = 0;
                }

                
                






                //Nodo TFD
                foreach (DataRow dato in dsXMLCFDI.Tables["TimbreFiscalDigital"].Rows)
                {
                    try
                    {
                        CFDINomina.UUID = dato["UUID"].ToString();
                        CFDINomina.FechaTimbrado = dato["FechaTimbrado"].ToString();
                        CFDINomina.RfcProvCertif = dato["RfcProvCertif"].ToString();
                    }
                    catch(Exception ex)
                    {
                        return false;
                    }                    
                }

                XMLConcentradoCFDINomina.CrearXMLConcentradoCFDINomina();
                XMLConcentradoCFDINomina.AgregarCFDINominaXML12(CFDINomina, HTPercepciones, HTDeducciones, xmlDoc,version, true);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

    }
}
