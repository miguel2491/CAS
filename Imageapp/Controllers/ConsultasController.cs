using ICSharpCode.SharpZipLib.Zip;
using Imageapp.Models.DAL;
using Imageapp.Models.Utils;
using Newtonsoft.Json;
using OfficeOpenXml;
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
    public class ConsultasController : Controller
    {
        Result result = new Result();
        #region Clientes
        [SessionAuthorize]
        public ActionResult ListaClientesCorreo()
        {
            if (!ValidarAccesoVista("Consultas", "ListaClientesCorreo"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }



        [SessionAuthorize]
        public ActionResult ListaClientes()
        {
            if (!ValidarAccesoVista("Consultas", "ListaClientes"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetClientes(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetListaClientes(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult ConsultaRFC(string frs_id_cliente, string frs_rfc, string frs_nombre_razon, int frs_id_regimen, bool frs_es_asesoria, bool frs_aplica_coi)
        {
            if (!ValidarAccesoVista("Consultas", "ConsultaRFC"))
                return RedirectToAction("Inicio", "Inicio");

            ViewBag.id_cliente = frs_id_cliente;
            ViewBag.nombre_razon = frs_nombre_razon;
            ViewBag.rfc = frs_rfc;
            ViewBag.id_regimen = frs_id_regimen;
            ViewBag.es_asesoria = frs_es_asesoria;
            ViewBag.aplica_coi = frs_aplica_coi;
            return View();
        }

        public string GetConceptos(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetConceptos(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public string GetCliente(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetCliente(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        public FileResult DownloadZipFile(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetXMLZip(jsonJS);
            if (dAL_Clientes.result.status == 0 && dAL_Clientes.result.resultStoredProcedure.msnSuccess != null)
            {
                dynamic filtro = new ExpandoObject();
                dynamic data = new ExpandoObject();
                data = JsonConvert.DeserializeObject(dAL_Clientes.result.resultStoredProcedure.msnSuccess);
                filtro = JsonConvert.DeserializeObject(jsonJS);
                string fecha_inicio = filtro.fl_fecha_inicial;
                string fecha_fin = filtro.fl_fecha_final;
                string rfc = filtro.fl_rfc;
                var fileName = string.Format("{0}_{1}XML.zip", rfc, fecha_inicio.Split(' ')[0] + "_" + fecha_fin.Split(' ')[0]);
                //var tempOutPutPath = Server.MapPath(Url.Content("/Castelan/Documentos/TempZip/")) + fileName;
                var tempOutPutPath = Server.MapPath(Url.Content("/Documentos/TempZip/")) + fileName;


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
                        //NOTAS DE CREDITO
                        if (tipo_comprobante == "T")
                        {
                            tipo += "/TRASLADO";
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
                    throw new Exception(String.Format("No se encontraros archivos."));

                return File(finalResult, "application/zip", fileName);
            }
            return null;
        }


        public FileResult PlantillaCOI(string jsonJS, int? id_RV)
        {            
            var memoryStream = new MemoryStream();
            var excelPackage = new ExcelPackage(memoryStream);
            var worksheetEgresos = excelPackage.Workbook.Worksheets.Add("Pólizas");

            Int32 empieza = 2;
            
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetXMLEgresos(jsonJS);

            dynamic SuccessIngresos = JsonConvert.DeserializeObject(dAL_Clientes.result.returnToJsonString());

            Int32 estatus = Convert.ToInt32(SuccessIngresos.status);
            Int32 estatus_sp = Convert.ToInt32(SuccessIngresos.resultStoredProcedure.status);

            if (estatus == 0 && estatus_sp == 0)
            {
                dynamic ListaEgresos = new ExpandoObject();
                if (dAL_Clientes.result.resultStoredProcedure.msnSuccess != null)
                {
                    ListaEgresos = JsonConvert.DeserializeObject(dAL_Clientes.result.resultStoredProcedure.msnSuccess);

                    foreach (var item in ListaEgresos)
                    {                        
                        List<String> lista = new List<String> { "estatus", "tipo", "fecha", "fecha_timbrado", "seria",
                        "folio", "UUID", "RFCEmisor", "nombre_emisor", "usoCFDI", "subtotal", "descuento", "subtotal_neto", "impuesto_trasladado",
                        "retencion_iva", "retencion_isr", "total", "forma_pago", "metodo_pago", "conceptos", "fecha_pago"};

                        //! Egresos
                        worksheetEgresos.Cells[empieza, 1].Value = Convert.ToString("Tipo de póliza");
                        worksheetEgresos.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 2].Value = Convert.ToString("Num póliza");
                        worksheetEgresos.Cells[empieza, 2].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 2].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 3].Value = Convert.ToString("Concepto");
                        worksheetEgresos.Cells[empieza, 3].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 3].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 3].Value = Convert.ToString("Dia");
                        worksheetEgresos.Cells[empieza, 3].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 3].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;

                        empieza++;

                        worksheetEgresos.Cells[empieza, 1].Value = Convert.ToString("Eg");
                        worksheetEgresos.Cells[empieza, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 2].Value = Convert.ToString("0");
                        worksheetEgresos.Cells[empieza, 2].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                        worksheetEgresos.Cells[empieza, 2].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 3].Value = Convert.ToString(item["nombre_emisor"]);
                        worksheetEgresos.Cells[empieza, 3].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 3].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 3].Value = Convert.ToString("25");
                        worksheetEgresos.Cells[empieza, 3].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                        worksheetEgresos.Cells[empieza, 3].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;

                        empieza++;

                        worksheetEgresos.Cells[empieza, 2].Value = Convert.ToString("0000-000-000");
                        worksheetEgresos.Cells[empieza, 2].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 2].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 3].Value = Convert.ToString("0");
                        worksheetEgresos.Cells[empieza, 3].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                        worksheetEgresos.Cells[empieza, 3].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 4].Value = Convert.ToString(item["nombre_emisor"]);
                        worksheetEgresos.Cells[empieza, 4].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 4].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 5].Value = Convert.ToString(1);
                        worksheetEgresos.Cells[empieza, 5].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                        worksheetEgresos.Cells[empieza, 5].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 6].Value = Convert.ToDecimal(item["total"]);
                        worksheetEgresos.Cells[empieza, 6].Style.Numberformat.Format = "#,##0.00";
                        worksheetEgresos.Cells[empieza, 6].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                        worksheetEgresos.Cells[empieza, 6].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;

                        empieza++;

                        worksheetEgresos.Cells[empieza, 3].Value = Convert.ToString("INICIO_CFDI");
                        worksheetEgresos.Cells[empieza, 3].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 3].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;

                        empieza++;

                        worksheetEgresos.Cells[empieza, 3].Value = Convert.ToDateTime(item["fecha_timbrado"]).ToString("dd/MM/yyyy");
                        worksheetEgresos.Cells[empieza, 3].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                        worksheetEgresos.Cells[empieza, 3].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;

                        worksheetEgresos.Cells[empieza, 6].Value = Convert.ToString(item["RFCEmisor"]);
                        worksheetEgresos.Cells[empieza, 6].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 6].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 7].Value = Convert.ToString(item["RFCReceptor"]);
                        worksheetEgresos.Cells[empieza, 7].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 7].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 8].Value = Convert.ToString(item["total"]);
                        worksheetEgresos.Cells[empieza, 8].Style.Numberformat.Format = "#,##0.00";
                        worksheetEgresos.Cells[empieza, 8].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 8].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 9].Value = Convert.ToString(item["UUID"]);
                        worksheetEgresos.Cells[empieza, 9].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 9].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;

                        empieza++;

                        worksheetEgresos.Cells[empieza, 3].Value = Convert.ToString("FIN_CFDI");
                        worksheetEgresos.Cells[empieza, 3].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 3].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;

                        empieza++;

                        worksheetEgresos.Cells[empieza, 2].Value = Convert.ToString("0000-000-000");
                        worksheetEgresos.Cells[empieza, 2].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 2].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 3].Value = Convert.ToString("0");
                        worksheetEgresos.Cells[empieza, 3].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                        worksheetEgresos.Cells[empieza, 3].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 4].Value = Convert.ToString(item["nombre_emisor"]);
                        worksheetEgresos.Cells[empieza, 4].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 4].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 5].Value = Convert.ToString(1);
                        worksheetEgresos.Cells[empieza, 5].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                        worksheetEgresos.Cells[empieza, 5].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 6].Value = Convert.ToDecimal(item["impuesto_trasladado"]);
                        worksheetEgresos.Cells[empieza, 6].Style.Numberformat.Format = "#,##0.00";
                        worksheetEgresos.Cells[empieza, 6].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                        worksheetEgresos.Cells[empieza, 6].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;

                        empieza++;

                        worksheetEgresos.Cells[empieza, 2].Value = Convert.ToString("0000-000-000");
                        worksheetEgresos.Cells[empieza, 2].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 2].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 3].Value = Convert.ToString("0");
                        worksheetEgresos.Cells[empieza, 3].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                        worksheetEgresos.Cells[empieza, 3].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 4].Value = Convert.ToString(item["nombre_emisor"]);
                        worksheetEgresos.Cells[empieza, 4].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 4].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 5].Value = Convert.ToString(1);
                        worksheetEgresos.Cells[empieza, 5].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                        worksheetEgresos.Cells[empieza, 5].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 7].Value = Convert.ToDecimal(item["impuesto_trasladado"]);
                        worksheetEgresos.Cells[empieza, 7].Style.Numberformat.Format = "#,##0.00";
                        worksheetEgresos.Cells[empieza, 7].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                        worksheetEgresos.Cells[empieza, 7].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;

                        empieza++;

                        worksheetEgresos.Cells[empieza, 2].Value = Convert.ToString("0000-000-000");
                        worksheetEgresos.Cells[empieza, 2].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 2].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 3].Value = Convert.ToString("0");
                        worksheetEgresos.Cells[empieza, 3].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                        worksheetEgresos.Cells[empieza, 3].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 4].Value = Convert.ToString(item["nombre_emisor"]);
                        worksheetEgresos.Cells[empieza, 4].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 4].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 5].Value = Convert.ToString(1);
                        worksheetEgresos.Cells[empieza, 5].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                        worksheetEgresos.Cells[empieza, 5].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                        worksheetEgresos.Cells[empieza, 7].Value = Convert.ToDecimal(item["total"]);
                        worksheetEgresos.Cells[empieza, 7].Style.Numberformat.Format = "#,##0.00";
                        worksheetEgresos.Cells[empieza, 7].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                        worksheetEgresos.Cells[empieza, 7].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;

                        empieza++;

                        worksheetEgresos.Cells[empieza, 2].Value = Convert.ToString("FIN_PARTIDAS");
                        worksheetEgresos.Cells[empieza, 2].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        worksheetEgresos.Cells[empieza, 2].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;

                        empieza++;
                        empieza++;
                    }


                }

            }

            var FileBytesArray = excelPackage.GetAsByteArray();

            return File(FileBytesArray, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Polizas.xlsx");

        }

        #endregion

        [SessionAuthorize]
        public ActionResult XMLCancelados()
        {
            if (!ValidarAccesoVista("Consultas", "XMLCancelados"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
        }

        public string GetXMLCancelados(string jsonJS, int? id_RV)
        {
            DAL_Clientes dAL_Clientes = new DAL_Clientes();
            dAL_Clientes.p_Clientes.id_RV = id_RV;
            dAL_Clientes.GetXMLCancelados(jsonJS);
            return dAL_Clientes.result.returnToJsonString();
        }

        [SessionAuthorize]
        public ActionResult ReporteFiel()
        {
            if (!ValidarAccesoVista("Consultas", "ReporteFiel"))
                return RedirectToAction("Inicio", "Inicio");

            return View();
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

        public string GetCatalogos(string jsonJS)
        {
            DAL_Utils dAL_Utils = new DAL_Utils();
            dAL_Utils.GetCatalogos(jsonJS);
            return dAL_Utils.result.returnToJsonString();
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