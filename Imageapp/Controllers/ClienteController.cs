using ICSharpCode.SharpZipLib.Zip;
using Imageapp.Models.DAL;
using Imageapp.Models.Utils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using XMLtoPDF;

namespace Imageapp.Controllers
{
    public class ClienteController : Controller
    {
        Result result = new Result();

        [SessionAuthorize]
        public ActionResult Inicio()
        {
            if (!ValidarAccesoVista("Cliente", "Inicio"))
                return RedirectToAction("Inicio", "Inicio");

            tbc_Usuarios user = Session["tbc_Usuarios"] as tbc_Usuarios;
            String rfc = user.usuario;
            ViewBag.rfc = rfc;
            return View();
        }

        public string GetInicio(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetInicio(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult Ingresos()
        {
            if (!ValidarAccesoVista("Cliente", "Ingresos"))
                return RedirectToAction("Inicio", "Inicio");

            tbc_Usuarios user = Session["tbc_Usuarios"] as tbc_Usuarios;
            String rfc = user.usuario;
            ViewBag.rfc = rfc;
            ViewBag.id_regimen = user.id_regimen;
            return View();
        }

        public string GetIngresos(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetIngresos(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }

        public string GetSueldos(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetSueldos(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }

        public string GetComplementoCobro(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetComplementoCobro(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }

        public string GetNotaCredito(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetNotaCredito(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }

        public string GetCanceladosEmitidos(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetCanceladosEmitidos(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult Gastos()
        {
            if (!ValidarAccesoVista("Cliente", "Gastos"))
                return RedirectToAction("Inicio", "Inicio");

            tbc_Usuarios user = Session["tbc_Usuarios"] as tbc_Usuarios;
            String rfc = user.usuario;
            ViewBag.rfc = rfc;
            return View();
        }

        public string GetEgresos(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetEgresos(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }

        public string GetNominas(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetNominas(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }

        public string GetComplementoPago(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetComplementoPago(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }

        public string GetNotaCreditoGasto(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetNotaCreditoGasto(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }

        public string GetCanceladosRecibidos(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetCanceladosRecibidos(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult Documentos()
        {
            if (!ValidarAccesoVista("Cliente", "Documentos"))
                return RedirectToAction("Inicio", "Inicio");

            tbc_Usuarios user = Session["tbc_Usuarios"] as tbc_Usuarios;
            String rfc = user.usuario;
            ViewBag.rfc = rfc;
            ViewBag.id_regimen = user.id_regimen;
            return View();
        }

        public string GetDocumentos(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetDocumentos(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }

        public string AddRepositorio(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/Repositorio");
            dAL_Clientes.AddRepositoriosC(jsonJS, Request, path);
            return dAL_Clientes.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult Reportes()
        {
            if (!ValidarAccesoVista("Cliente", "Documentos"))
                return RedirectToAction("Inicio", "Inicio");

            tbc_Usuarios user = Session["tbc_Usuarios"] as tbc_Usuarios;
            String rfc = user.usuario;
            ViewBag.rfc = rfc;
            ViewBag.id_regimen = user.id_regimen;
            return View();
        }

        [HttpGet]
        public virtual FileResult getDescarga(string file, string uuid, Int32 tipo)
        {
            string fullPath = "C:\\XML\\Procesado" + file.Replace('_', '\\');
            if (tipo == 1)
            {
                return File(fullPath, "application/xml", uuid + ".xml");
            }
            else
            {
                funciones.CargaXMLtoPDF(fullPath);
                return File(Path.ChangeExtension(fullPath, ".pdf"), "application/pdf", uuid + ".pdf");

                #region Descarga y generacion PDF
                //string path = fullPath.Substring(0, fullPath.Length - 40);
                //string archivo = fullPath.Replace(".xml", ".pdf");
                //string nombre = fullPath.Replace(path, "");
                //nombre = nombre.Replace(".xml", "");
                //bool fileExist = System.IO.File.Exists(archivo);
                //if (!fileExist)
                //{
                //    using (StreamReader reader = new StreamReader(fullPath))
                //    {
                //        XmlDocument xmlDoc = new XmlDocument();
                //        xmlDoc.Load(reader);

                //        foreach (var Comprobante in xmlDoc.ChildNodes)
                //        {
                //            if (Comprobante.GetType() == typeof(XmlElement))
                //            {
                //                var _comprobante = (Comprobante as XmlElement);
                //                if (_comprobante.LocalName == "Comprobante")
                //                {
                //                    //Abrir Formato

                //                    string nombrearchivo = "";
                //                    string fileName = "";
                //                    object ObjMiss = System.Reflection.Missing.Value;
                //                    Word.Application ObjWord = new Word.Application();
                //                    Word.Table Otable;
                //                    Word.Table TablaPercepciones;
                //                    Word.Table TablaOperadores;
                //                    Word.Table TablaMercancias;
                //                    Word.Table TablaRemitentes;
                //                    Word.Table TablaCFDIRelacionados;
                //                    Word.Table TablaDeducciones;
                //                    Word.Table TablaCFDIsRelacionados;
                //                    //Fin Abrir Formato


                //                    String _version = "";

                //                    //!Comprobante
                //                    DateTime _fechaEmision;
                //                    Decimal _tipoCambio = 0;
                //                    String _serie = "";
                //                    String _folio = "";
                //                    String _moneda = "";
                //                    Decimal _total_original = 0;
                //                    Decimal _subtotal = 0;
                //                    String _metodoPago = "";
                //                    String _formaPago = "";
                //                    String _tipoComprobante = "";
                //                    Decimal _descuento = 0;
                //                    String _lugarExpedicion = "";
                //                    String _exportacion = "";
                //                    String _NoCertificado = "";

                //                    //Emisor
                //                    String _rfcEmisor = "";
                //                    String _nombreEmisor = "";
                //                    String _regimenFiscal = "";


                //                    //!Receptor
                //                    String _rfcReceptor = "";
                //                    String _nombreReceptor = "";
                //                    String _usoCFDI = "";
                //                    String _regimenFiscalReceptor = "";
                //                    String _domicilioFiscalReceptor = "";

                //                    //!TimbreFiscalDigital
                //                    DateTime _fechaTimbrado = DateTime.Now;
                //                    String _uuid = "";
                //                    String _versionTimbreFiscalDigital = "";
                //                    String _certificadoSAT = "";
                //                    String _selloDigital = "";
                //                    String _selloSAT = "";

                //                    //!CartaPorte
                //                    String _transpInter = "";
                //                    String _totalDistancia = "";

                //                    //!CartaPorte - Ubicaciones
                //                    String _idUbicacionOrigen = "";
                //                    String _rfcRemDesOrigen = "";
                //                    String _nombreRemDesOrigen = "";
                //                    String _distanciaRecorridaOrigen = "";
                //                    DateTime _fechaHoraOrigen = DateTime.Now;
                //                    String _calleOrigen = "";
                //                    String _coloniaOrigen = "";
                //                    String _localidadOrigen = "";
                //                    String _municipioOrigen = "";
                //                    String _estadoOrigen = "";
                //                    String _paisOrigen = "";
                //                    String _cpOrigen = "";
                //                    String _direccionOrigen = "";

                //                    String _idUbicacionDestino = "";
                //                    String _rfcRemDesDestino = "";
                //                    String _nombreRemDesDestino = "";
                //                    String _distanciaRecorridaDestino = "";
                //                    DateTime _fechaHoraDestino = DateTime.Now;
                //                    String _calleDestino = "";
                //                    String _coloniaDestino = "";
                //                    String _localidadDestino = "";
                //                    String _municipioDestino = "";
                //                    String _estadoDestino = "";
                //                    String _paisDestino = "";
                //                    String _cpDestino = "";
                //                    String _direccionDestino = "";

                //                    //!CartaPorte - Mercancias
                //                    String _pesoBrutoTotal = "";
                //                    String _unidadPeso = "";
                //                    String _numTotalMercancias = "";

                //                    //!CartaPorte - Mercancia
                //                    String _bienesTrans = "";
                //                    String _descripcionMerca = "";
                //                    String _cantidadMerca = "";
                //                    String _claveUnidadMerca = "";
                //                    String _unidadMerca = "";
                //                    String _pesoKG = "";

                //                    //!CartaPorte - AutoTransporte
                //                    String _permSCT = "";
                //                    String _numPermisoSCT = "";

                //                    //!CartaPorte - IdentificacionVehicular
                //                    String _configVehivular = "";
                //                    String _placaVM = "";
                //                    String _anioModelo = "";

                //                    //!CartaPorte - Seguros
                //                    String _aseguraRespCivil = "";
                //                    String _polizaRespCivil = "";

                //                    //!CartaPorte - Remolques
                //                    String _subTipoRem = "";
                //                    String _placaRemolque = "";


                //                    //!CartaPorte - FiguraTransporte
                //                    String _tipoFigura = "";
                //                    String _rfcFigura = "";
                //                    String _numLicenciaFigura = "";
                //                    String _nombreFigura = "";



                //                    //!CFDIRelacionados
                //                    String _tipoRelacion = "";
                //                    String _uuidRelacion = "";

                //                    //!Nomina
                //                    String _versionNomina = "";
                //                    String _tipoNomina = "";
                //                    DateTime _fechaPago;
                //                    DateTime _fechaInicialPago = DateTime.Now;
                //                    DateTime _fechaFinalPago = DateTime.Now;
                //                    Decimal _numDiasPagados = 0;
                //                    Decimal _totalPercepciones = 0;
                //                    Decimal _totalDeducciones = 0;
                //                    Decimal _totalOtrosPagos = 0;
                //                    //!Emisor
                //                    String _registroPatronal = "";

                //                    //!Receptor
                //                    String _puesto = "";
                //                    String _tipoRegimen = "";
                //                    String _numEmpleado = "";
                //                    String _curp = "";
                //                    String _numSeguridadSocial = "";
                //                    String _departamento = "";
                //                    ;
                //                    //!Concepto
                //                    String _claveUnidad = "";
                //                    String _claveProdServ = "";
                //                    Decimal _cantidad = 0;
                //                    String _descripcion = "";
                //                    Decimal _valorUnitario = 0;
                //                    String _unidad = "";
                //                    Decimal _importe = 0;

                //                    Decimal _descuentoConcepto = 0;

                //                    //!Impuestos
                //                    Decimal _TotalImpuestosTrasladados = 0;
                //                    Decimal _importeRetencion = 0;
                //                    Decimal _TotalImpuestosRetenidos = 0;

                //                    //! Version del CFDI
                //                    //if (_comprobante.HasAttribute("version"))
                //                    //{
                //                    _version = _comprobante.GetAttribute("Version").ToString();
                //                    //}



                //                    #region 4.0                            
                //                    //! Datos generales
                //                    _NoCertificado = _comprobante.HasAttribute("NoCertificado") ? _comprobante.GetAttribute("NoCertificado").ToString() : "";
                //                    _fechaEmision = _comprobante.HasAttribute("Fecha") ? DateTime.Parse(_comprobante.GetAttribute("Fecha").ToString()) : DateTime.Now;
                //                    _tipoCambio = _comprobante.HasAttribute("TipoCambio") ? Convert.ToDecimal(_comprobante.GetAttribute("TipoCambio").ToString()) : 1;
                //                    _serie = _comprobante.HasAttribute("Serie") ? _comprobante.GetAttribute("Serie").ToString() : "- ";
                //                    _folio = _comprobante.HasAttribute("Folio") ? _comprobante.GetAttribute("Folio").ToString() : "";
                //                    _lugarExpedicion = _comprobante.HasAttribute("LugarExpedicion") ? _comprobante.GetAttribute("LugarExpedicion").ToString() : "";
                //                    _exportacion = _comprobante.HasAttribute("Exportacion") ? _comprobante.GetAttribute("Exportacion").ToString() : "";
                //                    _moneda = _comprobante.HasAttribute("Moneda") ? _comprobante.GetAttribute("Moneda").ToString() : "";
                //                    _total_original = _comprobante.HasAttribute("Total") ? Convert.ToDecimal(_comprobante.GetAttribute("Total").ToString()) : 0;
                //                    _subtotal = _comprobante.HasAttribute("SubTotal") ? Convert.ToDecimal(_comprobante.GetAttribute("SubTotal").ToString()) : 0;
                //                    _tipoComprobante = _comprobante.HasAttribute("TipoDeComprobante") ? _comprobante.GetAttribute("TipoDeComprobante").ToString() : "-";
                //                    _formaPago = _comprobante.HasAttribute("FormaPago") ? _comprobante.GetAttribute("FormaPago").ToString() : "-";
                //                    _metodoPago = _comprobante.HasAttribute("MetodoPago") ? _comprobante.GetAttribute("MetodoPago").ToString() : "-";
                //                    _descuento = _comprobante.HasAttribute("Descuento") ? Convert.ToDecimal(_comprobante.GetAttribute("Descuento").ToString()) : 0;

                //                    if (_tipoComprobante == "N")
                //                    {
                //                        nombrearchivo = "Nomina.docx";
                //                    }
                //                    else if (_tipoComprobante == "I" || _tipoComprobante == "E")
                //                    {
                //                        nombrearchivo = "CFDI40.docx";
                //                    }
                //                    else if (_tipoComprobante == "T")
                //                    {
                //                        nombrearchivo = "CartaPorte.docx";
                //                    }
                //                    else if (_tipoComprobante == "P")
                //                    {
                //                        nombrearchivo = "ComplementoPago.docx";
                //                    }
                //                    Word.Document ObjDoc = ObjWord.Documents.Open(@"c:\XML\Formatos Base\" + nombrearchivo, ObjMiss);
                //                    //Inicializar Tabla 4.0
                //                    object Agregar_Tabla = "Agregar_Tabla";
                //                    Word.Range AgregarTabla = ObjDoc.Bookmarks.get_Item(ref Agregar_Tabla).Range;
                //                    Otable = ObjDoc.Tables.Add(AgregarTabla, 1, 1);
                //                    //Fin Inicializar Tabla 4.0
                //                    //!Nodo Principales
                //                    foreach (var Nodos in _comprobante.ChildNodes)
                //                    {
                //                        if (Nodos.GetType() == typeof(XmlElement))
                //                        {
                //                            var _nodo = (Nodos as XmlElement);
                //                            if (_nodo.LocalName == "Complemento")
                //                            {
                //                                //!Complementos
                //                                foreach (var Complemento in _nodo.ChildNodes)
                //                                {
                //                                    if (Complemento.GetType() == typeof(XmlElement))
                //                                    {
                //                                        var _complemento = (Complemento as XmlElement);
                //                                        if (_complemento.LocalName == "TimbreFiscalDigital")
                //                                        {
                //                                            //!Timbre Fiscal Digital
                //                                            _uuid = _complemento.HasAttribute("UUID") ? _complemento.GetAttribute("UUID").ToString() : "";
                //                                            _fechaTimbrado = _complemento.HasAttribute("FechaTimbrado") ? DateTime.Parse(_complemento.GetAttribute("FechaTimbrado").ToString()) : DateTime.Now;
                //                                            _versionTimbreFiscalDigital = _complemento.HasAttribute("Version") ? _complemento.GetAttribute("Version").ToString() : "";
                //                                            _certificadoSAT = _complemento.HasAttribute("NoCertificadoSAT") ? _complemento.GetAttribute("NoCertificadoSAT").ToString() : "";
                //                                            _selloDigital = _complemento.HasAttribute("SelloCFD") ? _complemento.GetAttribute("SelloCFD").ToString() : "";
                //                                            _selloSAT = _complemento.HasAttribute("SelloSAT") ? _complemento.GetAttribute("SelloSAT").ToString() : "";
                //                                        }
                //                                    }
                //                                }
                //                            }
                //                            if (_nodo.LocalName == "Emisor")
                //                            {
                //                                //!Emisor
                //                                _rfcEmisor = _nodo.HasAttribute("Rfc") ? _nodo.GetAttribute("Rfc").ToString() : "";
                //                                _nombreEmisor = _nodo.HasAttribute("Nombre") ? _nodo.GetAttribute("Nombre").ToString() : "";
                //                                _regimenFiscal = _nodo.HasAttribute("RegimenFiscal") ? _nodo.GetAttribute("RegimenFiscal").ToString() : "";
                //                            }
                //                            else if (_nodo.LocalName == "Receptor")
                //                            {
                //                                //!Receptor
                //                                _rfcReceptor = _nodo.HasAttribute("Rfc") ? _nodo.GetAttribute("Rfc").ToString() : "";
                //                                _nombreReceptor = _nodo.HasAttribute("Nombre") ? _nodo.GetAttribute("Nombre").ToString() : "";
                //                                _usoCFDI = _nodo.HasAttribute("UsoCFDI") ? _nodo.GetAttribute("UsoCFDI").ToString() : "";
                //                                _regimenFiscalReceptor = _nodo.HasAttribute("RegimenFiscalReceptor") ? _nodo.GetAttribute("RegimenFiscalReceptor").ToString() : "";
                //                                _domicilioFiscalReceptor = _nodo.HasAttribute("DomicilioFiscalReceptor") ? _nodo.GetAttribute("DomicilioFiscalReceptor").ToString() : "";
                //                            }
                //                            else if (_nodo.LocalName == "CfdiRelacionados")
                //                            {
                //                                //!CFDIRelacionados
                //                                _tipoRelacion = _nodo.HasAttribute("TipoRelacion") ? _nodo.GetAttribute("TipoRelacion").ToString() : "";

                //                                object Tabla_CFDI_Relacionados = "Tabla_CFDI_Relacionados";
                //                                Word.Range TablaCFDI_Relacionados = ObjDoc.Bookmarks.get_Item(ref Tabla_CFDI_Relacionados).Range;
                //                                TablaCFDIsRelacionados = ObjDoc.Tables.Add(TablaCFDI_Relacionados, _nodo.ChildNodes.Count, 1);
                //                                TablaCFDIsRelacionados.Range.Font.Size = 8;


                //                                TablaCFDIsRelacionados.Borders[Word.WdBorderType.wdBorderHorizontal].Visible = false;
                //                                TablaCFDIsRelacionados.Borders[Word.WdBorderType.wdBorderVertical].Visible = false;

                //                                var i = 1;
                //                                foreach (var Relacionados in _nodo.ChildNodes)
                //                                {
                //                                    if (Relacionados.GetType() == typeof(XmlElement))
                //                                    {
                //                                        var _relacionados = (Relacionados as XmlElement);
                //                                        _uuidRelacion = _relacionados.HasAttribute("UUID") ? _relacionados.GetAttribute("UUID").ToString() : "";
                //                                        TablaCFDIsRelacionados.Cell(i, 1).Range.Text = _uuidRelacion.ToString();
                //                                    }
                //                                    i++;
                //                                }

                //                            }
                //                            else if (_nodo.LocalName == "Impuestos")
                //                            {
                //                                //!Impuestos
                //                                _TotalImpuestosTrasladados = _nodo.HasAttribute("TotalImpuestosTrasladados") ? Convert.ToDecimal(_nodo.GetAttribute("TotalImpuestosTrasladados").ToString()) : 0;
                //                                _TotalImpuestosRetenidos = _nodo.HasAttribute("TotalImpuestosRetenidos") ? Convert.ToDecimal(_nodo.GetAttribute("TotalImpuestosRetenidos").ToString()) : 0;

                //                                foreach (var Impuestos in _nodo.ChildNodes)
                //                                {
                //                                    if (Impuestos.GetType() == typeof(XmlElement))
                //                                    {
                //                                        //var _impuestos = (Impuestos as XmlElement);
                //                                        //if (_impuestos.LocalName == "Impuestos")
                //                                        //{
                //                                        //    foreach (var Impuesto in _impuestos.ChildNodes)
                //                                        //    {
                //                                        //        if (Impuesto.GetType() == typeof(XmlElement))
                //                                        //        {
                //                                        var _impuesto = (Impuestos as XmlElement);
                //                                        if (_impuesto.LocalName == "Traslados")
                //                                        {
                //                                            //!Impuesto -> Traslados
                //                                            foreach (var Traslados in _impuesto.ChildNodes)
                //                                            {
                //                                                if (Traslados.GetType() == typeof(XmlElement))
                //                                                {
                //                                                    var _traslado = (Traslados as XmlElement);
                //                                                    if (_traslado.LocalName == "Traslado")
                //                                                    {
                //                                                        String _impuestoTraslado = _traslado.HasAttribute("Impuesto") ? _traslado.GetAttribute("Impuesto").ToString() : "";
                //                                                        String _tipoFactorTraslado = _traslado.HasAttribute("TipoFactor") ? _traslado.GetAttribute("TipoFactor").ToString() : "";
                //                                                        Decimal _tasaOCuotaTraslado = _traslado.HasAttribute("TasaOCuota") ? Convert.ToDecimal(_traslado.GetAttribute("TasaOCuota").ToString()) : 0;
                //                                                        Decimal _importeTraslado = _traslado.HasAttribute("Importe") ? Convert.ToDecimal(_traslado.GetAttribute("Importe").ToString()) : 0;
                //                                                    }
                //                                                }
                //                                            }
                //                                        }
                //                                        else if (_impuesto.LocalName == "Retenciones")
                //                                        {
                //                                            //!Impuesto -> Retenciones
                //                                            foreach (var Retenciones in _impuesto.ChildNodes)
                //                                            {
                //                                                if (Retenciones.GetType() == typeof(XmlElement))
                //                                                {
                //                                                    var _retencion = (Retenciones as XmlElement);
                //                                                    if (_retencion.LocalName == "Retencion")
                //                                                    {
                //                                                        String _impuestoRetencion = _retencion.HasAttribute("Impuesto") ? _retencion.GetAttribute("Impuesto").ToString() : "";
                //                                                        _importeRetencion = _retencion.HasAttribute("Importe") ? Convert.ToDecimal(_retencion.GetAttribute("Importe").ToString()) : 0;
                //                                                    }
                //                                                }
                //                                            }
                //                                        }
                //                                        //        }
                //                                        //    }
                //                                        //}
                //                                    }
                //                                }
                //                            }
                //                        }
                //                    }

                //                    //!Datos Adicionales

                //                    //!Identificamos que no exista UUID


                //                    string cfdi_relacionados_pagos = "";

                //                    String listaConceptos = "";

                //                    //!Nodos Principales
                //                    foreach (var Nodos in _comprobante.ChildNodes)
                //                    {
                //                        if (Nodos.GetType() == typeof(XmlElement))
                //                        {
                //                            var _nodo = (Nodos as XmlElement);

                //                            if (_nodo.LocalName == "Conceptos")
                //                            {
                //                                //Crear tabla CFDI 4.0
                //                                if (_tipoComprobante == "I" || _tipoComprobante == "E")
                //                                {
                //                                    Otable = ObjDoc.Tables.Add(AgregarTabla, _nodo.ChildNodes.Count, 8);
                //                                    Otable.Range.Font.Size = 8;

                //                                    Otable.Columns[1].SetWidth(50, 0);
                //                                    Otable.Columns[2].SetWidth(50, 0);
                //                                    Otable.Columns[3].SetWidth(55, 0);
                //                                    Otable.Columns[4].SetWidth(58, 0);
                //                                    Otable.Columns[5].SetWidth(197, 0);
                //                                    Otable.Columns[6].SetWidth(53, 0);
                //                                    Otable.Columns[7].SetWidth(60, 0);
                //                                    Otable.Columns[8].SetWidth(57, 0);
                //                                    Otable.Borders[Word.WdBorderType.wdBorderHorizontal].Visible = false;
                //                                    Otable.Borders[Word.WdBorderType.wdBorderVertical].Visible = false;
                //                                }
                //                                else if (_tipoComprobante == "T")
                //                                {
                //                                    Otable = ObjDoc.Tables.Add(AgregarTabla, _nodo.ChildNodes.Count, 6);
                //                                    Otable.Range.Font.Size = 8;

                //                                    Otable.Columns[1].SetWidth(62, 0);
                //                                    Otable.Columns[2].SetWidth(57, 0);
                //                                    Otable.Columns[3].SetWidth(230, 0);
                //                                    Otable.Columns[4].SetWidth(90, 0);
                //                                    Otable.Columns[5].SetWidth(66, 0);
                //                                    Otable.Columns[6].SetWidth(85, 0);

                //                                    Otable.Borders[Word.WdBorderType.wdBorderHorizontal].Visible = false;
                //                                    Otable.Borders[Word.WdBorderType.wdBorderVertical].Visible = false;
                //                                }
                //                                else if (_tipoComprobante == "P")
                //                                {
                //                                    Otable = ObjDoc.Tables.Add(AgregarTabla, _nodo.ChildNodes.Count, 6);
                //                                    Otable.Range.Font.Size = 8;

                //                                    Otable.Columns[1].SetWidth(62, 0);
                //                                    Otable.Columns[2].SetWidth(57, 0);
                //                                    Otable.Columns[3].SetWidth(230, 0);
                //                                    Otable.Columns[4].SetWidth(90, 0);
                //                                    Otable.Columns[5].SetWidth(66, 0);
                //                                    Otable.Columns[6].SetWidth(85, 0);

                //                                    Otable.Borders[Word.WdBorderType.wdBorderHorizontal].Visible = false;
                //                                    Otable.Borders[Word.WdBorderType.wdBorderVertical].Visible = false;
                //                                }
                //                                //Fin Crear Tabla CFDI 4.0
                //                                //!Conceptos
                //                                var i = 1;
                //                                foreach (var Concepto in _nodo.ChildNodes)
                //                                {
                //                                    if (Concepto.GetType() == typeof(XmlElement))
                //                                    {
                //                                        //! Concepto
                //                                        _cantidad = 0;
                //                                        _claveProdServ = "";
                //                                        _claveUnidad = "";
                //                                        _descripcion = "";
                //                                        _descuentoConcepto = 0;
                //                                        _importe = 0;
                //                                        _unidad = "";
                //                                        _valorUnitario = 0;
                //                                        String _objetoImp = "";

                //                                        var _concepto = (Concepto as XmlElement);

                //                                        _cantidad = _concepto.HasAttribute("Cantidad") ? Convert.ToDecimal(_concepto.GetAttribute("Cantidad").ToString()) : 0;
                //                                        if (_tipoComprobante == "I" || _tipoComprobante == "E")
                //                                        {
                //                                            Otable.Cell(i, 1).Range.Text = _cantidad.ToString("0,0.00");
                //                                        }
                //                                        if (_tipoComprobante == "T")
                //                                        {
                //                                            Otable.Cell(i, 1).Range.Text = _cantidad.ToString("0,0.00");
                //                                        }
                //                                        if (_tipoComprobante == "P")
                //                                        {
                //                                            Otable.Cell(i, 2).Range.Text = _cantidad.ToString("0,0.00");
                //                                        }
                //                                        _claveProdServ = _concepto.HasAttribute("ClaveProdServ") ? _concepto.GetAttribute("ClaveProdServ").ToString() : "";
                //                                        if (_tipoComprobante == "I" || _tipoComprobante == "E")
                //                                        {
                //                                            Otable.Cell(i, 4).Range.Text = _claveProdServ.ToString();
                //                                        }
                //                                        if (_tipoComprobante == "P")
                //                                        {
                //                                            Otable.Cell(i, 1).Range.Text = _claveProdServ.ToString();
                //                                        }
                //                                        _claveUnidad = _concepto.HasAttribute("ClaveUnidad") ? _concepto.GetAttribute("ClaveUnidad").ToString() : "";
                //                                        if (_tipoComprobante == "I" || _tipoComprobante == "E")
                //                                        {
                //                                            Otable.Cell(i, 3).Range.Text = _claveUnidad.ToString();
                //                                        }
                //                                        if (_tipoComprobante == "P")
                //                                        {
                //                                            Otable.Cell(i, 4).Range.Text = _claveUnidad.ToString();
                //                                        }
                //                                        _descripcion = _concepto.HasAttribute("Descripcion") ? _concepto.GetAttribute("Descripcion").ToString() : "";
                //                                        if (_tipoComprobante == "I" || _tipoComprobante == "E")
                //                                        {
                //                                            Otable.Cell(i, 5).Range.Text = _descripcion.ToString();
                //                                        }
                //                                        if (_tipoComprobante == "T")
                //                                        {
                //                                            Otable.Cell(i, 3).Range.Text = _descripcion.ToString();
                //                                        }
                //                                        if (_tipoComprobante == "P")
                //                                        {
                //                                            Otable.Cell(i, 3).Range.Text = _descripcion.ToString();
                //                                        }
                //                                        _descuentoConcepto = _concepto.HasAttribute("Descuento") ? Convert.ToDecimal(_concepto.GetAttribute("Descuento").ToString()) : 0;

                //                                        _importe = _concepto.HasAttribute("Importe") ? Convert.ToDecimal(_concepto.GetAttribute("Importe").ToString()) : 0;
                //                                        if (_tipoComprobante == "I" || _tipoComprobante == "E")
                //                                        {
                //                                            Otable.Cell(i, 8).Range.Text = _importe.ToString("0,0.00");
                //                                        }
                //                                        if (_tipoComprobante == "T")
                //                                        {
                //                                            Otable.Cell(i, 6).Range.Text = _importe.ToString("0,0.00");
                //                                        }
                //                                        if (_tipoComprobante == "P")
                //                                        {
                //                                            Otable.Cell(i, 6).Range.Text = _importe.ToString("0,0.00");
                //                                        }
                //                                        _unidad = _concepto.HasAttribute("Unidad") ? _concepto.GetAttribute("Unidad").ToString() : "";
                //                                        if (_tipoComprobante == "I" || _tipoComprobante == "E")
                //                                        {
                //                                            Otable.Cell(i, 2).Range.Text = _unidad;
                //                                        }
                //                                        if (_tipoComprobante == "T")
                //                                        {
                //                                            Otable.Cell(i, 2).Range.Text = _unidad;
                //                                        }
                //                                        _valorUnitario = _concepto.HasAttribute("ValorUnitario") ? Convert.ToDecimal(_concepto.GetAttribute("ValorUnitario").ToString()) : 0;
                //                                        if (_tipoComprobante == "I" || _tipoComprobante == "E")
                //                                        {
                //                                            Otable.Cell(i, 6).Range.Text = _valorUnitario.ToString("0,0.00");
                //                                        }
                //                                        if (_tipoComprobante == "T")
                //                                        {
                //                                            Otable.Cell(i, 4).Range.Text = _valorUnitario.ToString("0,0.00");
                //                                        }
                //                                        if (_tipoComprobante == "P")
                //                                        {
                //                                            Otable.Cell(i, 5).Range.Text = _valorUnitario.ToString("0,0.00");
                //                                        }
                //                                        _objetoImp = _concepto.HasAttribute("ObjetoImp") ? _concepto.GetAttribute("ObjetoImp").ToString() : "";
                //                                        if (listaConceptos.Length < 1000)
                //                                        {
                //                                            listaConceptos += listaConceptos + _descripcion + ", ";
                //                                        }

                //                                        foreach (var Impuestos in _concepto.ChildNodes)
                //                                        {
                //                                            if (Impuestos.GetType() == typeof(XmlElement))
                //                                            {
                //                                                //! Concepto -> Impuestos
                //                                                var _impuestos = (Impuestos as XmlElement);
                //                                                if (_impuestos.LocalName == "Impuestos")
                //                                                {
                //                                                    foreach (var Impuesto in _impuestos.ChildNodes)
                //                                                    {
                //                                                        if (Impuesto.GetType() == typeof(XmlElement))
                //                                                        {
                //                                                            var _impuesto = (Impuesto as XmlElement);
                //                                                            if (_impuesto.LocalName == "Traslados")
                //                                                            {
                //                                                                foreach (var Traslados in _impuesto.ChildNodes)
                //                                                                {
                //                                                                    if (Traslados.GetType() == typeof(XmlElement))
                //                                                                    {
                //                                                                        //Traslados
                //                                                                        var _traslado = (Traslados as XmlElement);
                //                                                                        if (_traslado.LocalName == "Traslado")
                //                                                                        {
                //                                                                            Decimal _baseTraslado = _traslado.HasAttribute("Base") ? Convert.ToDecimal(_traslado.GetAttribute("Base").ToString()) : 0;
                //                                                                            String _impuestoTraslado = _traslado.HasAttribute("Impuesto") ? _traslado.GetAttribute("Impuesto").ToString() : "";
                //                                                                            String _tipoFactorTraslado = _traslado.HasAttribute("TipoFactor") ? _traslado.GetAttribute("TipoFactor").ToString() : "";
                //                                                                            Decimal _tasaOCuotaTraslado = _traslado.HasAttribute("TasaOCuota") ? Convert.ToDecimal(_traslado.GetAttribute("TasaOCuota").ToString()) : 0;
                //                                                                            Decimal _importeTraslado = _traslado.HasAttribute("Importe") ? Convert.ToDecimal(_traslado.GetAttribute("Importe").ToString()) : 0;

                //                                                                        }
                //                                                                    }
                //                                                                }
                //                                                            }
                //                                                            else if (_impuesto.LocalName == "Retenciones")
                //                                                            {
                //                                                                foreach (var Retenciones in _impuesto.ChildNodes)
                //                                                                {
                //                                                                    if (Retenciones.GetType() == typeof(XmlElement))
                //                                                                    {
                //                                                                        //Retenidos
                //                                                                        var _retencion = (Retenciones as XmlElement);
                //                                                                        if (_retencion.LocalName == "Retencion")
                //                                                                        {
                //                                                                            Decimal _baseRetencion = _retencion.HasAttribute("Base") ? Convert.ToDecimal(_retencion.GetAttribute("Base").ToString()) : 0;
                //                                                                            String _impuestoRetencion = _retencion.HasAttribute("Impuesto") ? _retencion.GetAttribute("Impuesto").ToString() : "";
                //                                                                            String _tipoFactorRetencion = _retencion.HasAttribute("TipoFactor") ? _retencion.GetAttribute("TipoFactor").ToString() : "";
                //                                                                            Decimal _tasaOCuotaRetencion = _retencion.HasAttribute("TasaOCuota") ? Convert.ToDecimal(_retencion.GetAttribute("TasaOCuota").ToString()) : 0;
                //                                                                            _importeRetencion = _retencion.HasAttribute("Importe") ? Convert.ToDecimal(_retencion.GetAttribute("Importe").ToString()) : 0;
                //                                                                            if (_tipoComprobante == "I" || _tipoComprobante == "E")
                //                                                                            {
                //                                                                                Otable.Cell(i, 7).Range.Text = _importeRetencion.ToString();
                //                                                                            }
                //                                                                        }
                //                                                                    }
                //                                                                }
                //                                                            }
                //                                                        }
                //                                                    }
                //                                                }
                //                                            }
                //                                        }
                //                                    }
                //                                    i++;
                //                                }
                //                            }

                //                            else if (_nodo.LocalName == "Complemento")
                //                            {
                //                                //!Complementos
                //                                foreach (var Complemento in _nodo.ChildNodes)
                //                                {
                //                                    if (Complemento.GetType() == typeof(XmlElement))
                //                                    {
                //                                        var _complemento = (Complemento as XmlElement);
                //                                        if (_complemento.LocalName == "Pagos")
                //                                        {
                //                                            //!Pagos
                //                                            String _versionPago = _complemento.HasAttribute("Version") ? _complemento.GetAttribute("Version").ToString() : "";

                //                                            foreach (var Pagos in _complemento.ChildNodes)
                //                                            {
                //                                                if (Pagos.GetType() == typeof(XmlElement))
                //                                                {
                //                                                    var _pago = (Pagos as XmlElement);
                //                                                    if (_pago.LocalName == "Pago")
                //                                                    {
                //                                                        object Agregar_Tabla_CFDIRelacionados = "Agregar_Tabla_CFDIRelacionados";
                //                                                        Word.Range AgregarTablaCFDIRelacionados = ObjDoc.Bookmarks.get_Item(ref Agregar_Tabla_CFDIRelacionados).Range;
                //                                                        TablaCFDIRelacionados = ObjDoc.Tables.Add(AgregarTablaCFDIRelacionados, _pago.ChildNodes.Count, 7);
                //                                                        TablaCFDIRelacionados.Range.Font.Size = 8;

                //                                                        TablaCFDIRelacionados.Columns[1].SetWidth(160, 0);
                //                                                        TablaCFDIRelacionados.Columns[2].SetWidth(50, 0);
                //                                                        TablaCFDIRelacionados.Columns[3].SetWidth(55, 0);
                //                                                        TablaCFDIRelacionados.Columns[4].SetWidth(58, 0);
                //                                                        TablaCFDIRelacionados.Columns[5].SetWidth(90, 0);
                //                                                        TablaCFDIRelacionados.Columns[6].SetWidth(90, 0);
                //                                                        TablaCFDIRelacionados.Columns[7].SetWidth(86, 0);
                //                                                        TablaCFDIRelacionados.Borders[Word.WdBorderType.wdBorderHorizontal].Visible = false;
                //                                                        TablaCFDIRelacionados.Borders[Word.WdBorderType.wdBorderVertical].Visible = false;
                //                                                        //
                //                                                        //!Complemento de Pago
                //                                                        String _numOperacionPago = _pago.HasAttribute("NumOperacion") ? _pago.GetAttribute("NumOperacion").ToString() : "";
                //                                                        Decimal _montoPago = _pago.HasAttribute("Monto") ? Convert.ToDecimal(_pago.GetAttribute("Monto").ToString()) : 0;
                //                                                        String _monedaPago = _pago.HasAttribute("MonedaP") ? _pago.GetAttribute("MonedaP").ToString() : "";
                //                                                        String _formaDePagoPago = _pago.HasAttribute("FormaDePagoP") ? _pago.GetAttribute("FormaDePagoP").ToString() : "";
                //                                                        DateTime _fechaPagoPago = _pago.HasAttribute("FechaPago") ? DateTime.Parse(_pago.GetAttribute("FechaPago").ToString()) : DateTime.Now;
                //                                                        object Fecha_Hora_Pago = "Fecha_Hora_Pago";
                //                                                        object Forma_Pago = "Forma_Pago";
                //                                                        object Total_Pago = "Total_Pago";
                //                                                        object Cantidad_Letra = "Cantidad_Letra";
                //                                                        Word.Range FechaHoraPago = ObjDoc.Bookmarks.get_Item(ref Fecha_Hora_Pago).Range;
                //                                                        Word.Range FormaPago = ObjDoc.Bookmarks.get_Item(ref Forma_Pago).Range;
                //                                                        Word.Range TotalPago = ObjDoc.Bookmarks.get_Item(ref Total_Pago).Range;
                //                                                        Word.Range CantidadLetra = ObjDoc.Bookmarks.get_Item(ref Cantidad_Letra).Range;
                //                                                        FechaHoraPago.Text = _fechaPagoPago.ToString("g");
                //                                                        FormaPago.Text = _formaDePagoPago;
                //                                                        TotalPago.Text = _montoPago.ToString("0,0.00");
                //                                                        var let = new Numalet();
                //                                                        CantidadLetra.Text = let.ToCustomCardinal(_montoPago);
                //                                                        var i = 1;
                //                                                        foreach (var DoctoRelacionado in _pago.ChildNodes)
                //                                                        {
                //                                                            if (DoctoRelacionado.GetType() == typeof(XmlElement))
                //                                                            {
                //                                                                //! Documentos Relacionados
                //                                                                var _relacion = (DoctoRelacionado as XmlElement);
                //                                                                if (_relacion.LocalName == "DoctoRelacionado")
                //                                                                {
                //                                                                    String _folioRelacionPago = _relacion.HasAttribute("Folio") ? _relacion.GetAttribute("Folio").ToString() : "";
                //                                                                    TablaCFDIRelacionados.Cell(i, 2).Range.Text = _folioRelacionPago;
                //                                                                    String _serieRelacionPago = _relacion.HasAttribute("Serie") ? _relacion.GetAttribute("Serie").ToString() : "";
                //                                                                    Decimal _impSaldoInsoluto = _relacion.HasAttribute("ImpSaldoInsoluto") ? Convert.ToDecimal(_relacion.GetAttribute("ImpSaldoInsoluto").ToString()) : 0;
                //                                                                    TablaCFDIRelacionados.Cell(i, 6).Range.Text = _impSaldoInsoluto.ToString("0,0.00");
                //                                                                    Decimal _impPagado = _relacion.HasAttribute("ImpPagado") ? Convert.ToDecimal(_relacion.GetAttribute("ImpPagado").ToString()) : 0;
                //                                                                    TablaCFDIRelacionados.Cell(i, 7).Range.Text = _impPagado.ToString("0,0.00");
                //                                                                    Decimal _impSaldoAnt = _relacion.HasAttribute("ImpSaldoAnt") ? Convert.ToDecimal(_relacion.GetAttribute("ImpSaldoAnt").ToString()) : 0;
                //                                                                    TablaCFDIRelacionados.Cell(i, 5).Range.Text = _impSaldoAnt.ToString("0,0.00");
                //                                                                    Int32 _numParcialidad = _relacion.HasAttribute("NumParcialidad") ? Convert.ToInt32(_relacion.GetAttribute("NumParcialidad").ToString()) : 0;
                //                                                                    String _metodoDePagoRelacionPago = _relacion.HasAttribute("MetodoDePagoDR") ? _relacion.GetAttribute("MetodoDePagoDR").ToString() : "";
                //                                                                    TablaCFDIRelacionados.Cell(i, 3).Range.Text = _metodoDePagoRelacionPago;
                //                                                                    String _monedaRepacionPago = _relacion.HasAttribute("MonedaDP") ? _relacion.GetAttribute("MonedaDP").ToString() : "";
                //                                                                    String _idDocumento = _relacion.HasAttribute("IdDocumento") ? _relacion.GetAttribute("IdDocumento").ToString() : "";
                //                                                                    TablaCFDIRelacionados.Cell(i, 1).Range.Text = _idDocumento;

                //                                                                    cfdi_relacionados_pagos += _idDocumento + ", ";

                //                                                                }
                //                                                            }
                //                                                            i++;
                //                                                        }
                //                                                    }
                //                                                }

                //                                            }
                //                                        }
                //                                        else if (_complemento.LocalName == "CartaPorte")
                //                                        {
                //                                            _transpInter = _complemento.HasAttribute("TranspInternac") ? _complemento.GetAttribute("TranspInternac").ToString() : "";

                //                                            _totalDistancia = _complemento.HasAttribute("TotalDistRec") ? _complemento.GetAttribute("TotalDistRec").ToString() : "";

                //                                            foreach (var CartaPorte in _complemento.ChildNodes)
                //                                            {
                //                                                if (CartaPorte.GetType() == typeof(XmlElement))
                //                                                {
                //                                                    var _cartaPorte = (CartaPorte as XmlElement);



                //                                                    if (_cartaPorte.LocalName == "Ubicaciones")
                //                                                    {
                //                                                        //Crear Tabla Mercancias
                //                                                        object Agregar_Tabla_Remitentes = "Agregar_Tabla_Remitentes";
                //                                                        Word.Range AgregarTablaRemitentes = ObjDoc.Bookmarks.get_Item(ref Agregar_Tabla_Remitentes).Range;
                //                                                        TablaRemitentes = ObjDoc.Tables.Add(AgregarTablaRemitentes, _complemento.ChildNodes.Count - 1, 9);
                //                                                        TablaRemitentes.Range.Font.Size = 8;

                //                                                        TablaRemitentes.Columns[1].SetWidth(35, 0);
                //                                                        TablaRemitentes.Columns[2].SetWidth(52, 0);
                //                                                        TablaRemitentes.Columns[3].SetWidth(60, 0);
                //                                                        TablaRemitentes.Columns[4].SetWidth(108, 0);
                //                                                        TablaRemitentes.Columns[5].SetWidth(50, 0);
                //                                                        TablaRemitentes.Columns[6].SetWidth(50, 0);
                //                                                        TablaRemitentes.Columns[7].SetWidth(83, 0);
                //                                                        TablaRemitentes.Columns[8].SetWidth(48, 0);
                //                                                        TablaRemitentes.Columns[9].SetWidth(110, 0);
                //                                                        TablaRemitentes.Borders[Word.WdBorderType.wdBorderHorizontal].Visible = false;
                //                                                        TablaRemitentes.Borders[Word.WdBorderType.wdBorderVertical].Visible = false;
                //                                                        //
                //                                                        var i = 1;
                //                                                        foreach (var Ubicaciones in _cartaPorte.ChildNodes)
                //                                                        {
                //                                                            if (Ubicaciones.GetType() == typeof(XmlElement))
                //                                                            {
                //                                                                var _ubicacion = (Ubicaciones as XmlElement);
                //                                                                String tipo_Ubicacion = _ubicacion.HasAttribute("TipoUbicacion") ? _ubicacion.GetAttribute("TipoUbicacion").ToString() : "";
                //                                                                if (tipo_Ubicacion == "Origen")
                //                                                                {
                //                                                                    TablaRemitentes.Cell(i, 1).Range.Text = tipo_Ubicacion;
                //                                                                    _idUbicacionOrigen = _ubicacion.HasAttribute("IDUbicacion") ? _ubicacion.GetAttribute("IDUbicacion").ToString() : "";
                //                                                                    _rfcRemDesOrigen = _ubicacion.HasAttribute("RFCRemitenteDestinatario") ? _ubicacion.GetAttribute("RFCRemitenteDestinatario").ToString() : "";
                //                                                                    TablaRemitentes.Cell(i, 3).Range.Text = _rfcRemDesOrigen;
                //                                                                    _nombreRemDesOrigen = _ubicacion.HasAttribute("NombreRemitenteDestinatario") ? _ubicacion.GetAttribute("NombreRemitenteDestinatario").ToString() : "";
                //                                                                    TablaRemitentes.Cell(i, 4).Range.Text = _nombreRemDesOrigen;
                //                                                                    _fechaHoraOrigen = _ubicacion.HasAttribute("FechaHoraSalidaLlegada") ? DateTime.Parse(_ubicacion.GetAttribute("FechaHoraSalidaLlegada").ToString()) : DateTime.Now;
                //                                                                    TablaRemitentes.Cell(i, 7).Range.Text = _fechaHoraOrigen.ToString();
                //                                                                    _distanciaRecorridaOrigen = _ubicacion.HasAttribute("DistanciaRecorrida") ? _ubicacion.GetAttribute("DistanciaRecorrida").ToString() : "";
                //                                                                    TablaRemitentes.Cell(i, 2).Range.Text = _distanciaRecorridaOrigen;

                //                                                                    var _domicilio = _ubicacion.FirstChild;
                //                                                                    if (_domicilio.GetType() == typeof(XmlElement))
                //                                                                    {
                //                                                                        var _domi = (_domicilio as XmlElement);

                //                                                                        _calleOrigen = _domi.HasAttribute("Calle") ? _domi.GetAttribute("Calle").ToString() : "";
                //                                                                        _coloniaOrigen = _domi.HasAttribute("Colonia") ? _domi.GetAttribute("Colonia").ToString() : "";
                //                                                                        _localidadOrigen = _domi.HasAttribute("Localidad") ? _domi.GetAttribute("Localidad").ToString() : "";
                //                                                                        _municipioOrigen = _domi.HasAttribute("Municipio") ? _domi.GetAttribute("Municipio").ToString() : "";
                //                                                                        _estadoOrigen = _domi.HasAttribute("Estado") ? _domi.GetAttribute("Estado").ToString() : "";
                //                                                                        _paisOrigen = _domi.HasAttribute("Pais") ? _domi.GetAttribute("Pais").ToString() : "";
                //                                                                        TablaRemitentes.Cell(i, 5).Range.Text = _paisOrigen;
                //                                                                        _cpOrigen = _domi.HasAttribute("CodigoPostal") ? _domi.GetAttribute("CodigoPostal").ToString() : "";

                //                                                                        _direccionOrigen = _calleOrigen + ", " + _coloniaOrigen + ", " + _localidadOrigen + ", " + _municipioOrigen + ", " + _estadoOrigen + ", " + _paisOrigen + ", " + _cpOrigen;
                //                                                                        TablaRemitentes.Cell(i, 9).Range.Text = _direccionOrigen;
                //                                                                    }


                //                                                                }
                //                                                                else if (tipo_Ubicacion == "Destino")
                //                                                                {
                //                                                                    TablaRemitentes.Cell(i, 1).Range.Text = tipo_Ubicacion;
                //                                                                    _idUbicacionDestino = _ubicacion.HasAttribute("IDUbicacion") ? _ubicacion.GetAttribute("IDUbicacion").ToString() : "";
                //                                                                    _rfcRemDesDestino = _ubicacion.HasAttribute("RFCRemitenteDestinatario") ? _ubicacion.GetAttribute("RFCRemitenteDestinatario").ToString() : "";
                //                                                                    TablaRemitentes.Cell(i, 3).Range.Text = _rfcRemDesDestino;
                //                                                                    _nombreRemDesDestino = _ubicacion.HasAttribute("NombreRemitenteDestinatario") ? _ubicacion.GetAttribute("NombreRemitenteDestinatario").ToString() : "";
                //                                                                    TablaRemitentes.Cell(i, 4).Range.Text = _nombreRemDesDestino;
                //                                                                    _fechaHoraDestino = _ubicacion.HasAttribute("FechaHoraSalidaLlegada") ? DateTime.Parse(_ubicacion.GetAttribute("FechaHoraSalidaLlegada").ToString()) : DateTime.Now;
                //                                                                    TablaRemitentes.Cell(i, 7).Range.Text = _fechaHoraDestino.ToString();
                //                                                                    _distanciaRecorridaDestino = _ubicacion.HasAttribute("DistanciaRecorrida") ? _ubicacion.GetAttribute("DistanciaRecorrida").ToString() : "";
                //                                                                    TablaRemitentes.Cell(i, 2).Range.Text = _distanciaRecorridaDestino;


                //                                                                    var _domicilio = _ubicacion.FirstChild;
                //                                                                    if (_domicilio.GetType() == typeof(XmlElement))
                //                                                                    {
                //                                                                        var _domi = (_domicilio as XmlElement);

                //                                                                        _calleDestino = _domi.HasAttribute("Calle") ? _domi.GetAttribute("Calle").ToString() : "";
                //                                                                        _coloniaDestino = _domi.HasAttribute("Colonia") ? _domi.GetAttribute("Colonia").ToString() : "";
                //                                                                        _localidadDestino = _domi.HasAttribute("Localidad") ? _domi.GetAttribute("Localidad").ToString() : "";
                //                                                                        _municipioDestino = _domi.HasAttribute("Municipio") ? _domi.GetAttribute("Municipio").ToString() : "";
                //                                                                        _estadoDestino = _domi.HasAttribute("Estado") ? _domi.GetAttribute("Estado").ToString() : "";
                //                                                                        _paisDestino = _domi.HasAttribute("Pais") ? _domi.GetAttribute("Pais").ToString() : "";
                //                                                                        TablaRemitentes.Cell(i, 5).Range.Text = _paisDestino;
                //                                                                        _cpDestino = _domi.HasAttribute("CodigoPostal") ? _domi.GetAttribute("CodigoPostal").ToString() : "";

                //                                                                        _direccionDestino = _calleDestino + ", " + _coloniaDestino + ", " + _localidadDestino + ", " + _municipioDestino + ", " + _estadoDestino + ", " + _paisDestino + ", " + _cpDestino;
                //                                                                        TablaRemitentes.Cell(i, 9).Range.Text = _direccionDestino;
                //                                                                    }
                //                                                                }

                //                                                            }
                //                                                            i++;
                //                                                        }

                //                                                    }
                //                                                    else if (_cartaPorte.LocalName == "Mercancias")
                //                                                    {
                //                                                        //Crear Tabla Mercancias
                //                                                        object Agregar_Tabla_Mercancias = "Agregar_Tabla_Mercancias";
                //                                                        Word.Range AgregarTablaMercancias = ObjDoc.Bookmarks.get_Item(ref Agregar_Tabla_Mercancias).Range;
                //                                                        TablaMercancias = ObjDoc.Tables.Add(AgregarTablaMercancias, _cartaPorte.ChildNodes.Count - 1, 7);
                //                                                        TablaMercancias.Range.Font.Size = 8;

                //                                                        TablaMercancias.Columns[1].SetWidth(50, 0);
                //                                                        TablaMercancias.Columns[2].SetWidth(50, 0);
                //                                                        TablaMercancias.Columns[3].SetWidth(200, 0);
                //                                                        TablaMercancias.Columns[4].SetWidth(74, 0);
                //                                                        TablaMercancias.Columns[5].SetWidth(74, 0);
                //                                                        TablaMercancias.Columns[6].SetWidth(74, 0);
                //                                                        TablaMercancias.Columns[7].SetWidth(73, 0);
                //                                                        TablaMercancias.Borders[Word.WdBorderType.wdBorderHorizontal].Visible = false;
                //                                                        TablaMercancias.Borders[Word.WdBorderType.wdBorderVertical].Visible = false;
                //                                                        //
                //                                                        _pesoBrutoTotal = _cartaPorte.HasAttribute("PesoBrutoTotal") ? _cartaPorte.GetAttribute("PesoBrutoTotal").ToString() : "";
                //                                                        _unidadPeso = _cartaPorte.HasAttribute("UnidadPeso") ? _cartaPorte.GetAttribute("UnidadPeso").ToString() : "";
                //                                                        _numTotalMercancias = _cartaPorte.HasAttribute("NumTotalMercancias") ? _cartaPorte.GetAttribute("NumTotalMercancias").ToString() : "";
                //                                                        var i = 1;
                //                                                        foreach (var Mercancias in _cartaPorte.ChildNodes)
                //                                                        {
                //                                                            if (Mercancias.GetType() == typeof(XmlElement))
                //                                                            {
                //                                                                var _mercancias = (Mercancias as XmlElement);
                //                                                                if (_mercancias.LocalName == "Mercancia")
                //                                                                {
                //                                                                    _bienesTrans = _mercancias.HasAttribute("BienesTransp") ? _mercancias.GetAttribute("BienesTransp").ToString() : "";
                //                                                                    _descripcionMerca = _mercancias.HasAttribute("Descripcion") ? _mercancias.GetAttribute("Descripcion").ToString() : "";
                //                                                                    TablaMercancias.Cell(i, 3).Range.Text = _descripcionMerca;
                //                                                                    _cantidadMerca = _mercancias.HasAttribute("Cantidad") ? _mercancias.GetAttribute("Cantidad").ToString() : "";
                //                                                                    TablaMercancias.Cell(i, 1).Range.Text = _cantidadMerca;
                //                                                                    _claveUnidadMerca = _mercancias.HasAttribute("ClaveUnidad") ? _mercancias.GetAttribute("ClaveUnidad").ToString() : "";
                //                                                                    TablaMercancias.Cell(i, 2).Range.Text = _claveUnidadMerca;
                //                                                                    _unidadMerca = _mercancias.HasAttribute("Unidad") ? _mercancias.GetAttribute("Unidad").ToString() : "";
                //                                                                    _pesoKG = _mercancias.HasAttribute("PesoEnKg") ? _mercancias.GetAttribute("PesoEnKg").ToString() : "";
                //                                                                    TablaMercancias.Cell(i, 7).Range.Text = _pesoKG;
                //                                                                }
                //                                                                else if (_mercancias.LocalName == "Autotransporte")
                //                                                                {
                //                                                                    _permSCT = _mercancias.HasAttribute("PermSCT") ? _mercancias.GetAttribute("PermSCT").ToString() : "";
                //                                                                    _numPermisoSCT = _mercancias.HasAttribute("NumPermisoSCT") ? _mercancias.GetAttribute("NumPermisoSCT").ToString() : "";


                //                                                                    foreach (var AutoTransportes in _mercancias.ChildNodes)
                //                                                                    {
                //                                                                        if (AutoTransportes.GetType() == typeof(XmlElement))
                //                                                                        {
                //                                                                            var _autoTransporte = (AutoTransportes as XmlElement);
                //                                                                            if (_autoTransporte.LocalName == "IdentificacionVehicular")
                //                                                                            {
                //                                                                                _configVehivular = _autoTransporte.HasAttribute("ConfigVehicular") ? _autoTransporte.GetAttribute("ConfigVehicular").ToString() : "";
                //                                                                                _placaVM = _autoTransporte.HasAttribute("PlacaVM") ? _autoTransporte.GetAttribute("PlacaVM").ToString() : "";
                //                                                                                _anioModelo = _autoTransporte.HasAttribute("AnioModeloVM") ? _autoTransporte.GetAttribute("AnioModeloVM").ToString() : "";


                //                                                                            }
                //                                                                            else if (_autoTransporte.LocalName == "Seguros")
                //                                                                            {
                //                                                                                _aseguraRespCivil = _autoTransporte.HasAttribute("AseguraRespCivil") ? _autoTransporte.GetAttribute("AseguraRespCivil").ToString() : "";
                //                                                                                _polizaRespCivil = _autoTransporte.HasAttribute("PolizaRespCivil") ? _autoTransporte.GetAttribute("PolizaRespCivil").ToString() : "";


                //                                                                            }
                //                                                                            else if (_autoTransporte.LocalName == "Remolques")
                //                                                                            {
                //                                                                                foreach (var Remolques in _autoTransporte.ChildNodes)
                //                                                                                {
                //                                                                                    if (Remolques.GetType() == typeof(XmlElement))
                //                                                                                    {
                //                                                                                        var _remolque = (Remolques as XmlElement);
                //                                                                                        if (_remolque.LocalName == "Remolque")
                //                                                                                        {
                //                                                                                            _subTipoRem = _remolque.HasAttribute("SubTipoRem") ? _remolque.GetAttribute("SubTipoRem").ToString() : "";
                //                                                                                            _placaRemolque = _remolque.HasAttribute("Placa") ? _remolque.GetAttribute("Placa").ToString() : "";


                //                                                                                        }
                //                                                                                    }
                //                                                                                }
                //                                                                            }
                //                                                                        }
                //                                                                    }
                //                                                                }
                //                                                            }
                //                                                            i++;
                //                                                        }
                //                                                    }
                //                                                    else if (_cartaPorte.LocalName == "FiguraTransporte")
                //                                                    {
                //                                                        //Crear tabla Percepciones
                //                                                        object Agregar_Tabla_Operadores = "Agregar_Tabla_Operadores";
                //                                                        Word.Range AgregarTablaOperadores = ObjDoc.Bookmarks.get_Item(ref Agregar_Tabla_Operadores).Range;
                //                                                        TablaOperadores = ObjDoc.Tables.Add(AgregarTablaOperadores, _cartaPorte.ChildNodes.Count, 6);
                //                                                        TablaOperadores.Range.Font.Size = 8;

                //                                                        TablaOperadores.Columns[1].SetWidth(80, 0);
                //                                                        TablaOperadores.Columns[2].SetWidth(80, 0);
                //                                                        TablaOperadores.Columns[3].SetWidth(200, 0);
                //                                                        TablaOperadores.Columns[4].SetWidth(80, 0);
                //                                                        TablaOperadores.Columns[5].SetWidth(70, 0);
                //                                                        TablaOperadores.Columns[6].SetWidth(85, 0);
                //                                                        TablaOperadores.Borders[Word.WdBorderType.wdBorderHorizontal].Visible = false;
                //                                                        TablaOperadores.Borders[Word.WdBorderType.wdBorderVertical].Visible = false;
                //                                                        //                                                                                              //Fin Crear Tabla
                //                                                        var i = 1;
                //                                                        foreach (var FiguraTrans in _cartaPorte.ChildNodes)
                //                                                        {
                //                                                            if (FiguraTrans.GetType() == typeof(XmlElement))
                //                                                            {
                //                                                                var _tiposFigura = (FiguraTrans as XmlElement);
                //                                                                if (_tiposFigura.LocalName == "TiposFigura")
                //                                                                {
                //                                                                    _tipoFigura = _tiposFigura.HasAttribute("TipoFigura") ? _tiposFigura.GetAttribute("TipoFigura").ToString() : "";
                //                                                                    _rfcFigura = _tiposFigura.HasAttribute("RFCFigura") ? _tiposFigura.GetAttribute("RFCFigura").ToString() : "";
                //                                                                    TablaOperadores.Cell(i, 2).Range.Text = _rfcFigura;
                //                                                                    _numLicenciaFigura = _tiposFigura.HasAttribute("NumLicencia") ? _tiposFigura.GetAttribute("NumLicencia").ToString() : "";
                //                                                                    _nombreFigura = _tiposFigura.HasAttribute("NombreFigura") ? _tiposFigura.GetAttribute("NombreFigura").ToString() : "";
                //                                                                    TablaOperadores.Cell(i, 3).Range.Text = _nombreFigura;


                //                                                                }
                //                                                            }
                //                                                            i++;
                //                                                        }
                //                                                    }
                //                                                }
                //                                            }
                //                                        }
                //                                        else if (_complemento.LocalName == "Nomina")
                //                                        {
                //                                            //!Nomina

                //                                            _versionNomina = _complemento.HasAttribute("Version") ? _complemento.GetAttribute("Version").ToString() : "";
                //                                            _tipoNomina = _complemento.HasAttribute("TipoNomina") ? _complemento.GetAttribute("TipoNomina").ToString() : "";
                //                                            _fechaPago = _complemento.HasAttribute("FechaPago") ? DateTime.Parse(_complemento.GetAttribute("FechaPago").ToString()) : DateTime.Now;
                //                                            _fechaInicialPago = _complemento.HasAttribute("FechaInicialPago") ? DateTime.Parse(_complemento.GetAttribute("FechaInicialPago").ToString()) : DateTime.Now;
                //                                            _fechaFinalPago = _complemento.HasAttribute("FechaFinalPago") ? DateTime.Parse(_complemento.GetAttribute("FechaFinalPago").ToString()) : DateTime.Now;
                //                                            _numDiasPagados = _complemento.HasAttribute("NumDiasPagados") ? Convert.ToDecimal(_complemento.GetAttribute("NumDiasPagados").ToString()) : 0;
                //                                            _totalPercepciones = _complemento.HasAttribute("TotalPercepciones") ? Convert.ToDecimal(_complemento.GetAttribute("TotalPercepciones").ToString()) : 0;
                //                                            _totalDeducciones = _complemento.HasAttribute("TotalDeducciones") ? Convert.ToDecimal(_complemento.GetAttribute("TotalDeducciones").ToString()) : 0;
                //                                            _totalOtrosPagos = _complemento.HasAttribute("TotalOtrosPagos") ? Convert.ToDecimal(_complemento.GetAttribute("TotalOtrosPagos").ToString()) : 0;

                //                                            foreach (var Nomina in _complemento.ChildNodes)
                //                                            {
                //                                                if (Nomina.GetType() == typeof(XmlElement))
                //                                                {
                //                                                    var _nomina = (Nomina as XmlElement);
                //                                                    if (_nomina.LocalName == "Emisor")
                //                                                    {
                //                                                        //! Nomina -> Emisor
                //                                                        _registroPatronal = _nomina.HasAttribute("RegistroPatronal") ? _nomina.GetAttribute("RegistroPatronal").ToString() : "";

                //                                                    }
                //                                                    else if (_nomina.LocalName == "Receptor")
                //                                                    {
                //                                                        //! Nomina -> Receptor
                //                                                        _curp = _nomina.HasAttribute("Curp") ? _nomina.GetAttribute("Curp").ToString() : "";
                //                                                        _numSeguridadSocial = _nomina.HasAttribute("NumSeguridadSocial") ? _nomina.GetAttribute("NumSeguridadSocial").ToString() : "";
                //                                                        DateTime _fechaInicioRelLaboral = _nomina.HasAttribute("FechaInicioRelLaboral") ? DateTime.Parse(_nomina.GetAttribute("FechaInicioRelLaboral").ToString()) : DateTime.Now;
                //                                                        String _antiguedad = _nomina.HasAttribute("Antigüedad") ? _nomina.GetAttribute("Antigüedad").ToString() : "";
                //                                                        String _tipoContrato = _nomina.HasAttribute("TipoContrato") ? _nomina.GetAttribute("TipoContrato").ToString() : "";
                //                                                        String _sindicalizado = _nomina.HasAttribute("Sindicalizado") ? _nomina.GetAttribute("Sindicalizado").ToString() : "";
                //                                                        String _tipoJornada = _nomina.HasAttribute("TipoJornada") ? _nomina.GetAttribute("TipoJornada").ToString() : "";
                //                                                        _tipoRegimen = _nomina.HasAttribute("TipoRegimen") ? _nomina.GetAttribute("TipoRegimen").ToString() : "";
                //                                                        _numEmpleado = _nomina.HasAttribute("NumEmpleado") ? _nomina.GetAttribute("NumEmpleado").ToString() : "";
                //                                                        _departamento = _nomina.HasAttribute("Departamento") ? _nomina.GetAttribute("Departamento").ToString() : "";
                //                                                        _puesto = _nomina.HasAttribute("Puesto") ? _nomina.GetAttribute("Puesto").ToString() : "";
                //                                                        String _riesgoPuesto = _nomina.HasAttribute("RiesgoPuesto") ? _nomina.GetAttribute("RiesgoPuesto").ToString() : "";
                //                                                        String _periodicidadPago = _nomina.HasAttribute("PeriodicidadPago") ? _nomina.GetAttribute("PeriodicidadPago").ToString() : "";
                //                                                        Decimal _salarioBaseCotApor = _nomina.HasAttribute("SalarioBaseCotApor") ? Convert.ToDecimal(_nomina.GetAttribute("SalarioBaseCotApor").ToString()) : 0;
                //                                                        Decimal _salarioDiarioIntegrado = _nomina.HasAttribute("SalarioDiarioIntegrado") ? Convert.ToDecimal(_nomina.GetAttribute("SalarioDiarioIntegrado").ToString()) : 0;
                //                                                        String _claveEntFed = _nomina.HasAttribute("ClaveEntFed") ? _nomina.GetAttribute("ClaveEntFed").ToString() : "";


                //                                                    }
                //                                                    else if (_nomina.LocalName == "Percepciones")
                //                                                    {
                //                                                        //Crear tabla Percepciones
                //                                                        object Agregar_Tabla_Percepciones = "Agregar_Tabla_Percepciones";
                //                                                        Word.Range AgregarTabla_Percepciones = ObjDoc.Bookmarks.get_Item(ref Agregar_Tabla_Percepciones).Range;
                //                                                        TablaPercepciones = ObjDoc.Tables.Add(AgregarTabla_Percepciones, _nomina.ChildNodes.Count, 3);
                //                                                        TablaPercepciones.Range.Font.Size = 8;

                //                                                        //Otable.Columns[1].SetWidth(57, 0);
                //                                                        //Otable.Columns[2].SetWidth(50, 0);
                //                                                        //Otable.Columns[3].SetWidth(55, 0);
                //                                                        //Otable.Columns[4].SetWidth(58, 0);
                //                                                        //Otable.Columns[5].SetWidth(197, 0);
                //                                                        //Otable.Columns[6].SetWidth(53, 0);
                //                                                        //Otable.Columns[7].SetWidth(60, 0);
                //                                                        //Otable.Columns[8].SetWidth(57, 0);
                //                                                        TablaPercepciones.Borders[Word.WdBorderType.wdBorderHorizontal].Visible = false;
                //                                                        TablaPercepciones.Borders[Word.WdBorderType.wdBorderVertical].Visible = false;
                //                                                        //                                                                                              //Fin Crear Tabla
                //                                                        //! Nomina -> Percepciones
                //                                                        Decimal _totalSueldos = _nomina.HasAttribute("TotalSueldos") ? Convert.ToDecimal(_nomina.GetAttribute("TotalSueldos").ToString()) : 0;
                //                                                        Decimal _totalGravado = _nomina.HasAttribute("TotalGravado") ? Convert.ToDecimal(_nomina.GetAttribute("TotalGravado").ToString()) : 0;
                //                                                        object Total_Percepciones = "Total_Percepciones";
                //                                                        Word.Range TotalPercepciones = ObjDoc.Bookmarks.get_Item(ref Total_Percepciones).Range;
                //                                                        TotalPercepciones.Text = _totalPercepciones.ToString("0,0.00");
                //                                                        Decimal _totalExento = _nomina.HasAttribute("TotalExento") ? Convert.ToDecimal(_nomina.GetAttribute("TotalExento").ToString()) : 0;
                //                                                        var i = 1;
                //                                                        foreach (var Percepcion in _nomina.ChildNodes)
                //                                                        {
                //                                                            if (Percepcion.GetType() == typeof(XmlElement))
                //                                                            {
                //                                                                var _percepcion = (Percepcion as XmlElement);
                //                                                                //! Percepcion
                //                                                                String _tipoPercepcion = _percepcion.HasAttribute("TipoPercepcion") ? _percepcion.GetAttribute("TipoPercepcion").ToString() : "";
                //                                                                String _clavePercepcion = _percepcion.HasAttribute("Clave") ? _percepcion.GetAttribute("Clave").ToString() : "";
                //                                                                TablaPercepciones.Cell(i, 1).Range.Text = _clavePercepcion.ToString();
                //                                                                String _conceptoPercepcion = _percepcion.HasAttribute("Concepto") ? _percepcion.GetAttribute("Concepto").ToString() : "";
                //                                                                TablaPercepciones.Cell(i, 2).Range.Text = _conceptoPercepcion.ToString();
                //                                                                Decimal _importeGravadoPercepcion = _percepcion.HasAttribute("ImporteGravado") ? Convert.ToDecimal(_percepcion.GetAttribute("ImporteGravado").ToString()) : 0;
                //                                                                TablaPercepciones.Cell(i, 3).Range.Text = _importeGravadoPercepcion.ToString();
                //                                                                Decimal _importeExentoPercepcion = _percepcion.HasAttribute("ImporteExento") ? Convert.ToDecimal(_percepcion.GetAttribute("ImporteExento").ToString()) : 0;
                //                                                            }
                //                                                            i++;
                //                                                        }
                //                                                    }
                //                                                    else if (_nomina.LocalName == "Deducciones")
                //                                                    {
                //                                                        //Crear tabla Percepciones
                //                                                        object Agregar_Tabla_Deducciones = "Agregar_Tabla_Deducciones";
                //                                                        Word.Range AgregarTabla_Deducciones = ObjDoc.Bookmarks.get_Item(ref Agregar_Tabla_Deducciones).Range;
                //                                                        TablaDeducciones = ObjDoc.Tables.Add(AgregarTabla_Deducciones, _nomina.ChildNodes.Count, 2);
                //                                                        TablaDeducciones.Range.Font.Size = 8;

                //                                                        TablaDeducciones.Columns[1].SetWidth(200, 0);

                //                                                        TablaDeducciones.Borders[Word.WdBorderType.wdBorderHorizontal].Visible = false;
                //                                                        TablaDeducciones.Borders[Word.WdBorderType.wdBorderVertical].Visible = false;
                //                                                        //
                //                                                        //! Nomina -> Deducciones
                //                                                        Decimal _totalOtrasDeducciones = _nomina.HasAttribute("TotalOtrasDeducciones") ? Convert.ToDecimal(_nomina.GetAttribute("TotalOtrasDeducciones").ToString()) : 0;
                //                                                        Decimal _totalImpuestosRetenidos = _nomina.HasAttribute("TotalImpuestosRetenidos") ? Convert.ToDecimal(_nomina.GetAttribute("TotalImpuestosRetenidos").ToString()) : 0;
                //                                                        object Total_ISR_Reten = "Total_ISR_Reten";
                //                                                        Word.Range TotalISRReten = ObjDoc.Bookmarks.get_Item(ref Total_ISR_Reten).Range;
                //                                                        TotalISRReten.Text = _totalImpuestosRetenidos.ToString("0,0.00");
                //                                                        object Total_Otras_Deduc = "Total_Otras_Deduc";
                //                                                        Word.Range TotalOtrasDeduc = ObjDoc.Bookmarks.get_Item(ref Total_Otras_Deduc).Range;
                //                                                        TotalOtrasDeduc.Text = _totalOtrasDeducciones.ToString("0,0.00");
                //                                                        var i = 1;
                //                                                        foreach (var Deduccion in _nomina.ChildNodes)
                //                                                        {
                //                                                            if (Deduccion.GetType() == typeof(XmlElement))
                //                                                            {
                //                                                                var _deduccion = (Deduccion as XmlElement);
                //                                                                //! Deduccion
                //                                                                String _tipoDeduccion = _deduccion.HasAttribute("TipoDeduccion") ? _deduccion.GetAttribute("TipoDeduccion").ToString() : "";
                //                                                                String _claveDeduccion = _deduccion.HasAttribute("Clave") ? _deduccion.GetAttribute("Clave").ToString() : "";
                //                                                                String _conceptoDeduccion = _deduccion.HasAttribute("Concepto") ? _deduccion.GetAttribute("Concepto").ToString() : "";
                //                                                                TablaDeducciones.Cell(i, 1).Range.Text = _conceptoDeduccion.ToString();
                //                                                                Decimal _importeDeduccion = _deduccion.HasAttribute("Importe") ? Convert.ToDecimal(_deduccion.GetAttribute("Importe").ToString()) : 0;
                //                                                                TablaDeducciones.Cell(i, 2).Range.Text = _importeDeduccion.ToString();
                //                                                            }
                //                                                            i++;
                //                                                        }
                //                                                    }
                //                                                    else if (_nomina.LocalName == "OtrosPagos")
                //                                                    {
                //                                                        //! Nomina -> Otros Pagos
                //                                                        foreach (var OtrosPagos in _nomina.ChildNodes)
                //                                                        {
                //                                                            if (OtrosPagos.GetType() == typeof(XmlElement))
                //                                                            {
                //                                                                var _otrosPagos = (OtrosPagos as XmlElement);
                //                                                                //! OtroPago
                //                                                                String _tipoOtroPago = _otrosPagos.HasAttribute("TipoOtroPago") ? _otrosPagos.GetAttribute("TipoOtroPago").ToString() : "";
                //                                                                String _claveOtroPago = _otrosPagos.HasAttribute("Clave") ? _otrosPagos.GetAttribute("Clave").ToString() : "";
                //                                                                String _conceptoOtroPago = _otrosPagos.HasAttribute("Concepto") ? _otrosPagos.GetAttribute("Concepto").ToString() : "";
                //                                                                Decimal _importeOtroPago = _otrosPagos.HasAttribute("Importe") ? Convert.ToDecimal(_otrosPagos.GetAttribute("Importe").ToString()) : 0;

                //                                                            }
                //                                                        }
                //                                                    }
                //                                                }
                //                                            }

                //                                        }

                //                                        else if (_complemento.LocalName == "ImpuestosLocales")
                //                                        {
                //                                            //!Impuesto Locales


                //                                        }

                //                                        else if (_complemento.LocalName == "Divisas")
                //                                        {

                //                                        }
                //                                    }
                //                                }
                //                            }
                //                            //Crear Codigo QR
                //                            fileName = _rfcEmisor + "_" + _fechaEmision.ToString("MM-dd-yyyy");
                //                            QRCodeGenerator qrGenerator = new QRCodeGenerator();
                //                            ASCIIEncoding ASSCII = new ASCIIEncoding();
                //                            QRCodeData qrCodeData = qrGenerator.CreateQrCode(ASSCII.GetBytes("https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?&id=" + _uuid + "&re=" + _rfcEmisor + "&rr=" + _rfcReceptor + "&tt=" + _total_original + "&fe=" + _selloDigital.Substring(_selloDigital.Length - 8, 8)), QRCodeGenerator.ECCLevel.H);
                //                            QRCode qrCode = new QRCode(qrCodeData);
                //                            Bitmap qrCodeImage = qrCode.GetGraphic(2);
                //                            qrCodeImage.Save(path + nombre + ".jpg", ImageFormat.Jpeg);
                //                            //    //Fin Crear Codigo QR                                   

                //                        }


                //                    }

                //                    if (_tipoComprobante == "N")
                //                    {
                //                        //        //Modificar documento Nomina
                //                        //        //Marcadores
                //                        //Emisor
                //                        object Nombre_Emisor = "Nombre_Emisor";
                //                        object RFC_Emisor = "RFC_Emisor";
                //                        object Registro_Patronal = "Registro_Patronal";
                //                        //Receptor
                //                        object Numero_Trabajador = "Numero_Trabajador";
                //                        object Nombre_Receptor = "Nombre_Receptor";
                //                        object Curp_ = "Curp_";
                //                        object RFC_Receptor = "RFC_Receptor";
                //                        object Num_IMSS = "Num_IMSS";
                //                        object Regimen_Trabajador = "Regimen_Trabajador";
                //                        object Departamento_ = "Departamento_";
                //                        object Puesto_ = "Puesto_";
                //                        object Fecha_Inicio = "Fecha_Inicio";
                //                        object Fecha_Final = "Fecha_Final";
                //                        object Dias_Trabajados = "Dias_Trabajados";
                //                        //Comprobante Fiscal Digital
                //                        object Folio_Fiscal = "Folio_Fiscal";
                //                        object Fecha_Certificacion = "Fecha_Certificacion";
                //                        object Serie_SAT = "Serie_SAT";
                //                        object Forma_Pago = "Forma_Pago";
                //                        object Lugar_Emision = "Lugar_Emision";
                //                        object Serie_Folio = "Serie_Folio";
                //                        object Total_OtrosPagos = "Total_OtrosPagos";
                //                        object Total_ = "Total_";
                //                        //Credenciales
                //                        object Sello_CFD = "Sello_CFD";
                //                        object Sello_SAT = "Sello_SAT";
                //                        object Complemento_Certificacion = "Complemento_Certificacion";
                //                        //Duplicados
                //                        object Agregar_QR = "Agregar_QR";
                //                        object Total_C = "Total_C";
                //                        object Total_CC = "Total_CC";
                //                        object Total_PercepcionesC = "Total_PercepcionesC";
                //                        //Extras
                //                        object Lugar_Expedicion = "Lugar_Expedicion";
                //                        object Fecha_Emision = "Fecha_Emision";
                //                        object Serie_Emisor = "Serie_Emisor";
                //                        object Total_Deducciones = "Total_Deducciones";

                //                        ////Busqueda
                //                        Word.Range NombreEmisor = ObjDoc.Bookmarks.get_Item(ref Nombre_Emisor).Range;
                //                        Word.Range RFCEmisor = ObjDoc.Bookmarks.get_Item(ref RFC_Emisor).Range;
                //                        Word.Range RegistroPatronal = ObjDoc.Bookmarks.get_Item(ref Registro_Patronal).Range;
                //                        Word.Range NumeroTrabajador = ObjDoc.Bookmarks.get_Item(ref Numero_Trabajador).Range;
                //                        Word.Range NombreReceptor = ObjDoc.Bookmarks.get_Item(ref Nombre_Receptor).Range;
                //                        Word.Range Curp = ObjDoc.Bookmarks.get_Item(ref Curp_).Range;
                //                        Word.Range RFCReceptor = ObjDoc.Bookmarks.get_Item(ref RFC_Receptor).Range;
                //                        Word.Range NumIMSS = ObjDoc.Bookmarks.get_Item(ref Num_IMSS).Range;
                //                        Word.Range RegimenTrabajador = ObjDoc.Bookmarks.get_Item(ref Regimen_Trabajador).Range;
                //                        Word.Range Puesto = ObjDoc.Bookmarks.get_Item(ref Puesto_).Range;
                //                        Word.Range FechaInicio = ObjDoc.Bookmarks.get_Item(ref Fecha_Inicio).Range;
                //                        Word.Range FechaFinal = ObjDoc.Bookmarks.get_Item(ref Fecha_Final).Range;
                //                        Word.Range DiasTrabajados = ObjDoc.Bookmarks.get_Item(ref Dias_Trabajados).Range;
                //                        Word.Range FolioFiscal = ObjDoc.Bookmarks.get_Item(ref Folio_Fiscal).Range;
                //                        Word.Range FechaCertificacion = ObjDoc.Bookmarks.get_Item(ref Fecha_Certificacion).Range;
                //                        Word.Range SerieSAT = ObjDoc.Bookmarks.get_Item(ref Serie_SAT).Range;
                //                        Word.Range FormaPago = ObjDoc.Bookmarks.get_Item(ref Forma_Pago).Range;
                //                        Word.Range LugarEmision = ObjDoc.Bookmarks.get_Item(ref Lugar_Emision).Range;
                //                        Word.Range SerieFolio = ObjDoc.Bookmarks.get_Item(ref Serie_Folio).Range;
                //                        Word.Range TotalOtrosPagos = ObjDoc.Bookmarks.get_Item(ref Total_OtrosPagos).Range;
                //                        Word.Range Total = ObjDoc.Bookmarks.get_Item(ref Total_).Range;
                //                        Word.Range TotalC = ObjDoc.Bookmarks.get_Item(ref Total_C).Range;
                //                        Word.Range TotalCC = ObjDoc.Bookmarks.get_Item(ref Total_CC).Range;
                //                        Word.Range SelloSAT = ObjDoc.Bookmarks.get_Item(ref Sello_SAT).Range;
                //                        Word.Range SelloCFD = ObjDoc.Bookmarks.get_Item(ref Sello_CFD).Range;
                //                        ObjDoc.Bookmarks.get_Item(ref Agregar_QR).Range.InlineShapes.AddPicture((path + nombre + ".jpg"), false, true);
                //                        Word.Range Departamento = ObjDoc.Bookmarks.get_Item(ref Departamento_).Range;
                //                        Word.Range TotalPercepcionesC = ObjDoc.Bookmarks.get_Item(ref Total_PercepcionesC).Range;
                //                        Word.Range ComplementoCertificacion = ObjDoc.Bookmarks.get_Item(ref Complemento_Certificacion).Range;
                //                        Word.Range LugarExpedicion = ObjDoc.Bookmarks.get_Item(ref Lugar_Expedicion).Range;
                //                        Word.Range FechaEmision = ObjDoc.Bookmarks.get_Item(ref Fecha_Emision).Range;
                //                        Word.Range SerieEmisor = ObjDoc.Bookmarks.get_Item(ref Serie_Emisor).Range;
                //                        Word.Range TotalDeducciones = ObjDoc.Bookmarks.get_Item(ref Total_Deducciones).Range;
                //                        //      //Agregar texto al marcador

                //                        NombreEmisor.Text = _nombreEmisor;
                //                        RFCEmisor.Text = _rfcEmisor;
                //                        RegistroPatronal.Text = _registroPatronal;
                //                        NumeroTrabajador.Text = _numEmpleado;
                //                        NombreReceptor.Text = _nombreReceptor;
                //                        Curp.Text = _curp;
                //                        RFCReceptor.Text = _rfcReceptor;
                //                        NumIMSS.Text = _numSeguridadSocial;
                //                        RegimenTrabajador.Text = _tipoRegimen;
                //                        Puesto.Text = _puesto;
                //                        FechaInicio.Text = _fechaInicialPago.ToString("dd-MMMM-yyyy");
                //                        FechaFinal.Text = _fechaFinalPago.ToString("dd-MMMM-yyyy");
                //                        DiasTrabajados.Text = _numDiasPagados.ToString("0,0");
                //                        FolioFiscal.Text = _uuid;
                //                        FechaCertificacion.Text = _fechaTimbrado.ToString("dd-MMMM-yyyy");
                //                        SerieSAT.Text = _certificadoSAT;
                //                        FormaPago.Text = _formaPago.ToString();
                //                        LugarEmision.Text = _lugarExpedicion;
                //                        SerieFolio.Text = _serie + _folio;
                //                        TotalPercepcionesC.Text = _totalPercepciones.ToString("0,0.00");
                //                        TotalOtrosPagos.Text = _totalOtrosPagos.ToString("0,0.00");
                //                        Total.Text = _total_original.ToString("0,0.00");
                //                        TotalC.Text = _total_original.ToString("0,0.00");
                //                        TotalCC.Text = _total_original.ToString("0,0.00");
                //                        SelloSAT.Text = _selloSAT;
                //                        SelloCFD.Text = _selloDigital;
                //                        Departamento.Text = _departamento;
                //                        ComplementoCertificacion.Text = "||" + _versionTimbreFiscalDigital + "|" + _uuid + "|" + _fechaTimbrado + "|" + _selloDigital + "|" + _certificadoSAT + "||";
                //                        LugarExpedicion.Text = _lugarExpedicion;
                //                        FechaEmision.Text = _fechaEmision.ToString("dd-MMMM-yyyy");
                //                        SerieEmisor.Text = _serie;
                //                        TotalDeducciones.Text = _totalDeducciones.ToString("0,0.00");
                //                        // Fin Modificar documento Nomina

                //                        ObjDoc.SaveAs2(path + nombre + ".docx");
                //                        ObjDoc.Close();
                //                        ObjWord.Quit();
                //                    }
                //                    else if (_tipoComprobante == "I" || _tipoComprobante == "E")
                //                    {
                //                        #region Modificar documento CFDI 4.0
                //                        //Modificar documento CFDI 4.0
                //                        //Marcadores
                //                        object RFC_Emisor = "RFC_Emisor";
                //                        object Razon_Social_Emisor = "Razon_Social_Emisor";
                //                        object Version_CFDI = "Version_CFDI";
                //                        object Tipo_Comprobante = "Tipo_Comprobante";
                //                        object Lugar_Expedicion = "Lugar_Expedicion";
                //                        object Regimen_Fiscal = "Regimen_Fiscal";
                //                        object Forma_Pago = "Forma_Pago";
                //                        object Metodo_Pago = "Metodo_Pago";
                //                        object Moneda_ = "Moneda_";
                //                        object Exportacion_ = "Exportacion_";
                //                        object Folio_ = "Folio";
                //                        object Serie_ = "Serie";
                //                        object Fecha_Emision = "Fecha_Emision";
                //                        object Nombre_Receptor = "Nombre_Receptor";
                //                        object RFC_Receptor = "RFC_Receptor";
                //                        object Domicilio_Fiscal = "Domicilio_Fiscal";
                //                        object Uso_CFDI = "Uso_CFDI";
                //                        object Regimen_Fiscal_Receptor = "Regimen_Fiscal_Receptor";
                //                        object Subtotal_ = "Subtotal_";
                //                        object Descuento_ = "Descuento_";
                //                        object Impuestos_Trasladados = "Impuestos_Trasladados";
                //                        object IVA_Retenido = "IVA_Retenido";
                //                        object ISR_Retenido = "ISR_Retenido";
                //                        object Total_ = "Total_";
                //                        object Tipo_Relacion = "Tipo_Relacion";
                //                        object UUID_ = "UUID_";
                //                        object No_Cetificado_SAT = "No_Cetificado_SAT";
                //                        object Fecha_Timbrado = "Fecha_Timbrado";
                //                        object Sello_CFD = "Sello_CFD";
                //                        object Sello_SAT = "Sello_SAT";
                //                        object Complemento_Certificacion = "Complemento_Certificacion";
                //                        object Imagen_QR = "Imagen_QR";
                //                        object Total_Letra = "Total_Letra";

                //                        //Busqueda
                //                        Word.Range RFCEmisor = ObjDoc.Bookmarks.get_Item(ref RFC_Emisor).Range;
                //                        Word.Range RazonSocialEmisor = ObjDoc.Bookmarks.get_Item(ref Razon_Social_Emisor).Range;
                //                        Word.Range VersionCFDI = ObjDoc.Bookmarks.get_Item(ref Version_CFDI).Range;
                //                        Word.Range RFCReceptor = ObjDoc.Bookmarks.get_Item(ref RFC_Receptor).Range;
                //                        Word.Range NombreReceptor = ObjDoc.Bookmarks.get_Item(ref Nombre_Receptor).Range;
                //                        Word.Range UsoCFDI = ObjDoc.Bookmarks.get_Item(ref Uso_CFDI).Range;
                //                        Word.Range TipoRelacion = ObjDoc.Bookmarks.get_Item(ref Tipo_Relacion).Range;
                //                        Word.Range Folio = ObjDoc.Bookmarks.get_Item(ref Folio_).Range;
                //                        Word.Range Serie = ObjDoc.Bookmarks.get_Item(ref Serie_).Range;
                //                        Word.Range FormaPago = ObjDoc.Bookmarks.get_Item(ref Forma_Pago).Range;
                //                        Word.Range FechaEmision = ObjDoc.Bookmarks.get_Item(ref Fecha_Emision).Range;
                //                        Word.Range FechaTimbrado = ObjDoc.Bookmarks.get_Item(ref Fecha_Timbrado).Range;
                //                        Word.Range TipoComprobante = ObjDoc.Bookmarks.get_Item(ref Tipo_Comprobante).Range;
                //                        Word.Range MetodoPago = ObjDoc.Bookmarks.get_Item(ref Metodo_Pago).Range;
                //                        Word.Range Moneda = ObjDoc.Bookmarks.get_Item(ref Moneda_).Range;
                //                        Word.Range LugarExpedicion = ObjDoc.Bookmarks.get_Item(ref Lugar_Expedicion).Range;
                //                        Word.Range RegimenFiscal = ObjDoc.Bookmarks.get_Item(ref Regimen_Fiscal).Range;
                //                        Word.Range Subtotal = ObjDoc.Bookmarks.get_Item(ref Subtotal_).Range;
                //                        Word.Range Total = ObjDoc.Bookmarks.get_Item(ref Total_).Range;
                //                        Word.Range SelloSAT = ObjDoc.Bookmarks.get_Item(ref Sello_SAT).Range;
                //                        Word.Range SelloCFD = ObjDoc.Bookmarks.get_Item(ref Sello_CFD).Range;
                //                        Word.Range DomicilioFiscal = ObjDoc.Bookmarks.get_Item(ref Domicilio_Fiscal).Range;
                //                        Word.Range ImpuestosTrasladados = ObjDoc.Bookmarks.get_Item(ref Impuestos_Trasladados).Range;
                //                        Word.Range IVARetenido = ObjDoc.Bookmarks.get_Item(ref IVA_Retenido).Range;
                //                        Word.Range ISRRetenido = ObjDoc.Bookmarks.get_Item(ref ISR_Retenido).Range;
                //                        Word.Range Exportacion = ObjDoc.Bookmarks.get_Item(ref Exportacion_).Range;
                //                        Word.Range RegimenFiscalReceptor = ObjDoc.Bookmarks.get_Item(ref Regimen_Fiscal_Receptor).Range;
                //                        Word.Range ComplementoCertificacion = ObjDoc.Bookmarks.get_Item(ref Complemento_Certificacion).Range;
                //                        Word.Range UUID = ObjDoc.Bookmarks.get_Item(ref UUID_).Range;
                //                        Word.Range NoCetificadoSAT = ObjDoc.Bookmarks.get_Item(ref No_Cetificado_SAT).Range;
                //                        ObjDoc.Bookmarks.get_Item(ref Imagen_QR).Range.InlineShapes.AddPicture((path + nombre + ".jpg"), false, true);
                //                        Word.Range Descuento = ObjDoc.Bookmarks.get_Item(ref Descuento_).Range;
                //                        Word.Range TotalLetra = ObjDoc.Bookmarks.get_Item(ref Total_Letra).Range;

                //                        //Agregar texto al marcador
                //                        var let = new Numalet();
                //                        RFCEmisor.Text = _rfcEmisor;
                //                        RazonSocialEmisor.Text = _nombreEmisor;
                //                        VersionCFDI.Text = _version;
                //                        RFCReceptor.Text = _rfcReceptor;
                //                        NombreReceptor.Text = _nombreReceptor;
                //                        UsoCFDI.Text = _usoCFDI;
                //                        TipoRelacion.Text = _tipoRelacion;
                //                        Folio.Text = _folio;
                //                        Serie.Text = _serie + " - ";
                //                        FormaPago.Text = _formaPago.ToString();
                //                        FechaEmision.Text = _fechaEmision.ToString();
                //                        FechaTimbrado.Text = _fechaTimbrado.ToString();
                //                        TipoComprobante.Text = _tipoComprobante;
                //                        MetodoPago.Text = _metodoPago;
                //                        Moneda.Text = _moneda;
                //                        LugarExpedicion.Text = _lugarExpedicion;
                //                        RegimenFiscal.Text = let.RegimenFiscal(_regimenFiscal);
                //                        Subtotal.Text = _subtotal.ToString("0,0.00");
                //                        Total.Text = _total_original.ToString("0,0.00");
                //                        SelloSAT.Text = _selloSAT;
                //                        SelloCFD.Text = _selloDigital;
                //                        DomicilioFiscal.Text = _domicilioFiscalReceptor;
                //                        ImpuestosTrasladados.Text = _TotalImpuestosTrasladados.ToString("0,0.00");
                //                        IVARetenido.Text = _importeRetencion.ToString("0,0.00");
                //                        ISRRetenido.Text = (_TotalImpuestosRetenidos - _importeRetencion).ToString("0,0.00");
                //                        Exportacion.Text = _exportacion;
                //                        RegimenFiscalReceptor.Text = let.RegimenFiscal(_regimenFiscalReceptor);
                //                        ComplementoCertificacion.Text = "||" + _versionTimbreFiscalDigital + "|" + _uuid + "|" + _fechaTimbrado + "|" + _selloDigital + "|" + _certificadoSAT + "||";
                //                        UUID.Text = _uuid;
                //                        NoCetificadoSAT.Text = _certificadoSAT;
                //                        Descuento.Text = _descuento.ToString("0,0.00");
                //                        TotalLetra.Text = let.ToCustomCardinal(_total_original);

                //                        ObjDoc.SaveAs2(path + nombre + ".docx");
                //                        ObjDoc.Close();
                //                        ObjWord.Quit();
                //                        //Fin Modificar documento                                

                //                        #endregion
                //                    }
                //                    else if (_tipoComprobante == "T")
                //                    {
                //                        //Marcadores
                //                        //Emisor
                //                        object Nombre_Emisor = "Nombre_Emisor";
                //                        object RFC_Emisor = "RFC_Emisor";
                //                        object Regimen_Fiscal = "Regimen_Fiscal";
                //                        object Lugar_Expedicion = "Lugar_Expedicion";
                //                        object Fecha_Timbrado = "Fecha_Timbrado";
                //                        object Fecha_Emisión = "Fecha_Emisión";
                //                        //Cliente
                //                        object Nombre_Receptor = "Nombre_Receptor";
                //                        object RFC_Receptor = "RFC_Receptor";
                //                        object Folio_Fiscal = "Folio_Fiscal";
                //                        object Certificado_Digital = "Certificado_Digital";
                //                        object Certificado_SAT = "Certificado_SAT";
                //                        object Domicilio_Receptor = "Domicilio_Receptor";
                //                        //Comprobante
                //                        object Uso_CFDI = "Uso_CFDI";
                //                        object Tipo_Comprobante = "Tipo_Comprobante";
                //                        object Moneda_ = "Moneda_";
                //                        object Nombre_Aseguradora = "Nombre_Aseguradora";
                //                        object Numero_Poliza = "Numero_Poliza";
                //                        object Placa_ = "Placa_";
                //                        object Anio_ = "Anio_";
                //                        object Transporte_Internacional = "Transporte_Internacional";
                //                        object Metodo_Pago = "Metodo_Pago";
                //                        object Forma_Pago = "Forma_Pago";
                //                        object Tipo_Cambio = "Tipo_Cambio";
                //                        object Sello_CFDI = "Sello_CFDI";
                //                        object Sello_SAT = "Sello_SAT";
                //                        object Permiso_STC = "Permiso_STC";
                //                        object Num_Permiso_STC = "Num_Permiso_STC";
                //                        object Cadena_Original = "Cadena_Original";
                //                        object Config_Autotransporte = "Config_Autotransporte";
                //                        object Domicilio_ = "Domicilio_";
                //                        object Total_ = "Total_";
                //                        object Importe_Letra = "Importe_Letra";
                //                        object Subtotal_ = "Subtotal_";
                //                        object Descuento_ = "Descuento_";
                //                        object Imagen_QR = "Imagen_QR";

                //                        //Busqueda
                //                        //Emisor
                //                        Word.Range NombreEmisor = ObjDoc.Bookmarks.get_Item(ref Nombre_Emisor).Range;
                //                        Word.Range RFCEmisor = ObjDoc.Bookmarks.get_Item(ref RFC_Emisor).Range;
                //                        Word.Range RegimenFiscal = ObjDoc.Bookmarks.get_Item(ref Regimen_Fiscal).Range;
                //                        Word.Range LugarExpedicion = ObjDoc.Bookmarks.get_Item(ref Lugar_Expedicion).Range;
                //                        Word.Range FechaTimbrado = ObjDoc.Bookmarks.get_Item(ref Fecha_Timbrado).Range;
                //                        Word.Range FechaEmisión = ObjDoc.Bookmarks.get_Item(ref Fecha_Emisión).Range;
                //                        //Cliente
                //                        Word.Range NombreReceptor = ObjDoc.Bookmarks.get_Item(ref Nombre_Receptor).Range;
                //                        Word.Range RFCReceptor = ObjDoc.Bookmarks.get_Item(ref RFC_Receptor).Range;
                //                        Word.Range FolioFiscal = ObjDoc.Bookmarks.get_Item(ref Folio_Fiscal).Range;
                //                        Word.Range CertificadoDigital = ObjDoc.Bookmarks.get_Item(ref Certificado_Digital).Range;
                //                        Word.Range CertificadoSAT = ObjDoc.Bookmarks.get_Item(ref Certificado_SAT).Range;
                //                        Word.Range DomicilioReceptor = ObjDoc.Bookmarks.get_Item(ref Domicilio_Receptor).Range;
                //                        //Comprobante
                //                        Word.Range UsoCFDI = ObjDoc.Bookmarks.get_Item(ref Uso_CFDI).Range;
                //                        Word.Range TipoComprobante = ObjDoc.Bookmarks.get_Item(ref Tipo_Comprobante).Range;
                //                        Word.Range Moneda = ObjDoc.Bookmarks.get_Item(ref Moneda_).Range;
                //                        Word.Range NombreAseguradora = ObjDoc.Bookmarks.get_Item(ref Nombre_Aseguradora).Range;
                //                        Word.Range NumeroPoliza = ObjDoc.Bookmarks.get_Item(ref Numero_Poliza).Range;
                //                        Word.Range Placa = ObjDoc.Bookmarks.get_Item(ref Placa_).Range;
                //                        Word.Range Anio = ObjDoc.Bookmarks.get_Item(ref Anio_).Range;
                //                        Word.Range TransporteInternacional = ObjDoc.Bookmarks.get_Item(ref Transporte_Internacional).Range;
                //                        Word.Range MetodoPago = ObjDoc.Bookmarks.get_Item(ref Metodo_Pago).Range;
                //                        Word.Range FormaPago = ObjDoc.Bookmarks.get_Item(ref Forma_Pago).Range;
                //                        Word.Range TipoCambio = ObjDoc.Bookmarks.get_Item(ref Tipo_Cambio).Range;
                //                        Word.Range SelloCFDI = ObjDoc.Bookmarks.get_Item(ref Sello_CFDI).Range;
                //                        Word.Range SelloSAT = ObjDoc.Bookmarks.get_Item(ref Sello_SAT).Range;
                //                        Word.Range PermisoSTC = ObjDoc.Bookmarks.get_Item(ref Permiso_STC).Range;
                //                        Word.Range NumPermisoSTC = ObjDoc.Bookmarks.get_Item(ref Num_Permiso_STC).Range;
                //                        Word.Range CadenaOriginal = ObjDoc.Bookmarks.get_Item(ref Cadena_Original).Range;
                //                        Word.Range ConfigAutotransporte = ObjDoc.Bookmarks.get_Item(ref Config_Autotransporte).Range;
                //                        Word.Range Domicilio = ObjDoc.Bookmarks.get_Item(ref Domicilio_).Range;
                //                        Word.Range Total = ObjDoc.Bookmarks.get_Item(ref Total_).Range;
                //                        Word.Range ImporteLetra = ObjDoc.Bookmarks.get_Item(ref Importe_Letra).Range;
                //                        Word.Range Subtotal = ObjDoc.Bookmarks.get_Item(ref Subtotal_).Range;
                //                        Word.Range Descuento = ObjDoc.Bookmarks.get_Item(ref Descuento_).Range;
                //                        ObjDoc.Bookmarks.get_Item(ref Imagen_QR).Range.InlineShapes.AddPicture((path + nombre + ".jpg"), false, true);

                //                        //Agregar texto al marcador
                //                        //Emisor
                //                        NombreEmisor.Text = _nombreEmisor;
                //                        RFCEmisor.Text = _rfcEmisor;
                //                        RegimenFiscal.Text = _regimenFiscal;
                //                        LugarExpedicion.Text = _lugarExpedicion;
                //                        FechaTimbrado.Text = _fechaTimbrado.ToString("G");
                //                        FechaEmisión.Text = _fechaEmision.ToString("G");
                //                        //Cliente
                //                        NombreReceptor.Text = _nombreReceptor;
                //                        RFCReceptor.Text = _rfcReceptor;
                //                        FolioFiscal.Text = _uuid;
                //                        CertificadoDigital.Text = _NoCertificado;
                //                        CertificadoSAT.Text = _certificadoSAT;
                //                        DomicilioReceptor.Text = _domicilioFiscalReceptor;
                //                        //Comprobante
                //                        UsoCFDI.Text = _usoCFDI;
                //                        TipoComprobante.Text = _tipoComprobante;
                //                        Moneda.Text = _moneda;
                //                        NombreAseguradora.Text = _aseguraRespCivil;
                //                        NumeroPoliza.Text = _polizaRespCivil;
                //                        Placa.Text = _placaVM;
                //                        Anio.Text = _anioModelo;
                //                        TransporteInternacional.Text = _transpInter;
                //                        MetodoPago.Text = _metodoPago;
                //                        FormaPago.Text = _formaPago;
                //                        TipoCambio.Text = _tipoCambio.ToString();
                //                        SelloCFDI.Text = _selloDigital;
                //                        SelloSAT.Text = _selloSAT;
                //                        PermisoSTC.Text = _permSCT;
                //                        NumPermisoSTC.Text = _numPermisoSCT;
                //                        CadenaOriginal.Text = "||" + _versionTimbreFiscalDigital + "|" + _uuid + "|" + _fechaTimbrado.ToString("s") + "|" + _selloDigital + "|" + _certificadoSAT + "||";
                //                        ConfigAutotransporte.Text = _configVehivular;
                //                        Domicilio.Text = _lugarExpedicion;
                //                        Total.Text = _total_original.ToString("0,0.00");
                //                        var let = new Numalet();
                //                        ImporteLetra.Text = let.ToCustomCardinal(_total_original);
                //                        Subtotal.Text = _subtotal.ToString("0,0.00");
                //                        Descuento.Text = _descuento.ToString("0,0.00");



                //                        ObjDoc.SaveAs2(path + nombre + ".docx");
                //                        ObjDoc.Close();
                //                        ObjWord.Quit();
                //                    }
                //                    else if (_tipoComprobante == "P")
                //                    {
                //                        //Marcadores
                //                        //Emisor
                //                        object Nombre_Emisor = "Nombre_Emisor";
                //                        object RFC_Emisor = "RFC_Emisor";
                //                        object Lugar_Expedicion = "Lugar_Expedicion";
                //                        object C_P = "C_P";

                //                        //Cliente
                //                        object Nombre_Cliente = "Nombre_Cliente";
                //                        object RFC_Cliente = "RFC_Cliente";
                //                        object No_Certificado = "No_Certificado";
                //                        object Regimen_Fiscal = "Regimen_Fiscal";
                //                        object C_P_Receptor = "C_P_Receptor";

                //                        //Comprobante
                //                        object Fecha_ = "Fecha_";
                //                        object Serie_Folio = "Serie_Folio";
                //                        object Serie_Folio2 = "Serie_Folio2";
                //                        object Cadena_Original = "Cadena_Original";
                //                        object Sello_CFD = "Sello_CFD";
                //                        object Sello_SAT = "Sello_SAT";
                //                        object Fecha_Timbrado = "Fecha_Timbrado";
                //                        object Version_Timbre = "Version_Timbre";
                //                        object Certificado_SAT = "Certificado_SAT";
                //                        object UUID_ = "UUID_";
                //                        object Codigo_QR = "Codigo_QR";


                //                        //Busqueda
                //                        //Emisor
                //                        Word.Range NombreEmisor = ObjDoc.Bookmarks.get_Item(ref Nombre_Emisor).Range;
                //                        Word.Range RFCEmisor = ObjDoc.Bookmarks.get_Item(ref RFC_Emisor).Range;
                //                        Word.Range LugarExpedicion = ObjDoc.Bookmarks.get_Item(ref Lugar_Expedicion).Range;
                //                        Word.Range CP = ObjDoc.Bookmarks.get_Item(ref C_P).Range;
                //                        //Cliente
                //                        Word.Range NombreCliente = ObjDoc.Bookmarks.get_Item(ref Nombre_Cliente).Range;
                //                        Word.Range RFCCliente = ObjDoc.Bookmarks.get_Item(ref RFC_Cliente).Range;
                //                        Word.Range NoCertificado = ObjDoc.Bookmarks.get_Item(ref No_Certificado).Range;
                //                        Word.Range RegimenFiscal = ObjDoc.Bookmarks.get_Item(ref Regimen_Fiscal).Range;
                //                        Word.Range CPReceptor = ObjDoc.Bookmarks.get_Item(ref C_P_Receptor).Range;

                //                        //Comprobante
                //                        Word.Range Fecha = ObjDoc.Bookmarks.get_Item(ref Fecha_).Range;
                //                        Word.Range SerieFolio = ObjDoc.Bookmarks.get_Item(ref Serie_Folio).Range;
                //                        Word.Range SerieFolio2 = ObjDoc.Bookmarks.get_Item(ref Serie_Folio2).Range;
                //                        Word.Range CadenaOriginal = ObjDoc.Bookmarks.get_Item(ref Cadena_Original).Range;
                //                        Word.Range SelloCFD = ObjDoc.Bookmarks.get_Item(ref Sello_CFD).Range;
                //                        Word.Range SelloSAT = ObjDoc.Bookmarks.get_Item(ref Sello_SAT).Range;
                //                        Word.Range FechaTimbrado = ObjDoc.Bookmarks.get_Item(ref Fecha_Timbrado).Range;
                //                        Word.Range VersionTimbre = ObjDoc.Bookmarks.get_Item(ref Version_Timbre).Range;
                //                        Word.Range CertificadoSAT = ObjDoc.Bookmarks.get_Item(ref Certificado_SAT).Range;
                //                        Word.Range UUID = ObjDoc.Bookmarks.get_Item(ref UUID_).Range;
                //                        ObjDoc.Bookmarks.get_Item(ref Codigo_QR).Range.InlineShapes.AddPicture((path + nombre + ".jpg"), false, true);

                //                        //Agregar texto al marcador
                //                        //Emisor
                //                        NombreEmisor.Text = _nombreEmisor;
                //                        RFCEmisor.Text = _rfcEmisor;
                //                        LugarExpedicion.Text = _lugarExpedicion;
                //                        CP.Text = _lugarExpedicion;

                //                        //Cliente
                //                        NombreCliente.Text = _nombreReceptor;
                //                        RFCCliente.Text = _rfcReceptor;
                //                        NoCertificado.Text = _NoCertificado;
                //                        RegimenFiscal.Text = _regimenFiscal;
                //                        CPReceptor.Text = _domicilioFiscalReceptor;

                //                        //Comprobante
                //                        Fecha.Text = _fechaEmision.ToString("D");
                //                        SerieFolio.Text = _serie + _folio;
                //                        SerieFolio2.Text = _serie + _folio;
                //                        CadenaOriginal.Text = "||" + _versionTimbreFiscalDigital + "|" + _uuid + "|" + _fechaTimbrado.ToString("s") + "|" + _selloDigital + "|" + _certificadoSAT + "||";
                //                        SelloCFD.Text = _selloDigital;
                //                        SelloSAT.Text = _selloSAT;
                //                        FechaTimbrado.Text = _fechaTimbrado.ToString("s");
                //                        VersionTimbre.Text = _versionTimbreFiscalDigital;
                //                        CertificadoSAT.Text = _certificadoSAT;
                //                        UUID.Text = _uuid;


                //                        ObjDoc.SaveAs2(path + nombre + ".docx");
                //                        ObjDoc.Close();
                //                        ObjWord.Quit();
                //                    }

                //                    //Crear PDF
                //                    var pdfProcess = new Process();
                //                    pdfProcess.StartInfo.FileName = "D:/VS/Formatos/Documentos/LibreOfficePortablePrevious/App/libreoffice/program/soffice.exe";
                //                    pdfProcess.StartInfo.Arguments = "--headless --convert-to pdf " + path + nombre + ".docx --outdir " + path;
                //                    pdfProcess.Start();



                //                    #endregion
                //                }
                //            }
                //        }

                //    }
                //    int x = 0;
                //    while (x < 30)
                //    {
                //        Thread.Sleep(1000);
                //        if (System.IO.File.Exists(archivo))
                //        {
                //            Thread.Sleep(2000);
                //            System.IO.File.Delete(path + nombre + ".jpg");
                //            System.IO.File.Delete(path + nombre + ".docx");
                //            break;
                //        }

                //        x++;
                //    }
                //    //Descarga PDF
                //    return File(Path.ChangeExtension(fullPath, ".pdf"), "application/pdf", uuid + ".pdf");

                //}
                //else
                //{
                //    //Descargar PDF
                //    return File(Path.ChangeExtension(fullPath, ".pdf"), "application/pdf", uuid + ".pdf");
                //}
                #endregion
            }
        }


        [SessionAuthorize]
        public ActionResult Nominas()
        {
            if (!ValidarAccesoVista("Cliente", "Nominas"))
                return RedirectToAction("Inicio", "Inicio");

            tbc_Usuarios user = Session["tbc_Usuarios"] as tbc_Usuarios;
            String rfc = user.usuario;
            ViewBag.rfc = rfc;
            ViewBag.esDemo = (user.ultimo_movimiento != null || user.ultimo_movimiento != "" ? 1 : 0);
            return View();
        }

        public string GetDocumentosNominas(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetDocumentosNominas(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult Entregables()
        {
            if (!ValidarAccesoVista("Cliente", "Entregables"))
                return RedirectToAction("Inicio", "Inicio");

            tbc_Usuarios user = Session["tbc_Usuarios"] as tbc_Usuarios;
            String rfc = user.usuario;
            ViewBag.rfc = rfc;
            ViewBag.id_regimen = user.id_regimen;
            ViewBag.esDemo = (user.ultimo_movimiento != null || user.ultimo_movimiento != "" ? 1 : 0);
            return View();
        }

        public string GetEntregables(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetEntregables(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }


        [SessionAuthorize]
        public ActionResult EdoCuenta()
        {
            if (!ValidarAccesoVista("Cliente", "EdoCuenta"))
                return RedirectToAction("Inicio", "Inicio");

            tbc_Usuarios user = Session["tbc_Usuarios"] as tbc_Usuarios;
            String rfc = user.usuario;
            ViewBag.rfc = rfc;
            ViewBag.id_regimen = user.id_regimen;
            return View();
        }

        public string GetEdoCuenta(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetEdoCuenta(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }



        public string AddEstadoCuenta(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/EstadoCuenta");
            dAL_Clientes.AddEstadoCuentaC(jsonJS, Request, path);
            return dAL_Clientes.result.returnToJsonString();
        }


        [SessionAuthorize]
        public ActionResult ListaClientes()
        {
            if (!ValidarAccesoVista("Cliente", "ListaClientes"))
                return RedirectToAction("Inicio", "Inicio");

            tbc_Usuarios user = Session["tbc_Usuarios"] as tbc_Usuarios;
            String rfc = user.usuario;
            ViewBag.rfc = rfc;
            return View();
        }

        public string GetListaClientes(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetListaClientes(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult ListaProveedores()
        {
            if (!ValidarAccesoVista("Cliente", "ListaProveedores"))
                return RedirectToAction("Inicio", "Inicio");

            tbc_Usuarios user = Session["tbc_Usuarios"] as tbc_Usuarios;
            String rfc = user.usuario;
            ViewBag.rfc = rfc;
            return View();
        }

        public string GetListaProveedores(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetListaProveedores(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }



        [SessionAuthorize]
        public ActionResult MisTramites()
        {
            if (!ValidarAccesoVista("Cliente", "MisTramites"))
                return RedirectToAction("Inicio", "Inicio");

            tbc_Usuarios user = Session["tbc_Usuarios"] as tbc_Usuarios;
            String rfc = user.usuario;
            ViewBag.rfc = rfc;
            return View();
        }

        public string GetListaTramites(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetListaTramites(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }

        public string AddTramite(string jsonJS, int? id_RV, int? id_RVA)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            var path = Server.MapPath("~/Documentos/CRM");
            dAL_CRM.AddTramite(jsonJS, Request, path);
            return dAL_CRM.result.returnToJsonString();
        }



        [SessionAuthorize]
        public ActionResult Notificaciones()
        {
            if (!ValidarAccesoVista("Cliente", "Notificaciones"))
                return RedirectToAction("Inicio", "Inicio");

            tbc_Usuarios user = Session["tbc_Usuarios"] as tbc_Usuarios;
            String rfc = user.usuario;
            ViewBag.rfc = rfc;
            return View();
        }

        public string GetNotificaciones(string jsonJS, int? id_RV)
        {
            DAL_CRM dAL_CRM = new DAL_CRM();
            dAL_CRM.p_CRM.id_RV = id_RV;
            dAL_CRM.GetNotificaciones(jsonJS);
            return dAL_CRM.result.returnToJsonString();
        }


        public FileResult DownloadZipFileIngresos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetXMLZipCRMIngresos(jsonJS);
            if (dAL_Clientes.result.status == 0 && dAL_Clientes.result.resultStoredProcedure.msnSuccess != null)
            {
                dynamic filtro = new ExpandoObject();
                dynamic data = new ExpandoObject();
                data = JsonConvert.DeserializeObject(dAL_Clientes.result.resultStoredProcedure.msnSuccess);
                filtro = JsonConvert.DeserializeObject(jsonJS);
                string mes = filtro.mes;
                string periodo = filtro.periodo;
                string rfc = filtro.rfc;
                var fileName = string.Format("{0}_{1}XMLIngresos.zip", rfc, mes + "_" + periodo);
                var tempOutPutPath = Server.MapPath(Url.Content("/Castelan/Documentos/TempZipCRM/")) + fileName;
                //var tempOutPutPath = Server.MapPath(Url.Content("/Documentos/TempZipCRM/")) + fileName;


                using (ZipOutputStream s = new ZipOutputStream(System.IO.File.Create(tempOutPutPath)))
                {
                    s.SetLevel(9); // 0-9, 9 being the highest compression
                    byte[] buffer = new byte[4096];

                    foreach (var item in data)
                    {
                        string url = item.url_xml;
                        string estatus = item.estatus;
                        string tipo_comprobante = item.tipo_comprobante;
                        string tipo_xml = item.tipo_xml;
                        string total = item.total;
                        int forma_pago = Convert.ToInt32(item.forma_pago);
                        Decimal total_decimal = Convert.ToDecimal(total);
                        string tipo = (tipo_xml == "Emisor" ? "/EMITIDOS" : "/RECIBIDOS");

                        ZipEntry entry;

                        //PDF

                        String pathPDF = Path.ChangeExtension(url, ".pdf");
                        if (!System.IO.File.Exists(pathPDF))
                        {
                            funciones.CargaXMLtoPDF(url);
                        }

                        Boolean existe = System.IO.File.Exists(pathPDF);


                        //CANCELADOS
                        if (estatus == "CANCELADO")
                        {
                            tipo += "/CANCELADO";
                            //XML
                            entry = new ZipEntry(tipo + "/" + Path.GetFileName(url));
                            entry.DateTime = DateTime.Now;
                            entry.IsUnicodeText = true;
                            s.PutNextEntry(entry);
                            using (FileStream fs = System.IO.File.OpenRead(url))
                            {
                                int sourceBytes;
                                do
                                {
                                    sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                    s.Write(buffer, 0, sourceBytes);
                                } while (sourceBytes > 0);
                            }

                            //PDF
                            if (existe)
                            {
                                entry = new ZipEntry(tipo + "/" + Path.GetFileName(pathPDF));
                                entry.DateTime = DateTime.Now;
                                entry.IsUnicodeText = true;
                                s.PutNextEntry(entry);
                                using (FileStream fs = System.IO.File.OpenRead(pathPDF))
                                {
                                    int sourceBytes;
                                    do
                                    {
                                        sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                        s.Write(buffer, 0, sourceBytes);
                                    } while (sourceBytes > 0);
                                }
                            }
                        }


                        //FACTURA
                        if (tipo_comprobante == "I")
                        {

                            tipo += "/FACTURA";
                            //XML
                            entry = new ZipEntry(tipo + "/" + Path.GetFileName(url));
                            entry.DateTime = DateTime.Now;
                            entry.IsUnicodeText = true;
                            s.PutNextEntry(entry);
                            using (FileStream fs = System.IO.File.OpenRead(url))
                            {
                                int sourceBytes;
                                do
                                {
                                    sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                    s.Write(buffer, 0, sourceBytes);
                                } while (sourceBytes > 0);
                            }
                            //PDF
                            if (existe)
                            {
                                entry = new ZipEntry(tipo + "/" + Path.GetFileName(pathPDF));
                                entry.DateTime = DateTime.Now;
                                entry.IsUnicodeText = true;
                                s.PutNextEntry(entry);
                                using (FileStream fs = System.IO.File.OpenRead(pathPDF))
                                {
                                    int sourceBytes;
                                    do
                                    {
                                        sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                        s.Write(buffer, 0, sourceBytes);
                                    } while (sourceBytes > 0);
                                }
                            }

                            if (total_decimal <= 2000 && forma_pago == 1)
                            {
                                if (tipo_xml != "Emisor")
                                {
                                    tipo += "/PAGOS MENORES";
                                }
                                else
                                {
                                    tipo += "/COBROS MENORES";
                                }
                                //XML
                                entry = new ZipEntry(tipo + "/" + Path.GetFileName(url));
                                entry.DateTime = DateTime.Now;
                                entry.IsUnicodeText = true;
                                s.PutNextEntry(entry);
                                using (FileStream fs = System.IO.File.OpenRead(url))
                                {
                                    int sourceBytes;
                                    do
                                    {
                                        sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                        s.Write(buffer, 0, sourceBytes);
                                    } while (sourceBytes > 0);
                                }
                                //PDF
                                if (existe)
                                {
                                    entry = new ZipEntry(tipo + "/" + Path.GetFileName(pathPDF));
                                    entry.DateTime = DateTime.Now;
                                    entry.IsUnicodeText = true;
                                    s.PutNextEntry(entry);
                                    using (FileStream fs = System.IO.File.OpenRead(pathPDF))
                                    {
                                        int sourceBytes;
                                        do
                                        {
                                            sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                            s.Write(buffer, 0, sourceBytes);
                                        } while (sourceBytes > 0);
                                    }
                                }
                            }
                        }

                        //NOMINA
                        if (tipo_comprobante == "N")
                        {
                            tipo += "/NOMINAS";
                            //XML
                            entry = new ZipEntry(tipo + "/" + Path.GetFileName(url));
                            entry.DateTime = DateTime.Now;
                            entry.IsUnicodeText = true;
                            s.PutNextEntry(entry);
                            using (FileStream fs = System.IO.File.OpenRead(url))
                            {
                                int sourceBytes;
                                do
                                {
                                    sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                    s.Write(buffer, 0, sourceBytes);
                                } while (sourceBytes > 0);
                            }
                            //PDF
                            if (existe)
                            {
                                entry = new ZipEntry(tipo + "/" + Path.GetFileName(pathPDF));
                                entry.DateTime = DateTime.Now;
                                entry.IsUnicodeText = true;
                                s.PutNextEntry(entry);
                                using (FileStream fs = System.IO.File.OpenRead(pathPDF))
                                {
                                    int sourceBytes;
                                    do
                                    {
                                        sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                        s.Write(buffer, 0, sourceBytes);
                                    } while (sourceBytes > 0);
                                }
                            }
                        }


                        //PAGOS
                        if (tipo_comprobante == "P")
                        {
                            tipo += "/PAGOS";
                            //XML
                            entry = new ZipEntry(tipo + "/" + Path.GetFileName(url));
                            entry.DateTime = DateTime.Now;
                            entry.IsUnicodeText = true;
                            s.PutNextEntry(entry);
                            using (FileStream fs = System.IO.File.OpenRead(url))
                            {
                                int sourceBytes;
                                do
                                {
                                    sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                    s.Write(buffer, 0, sourceBytes);
                                } while (sourceBytes > 0);
                            }
                            //PDF
                            if (existe)
                            {
                                entry = new ZipEntry(tipo + "/" + Path.GetFileName(pathPDF));
                                entry.DateTime = DateTime.Now;
                                entry.IsUnicodeText = true;
                                s.PutNextEntry(entry);
                                using (FileStream fs = System.IO.File.OpenRead(pathPDF))
                                {
                                    int sourceBytes;
                                    do
                                    {
                                        sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                        s.Write(buffer, 0, sourceBytes);
                                    } while (sourceBytes > 0);
                                }
                            }
                        }


                        //NOTAS DE CREDITO
                        if (tipo_comprobante == "E")
                        {
                            tipo += "/NOTAS DE CREDITO";
                            //XML
                            entry = new ZipEntry(tipo + "/" + Path.GetFileName(url));
                            entry.DateTime = DateTime.Now;
                            entry.IsUnicodeText = true;
                            s.PutNextEntry(entry);
                            using (FileStream fs = System.IO.File.OpenRead(url))
                            {
                                int sourceBytes;
                                do
                                {
                                    sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                    s.Write(buffer, 0, sourceBytes);
                                } while (sourceBytes > 0);
                            }
                            //PDF
                            if (existe)
                            {
                                entry = new ZipEntry(tipo + "/" + Path.GetFileName(pathPDF));
                                entry.DateTime = DateTime.Now;
                                entry.IsUnicodeText = true;
                                s.PutNextEntry(entry);
                                using (FileStream fs = System.IO.File.OpenRead(pathPDF))
                                {
                                    int sourceBytes;
                                    do
                                    {
                                        sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                        s.Write(buffer, 0, sourceBytes);
                                    } while (sourceBytes > 0);
                                }
                            }
                        }

                    }
                    s.Finish();
                    s.Flush();
                    s.Close();
                }

                byte[] finalResult = System.IO.File.ReadAllBytes(tempOutPutPath);
                if (System.IO.File.Exists(tempOutPutPath))
                    System.IO.File.Delete(tempOutPutPath);

                if (finalResult == null || !finalResult.Any())
                    throw new Exception(String.Format("No se encontrarons archivos."));

                return File(finalResult, "application/zip", fileName);
            }
            return null;
        }

        public FileResult DownloadZipFileGastos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetXMLZipCRMGastos(jsonJS);
            if (dAL_Clientes.result.status == 0 && dAL_Clientes.result.resultStoredProcedure.msnSuccess != null)
            {
                dynamic filtro = new ExpandoObject();
                dynamic data = new ExpandoObject();
                data = JsonConvert.DeserializeObject(dAL_Clientes.result.resultStoredProcedure.msnSuccess);
                filtro = JsonConvert.DeserializeObject(jsonJS);
                string mes = filtro.mes;
                string periodo = filtro.periodo;
                string rfc = filtro.rfc;
                var fileName = string.Format("{0}_{1}XMLGastos.zip", rfc, mes + "_" + periodo);
                var tempOutPutPath = Server.MapPath(Url.Content("/Castelan/Documentos/TempZipCRM/")) + fileName;
                //var tempOutPutPath = Server.MapPath(Url.Content("/Documentos/TempZipCRM/")) + fileName;


                using (ZipOutputStream s = new ZipOutputStream(System.IO.File.Create(tempOutPutPath)))
                {
                    s.SetLevel(9); // 0-9, 9 being the highest compression
                    byte[] buffer = new byte[4096];

                    foreach (var item in data)
                    {
                        string url = item.url_xml;
                        string estatus = item.estatus;
                        string tipo_comprobante = item.tipo_comprobante;
                        string tipo_xml = item.tipo_xml;
                        string total = item.total;
                        int forma_pago = Convert.ToInt32(item.forma_pago);
                        Decimal total_decimal = Convert.ToDecimal(total);
                        string tipo = (tipo_xml == "Emisor" ? "/EMITIDOS" : "/RECIBIDOS");

                        ZipEntry entry;

                        //PDF

                        String pathPDF = Path.ChangeExtension(url, ".pdf");
                        if (!System.IO.File.Exists(pathPDF))
                        {
                            funciones.CargaXMLtoPDF(url);
                        }

                        Boolean existe = System.IO.File.Exists(pathPDF);


                        //CANCELADOS
                        if (estatus == "CANCELADO")
                        {
                            tipo += "/CANCELADO";
                            //XML
                            entry = new ZipEntry(tipo + "/" + Path.GetFileName(url));
                            entry.DateTime = DateTime.Now;
                            entry.IsUnicodeText = true;
                            s.PutNextEntry(entry);
                            using (FileStream fs = System.IO.File.OpenRead(url))
                            {
                                int sourceBytes;
                                do
                                {
                                    sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                    s.Write(buffer, 0, sourceBytes);
                                } while (sourceBytes > 0);
                            }

                            //PDF
                            if (existe)
                            {
                                entry = new ZipEntry(tipo + "/" + Path.GetFileName(pathPDF));
                                entry.DateTime = DateTime.Now;
                                entry.IsUnicodeText = true;
                                s.PutNextEntry(entry);
                                using (FileStream fs = System.IO.File.OpenRead(pathPDF))
                                {
                                    int sourceBytes;
                                    do
                                    {
                                        sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                        s.Write(buffer, 0, sourceBytes);
                                    } while (sourceBytes > 0);
                                }
                            }
                        }


                        //FACTURA
                        if (tipo_comprobante == "I")
                        {

                            tipo += "/FACTURA";
                            //XML
                            entry = new ZipEntry(tipo + "/" + Path.GetFileName(url));
                            entry.DateTime = DateTime.Now;
                            entry.IsUnicodeText = true;
                            s.PutNextEntry(entry);
                            using (FileStream fs = System.IO.File.OpenRead(url))
                            {
                                int sourceBytes;
                                do
                                {
                                    sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                    s.Write(buffer, 0, sourceBytes);
                                } while (sourceBytes > 0);
                            }
                            //PDF
                            if (existe)
                            {
                                entry = new ZipEntry(tipo + "/" + Path.GetFileName(pathPDF));
                                entry.DateTime = DateTime.Now;
                                entry.IsUnicodeText = true;
                                s.PutNextEntry(entry);
                                using (FileStream fs = System.IO.File.OpenRead(pathPDF))
                                {
                                    int sourceBytes;
                                    do
                                    {
                                        sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                        s.Write(buffer, 0, sourceBytes);
                                    } while (sourceBytes > 0);
                                }
                            }

                            if (total_decimal <= 2000 && forma_pago == 1)
                            {
                                if (tipo_xml != "Emisor")
                                {
                                    tipo += "/PAGOS MENORES";
                                }
                                else
                                {
                                    tipo += "/COBROS MENORES";
                                }
                                //XML
                                entry = new ZipEntry(tipo + "/" + Path.GetFileName(url));
                                entry.DateTime = DateTime.Now;
                                entry.IsUnicodeText = true;
                                s.PutNextEntry(entry);
                                using (FileStream fs = System.IO.File.OpenRead(url))
                                {
                                    int sourceBytes;
                                    do
                                    {
                                        sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                        s.Write(buffer, 0, sourceBytes);
                                    } while (sourceBytes > 0);
                                }
                                //PDF
                                if (existe)
                                {
                                    entry = new ZipEntry(tipo + "/" + Path.GetFileName(pathPDF));
                                    entry.DateTime = DateTime.Now;
                                    entry.IsUnicodeText = true;
                                    s.PutNextEntry(entry);
                                    using (FileStream fs = System.IO.File.OpenRead(pathPDF))
                                    {
                                        int sourceBytes;
                                        do
                                        {
                                            sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                            s.Write(buffer, 0, sourceBytes);
                                        } while (sourceBytes > 0);
                                    }
                                }
                            }
                        }

                        //NOMINA
                        if (tipo_comprobante == "N")
                        {
                            tipo += "/NOMINAS";
                            //XML
                            entry = new ZipEntry(tipo + "/" + Path.GetFileName(url));
                            entry.DateTime = DateTime.Now;
                            entry.IsUnicodeText = true;
                            s.PutNextEntry(entry);
                            using (FileStream fs = System.IO.File.OpenRead(url))
                            {
                                int sourceBytes;
                                do
                                {
                                    sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                    s.Write(buffer, 0, sourceBytes);
                                } while (sourceBytes > 0);
                            }
                            //PDF
                            if (existe)
                            {
                                entry = new ZipEntry(tipo + "/" + Path.GetFileName(pathPDF));
                                entry.DateTime = DateTime.Now;
                                entry.IsUnicodeText = true;
                                s.PutNextEntry(entry);
                                using (FileStream fs = System.IO.File.OpenRead(pathPDF))
                                {
                                    int sourceBytes;
                                    do
                                    {
                                        sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                        s.Write(buffer, 0, sourceBytes);
                                    } while (sourceBytes > 0);
                                }
                            }
                        }


                        //PAGOS
                        if (tipo_comprobante == "P")
                        {
                            tipo += "/PAGOS";
                            //XML
                            entry = new ZipEntry(tipo + "/" + Path.GetFileName(url));
                            entry.DateTime = DateTime.Now;
                            entry.IsUnicodeText = true;
                            s.PutNextEntry(entry);
                            using (FileStream fs = System.IO.File.OpenRead(url))
                            {
                                int sourceBytes;
                                do
                                {
                                    sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                    s.Write(buffer, 0, sourceBytes);
                                } while (sourceBytes > 0);
                            }
                            //PDF
                            if (existe)
                            {
                                entry = new ZipEntry(tipo + "/" + Path.GetFileName(pathPDF));
                                entry.DateTime = DateTime.Now;
                                entry.IsUnicodeText = true;
                                s.PutNextEntry(entry);
                                using (FileStream fs = System.IO.File.OpenRead(pathPDF))
                                {
                                    int sourceBytes;
                                    do
                                    {
                                        sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                        s.Write(buffer, 0, sourceBytes);
                                    } while (sourceBytes > 0);
                                }
                            }
                        }


                        //NOTAS DE CREDITO
                        if (tipo_comprobante == "E")
                        {
                            tipo += "/NOTAS DE CREDITO";
                            //XML
                            entry = new ZipEntry(tipo + "/" + Path.GetFileName(url));
                            entry.DateTime = DateTime.Now;
                            entry.IsUnicodeText = true;
                            s.PutNextEntry(entry);
                            using (FileStream fs = System.IO.File.OpenRead(url))
                            {
                                int sourceBytes;
                                do
                                {
                                    sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                    s.Write(buffer, 0, sourceBytes);
                                } while (sourceBytes > 0);
                            }
                            //PDF
                            if (existe)
                            {
                                entry = new ZipEntry(tipo + "/" + Path.GetFileName(pathPDF));
                                entry.DateTime = DateTime.Now;
                                entry.IsUnicodeText = true;
                                s.PutNextEntry(entry);
                                using (FileStream fs = System.IO.File.OpenRead(pathPDF))
                                {
                                    int sourceBytes;
                                    do
                                    {
                                        sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                        s.Write(buffer, 0, sourceBytes);
                                    } while (sourceBytes > 0);
                                }
                            }
                        }

                    }
                    s.Finish();
                    s.Flush();
                    s.Close();
                }

                byte[] finalResult = System.IO.File.ReadAllBytes(tempOutPutPath);
                if (System.IO.File.Exists(tempOutPutPath))
                    System.IO.File.Delete(tempOutPutPath);

                if (finalResult == null || !finalResult.Any())
                    throw new Exception(String.Format("No se encontrarons archivos."));

                return File(finalResult, "application/zip", fileName);
            }
            return null;
        }
        #region FUNCIONES PRIVADAS
        private bool ValidarAccesoVista(string controlador, string vista)
        {
            DAL_Utils dAL_Utils = new DAL_Utils();
            dAL_Utils.p_Utils.controlador = controlador;
            dAL_Utils.p_Utils.vista = vista;

            if (!dAL_Utils.ValidarAccesoVista())
            {
                TempData["Error"] = dAL_Utils.result.msnError;
                TempData["ErrorComplete"] = dAL_Utils.result.msnErrorComplete;
                return false;
            }

            ViewBag.id_RV = dAL_Utils.result.resultStoredProcedure.msnSuccess;

            return true;
        }

        public string GetPermisos(int? id_RV)
        {
            DAL_Utils dAL_Utils = new DAL_Utils();
            dAL_Utils.p_Utils.id_RV = id_RV;
            dAL_Utils.GetPermisos();
            return dAL_Utils.result.returnToJsonString();
        }
        #endregion 
    }
}