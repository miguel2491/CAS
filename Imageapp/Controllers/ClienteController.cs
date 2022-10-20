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