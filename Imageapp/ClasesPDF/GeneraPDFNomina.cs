using System;
using System.IO;
using System.Text;
using System.Data;
using System.Xml;
using System.Configuration;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.Globalization;
//using System.Windows.Forms;
using System.Collections;
using System.Xml.Linq;
using System.Linq;
using sat_ws;

namespace sat_ws
{
    class GeneraPDFNomina
    {
        //private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private static CultureInfo _ci;
        private static CultureInfo _ci2;
        public static iTextSharp.text.Image Logo;// = Image.GetInstance("C:\\XML\\Logotipo.png");
        public static bool _esvistaPrevia = false;

        /// <summary>
        /// Metodo encargado de generar la representación impresa en formato PDF
        /// </summary>
        /// <param name="rutaArchivoADescomprimir">Ruta del archivo a descomprimir</param>
        /// <param name="rutaArchivoDescomprimido">Ruta donde se guardara el archivo descomprimido</param>
        /// <returns>Boleano que indica si el proceso se ejecuto correctamente</returns>
        public static MemoryStream GeneraRepresentacionImpresa(string RutaPDF, CFDINominaObject oCFDINomina, Hashtable HTPercepciones, Hashtable HTDeducciones, string VersionNomina)
        {
            Logo = Image.GetInstance("C:\\XML\\Logotipo.png");
            var BoldFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10);
            var BoldFontBlank = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.WHITE);
            var BoldFontBlankBlue = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLUE);

            var Font10 = FontFactory.GetFont(FontFactory.HELVETICA, 10);
            var BoldFont10 = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10);
            var BoldFont8 = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 8);
            var Font8 = FontFactory.GetFont(FontFactory.HELVETICA, 8);


            using (MemoryStream ms = new MemoryStream())
            {

                Document document = new Document(PageSize.LETTER, 25, 25, 25, 60);
                document.AddAuthor("Facturación Electrónica");
                document.AddCreator("Aldo Córdova Mendoza");
                document.AddTitle("Representación Impresa CFDI");
                document.AddCreationDate();

                PdfWriter.GetInstance(document, new FileStream(RutaPDF.Replace(".pdf.pdf", ".pdf"), FileMode.Create));

                PdfWriter writer = PdfWriter.GetInstance(document, ms);
                pdfPageEventHandlerNomina pageEventHandler = new pdfPageEventHandlerNomina();

                writer.CloseStream = false;
                writer.SetFullCompression();
                writer.ViewerPreferences = PdfWriter.PageModeUseNone;
                writer.PageEvent = pageEventHandler;
                writer.SetPdfVersion(PdfWriter.PDF_VERSION_1_7);
                document.Open();

                PdfPTable table = new PdfPTable(2);
                float[] widths = new float[] { 240f, 240f};
                //table.LockedWidth = true;
                table.SetWidths(widths);
                table.WidthPercentage = 100f;

                Logo.ScaleToFit(200f, 120f);
                Logo.SetAbsolutePosition(20, 690);

                PdfPCell vCellLogo = new PdfPCell(Logo);
                vCellLogo.BorderColor = new iTextSharp.text.BaseColor(255, 255, 255);
                vCellLogo.Rowspan = 8;
                table.CompleteRow();
                table.AddCell(vCellLogo);

                table.DefaultCell.Border = PdfPCell.NO_BORDER;
                table.AddCell(new Phrase(new Chunk("Folio Fiscal: " + oCFDINomina.UUID.ToUpper(), BoldFont)));
                table.AddCell(new Phrase(new Chunk("Lugar Expedicion: " + oCFDINomina.LugarExpedicion, BoldFont)));
                table.AddCell(new Phrase(new Chunk("Fecha Expedicion: " + oCFDINomina.FechaGeneracion, BoldFont)));
                table.AddCell(new Phrase(new Chunk("Efecto del Comprobante: " + oCFDINomina.EfectoComprobante, BoldFont)));
                table.AddCell(new Phrase(new Chunk("Regimen Fiscal: " + oCFDINomina.RegimenFiscalEmsior, BoldFont)));
                table.AddCell(new Phrase(new Chunk("Serie: " + oCFDINomina.Serie, BoldFont)));
                table.AddCell(new Phrase(new Chunk("Folio: " + oCFDINomina.Folio, BoldFont)));
                string EtiquetaNómina = "";
                if(VersionNomina.Length > 0) EtiquetaNómina = "- Versión Nómina: " + VersionNomina;
                table.AddCell(new Phrase(new Chunk("Version CFDI: " + oCFDINomina.Version + EtiquetaNómina , BoldFont)));
                table.AddCell(new Phrase(" ")); 
                document.Add(table);

                document.Add(Chunk.NEWLINE);
                document.Add(Chunk.NEWLINE);

                PdfPTable TableEmiRec = new PdfPTable(2);
                float[] widths2 = new float[] { 300f, 300f};
                TableEmiRec.SetWidths(widths2);
                TableEmiRec.WidthPercentage = 100f;
                TableEmiRec.DefaultCell.Border = PdfPCell.NO_BORDER;
                TableEmiRec.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                TableEmiRec.AddCell(new Phrase(new Chunk("RFC Emisor: " + oCFDINomina.RfcEmisor, BoldFont)));    
                TableEmiRec.AddCell(new Phrase(new Chunk("RFC Receptor: " + oCFDINomina.RfcReceptor, BoldFont)));
                TableEmiRec.AddCell(new Phrase(new Chunk("Nombre Emisor: " + oCFDINomina.NombreEmisor, BoldFont)));
                TableEmiRec.AddCell(new Phrase(new Chunk("Nombre Receptor: " + oCFDINomina.NombreReceptor, BoldFont)));
                TableEmiRec.AddCell(new Phrase(" "));
                TableEmiRec.AddCell(new Phrase(" "));

                document.Add(TableEmiRec);

                PdfPTable TableConceptos = new PdfPTable(6);
                float[] widths3 = new float[] { 300f, 100f, 100f, 100f, 100f, 100f };
                TableConceptos.SetWidths(widths3);
                TableConceptos.WidthPercentage = 100f;
                TableConceptos.DefaultCell.Border = PdfPCell.NO_BORDER;

                string ColorPlantilla = LeerAtributoConfiguracionXML("ColorPlantillaPDF");
                string[] ColoresPlantilla = ColorPlantilla.Split(',');

                TableConceptos.DefaultCell.BackgroundColor = new iTextSharp.text.BaseColor(Convert.ToInt16(ColoresPlantilla[0]), Convert.ToInt16(ColoresPlantilla[1]), Convert.ToInt16(ColoresPlantilla[2]));


                TableConceptos.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;

                TableConceptos.AddCell(new Phrase(new Chunk("DESCRIPCION: ", BoldFontBlank)));

                
                TableConceptos.AddCell(new Phrase(new Chunk("CLAVE PRODUCTO", BoldFontBlank)));

                TableConceptos.AddCell(new Phrase(new Chunk("UNI MED", BoldFontBlank)));

                TableConceptos.AddCell(new Phrase(new Chunk("CANTIDAD", BoldFontBlank)));

                TableConceptos.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                TableConceptos.AddCell(new Phrase(new Chunk("VALOR UNITARIO", BoldFontBlank)));

                TableConceptos.AddCell(new Phrase(new Chunk("IMPORTE", BoldFontBlank)));



                TableConceptos.DefaultCell.BackgroundColor = new iTextSharp.text.BaseColor(255, 255, 255);

                TableConceptos.AddCell(new Phrase(" "));
                TableConceptos.AddCell(new Phrase(" "));
                TableConceptos.AddCell(new Phrase(" "));
                TableConceptos.AddCell(new Phrase(" "));
                TableConceptos.AddCell(new Phrase(" "));
                TableConceptos.AddCell(new Phrase(" "));

                

                //Emisor
                int a = 0;
                foreach (DataRow dato in oCFDINomina.Conceptos.Rows)
                {
                    if (IsOdd(a))
                    {
                        TableConceptos.DefaultCell.BackgroundColor = new iTextSharp.text.BaseColor(255, 255, 255);
                    }
                    else
                    {
                        TableConceptos.DefaultCell.BackgroundColor = new iTextSharp.text.BaseColor(240, 240, 240);
                    }

                    TableConceptos.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                    TableConceptos.AddCell(new Phrase(new Chunk(dato["Descripcion"].ToString(), Font10)));
                    try
                    {
                        TableConceptos.AddCell(new Phrase(new Chunk(dato["ClaveProdServ"].ToString(), Font10)));
                    }
                    catch (Exception)
                    { }
                    TableConceptos.AddCell(new Phrase(new Chunk(dato["ClaveUnidad"].ToString(), Font10)));
                    TableConceptos.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;
                    TableConceptos.AddCell(new Phrase(new Chunk(dato["Cantidad"].ToString(), Font10)));
                    TableConceptos.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                    TableConceptos.AddCell(new Phrase(new Chunk("$ " + dato["ValorUnitario"].ToString(), Font10)));
                    TableConceptos.AddCell(new Phrase(new Chunk("$ " + dato["Importe"].ToString(), Font10)));


                    a = a + 1;
                }                
                document.Add(TableConceptos);

                //Si la variable VersionNomina es mayor a 0 quiere decir que es un comprobante con complemento de nómina, por lo tanto agregamos los segmentos a la representación impresa

                if(oCFDINomina.FechaPago.Length == 0)
                {
                    VersionNomina = "";
                }

                if (VersionNomina.Length > 0)
                {
                    
                    
                    PdfPTable TableNominaMaestro = new PdfPTable(8);
                    float[] widthsNomMaestro = new float[] { 90f, 50f, 100f, 100f, 100f, 90f, 90f, 90f };
                    TableNominaMaestro.SetWidths(widthsNomMaestro);
                    TableNominaMaestro.WidthPercentage = 100f;
                    TableNominaMaestro.DefaultCell.Border = PdfPCell.NO_BORDER;

                    TableNominaMaestro.AddCell(new Phrase(" "));
                    TableNominaMaestro.AddCell(new Phrase(" "));
                    TableNominaMaestro.AddCell(new Phrase(" "));
                    TableNominaMaestro.AddCell(new Phrase(" "));
                    TableNominaMaestro.AddCell(new Phrase(" "));
                    TableNominaMaestro.AddCell(new Phrase(" "));
                    TableNominaMaestro.AddCell(new Phrase(" "));
                    TableNominaMaestro.AddCell(new Phrase(" "));

                    TableNominaMaestro.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                    TableNominaMaestro.AddCell(new Phrase(new Chunk("Perioricidad", BoldFont8)));
                    TableNominaMaestro.AddCell(new Phrase(new Chunk("Banco", BoldFont8)));
                    TableNominaMaestro.AddCell(new Phrase(new Chunk("Cuenta bancaria", BoldFont8)));
                    TableNominaMaestro.AddCell(new Phrase(new Chunk("Salario integrado", BoldFont8)));
                    TableNominaMaestro.AddCell(new Phrase(new Chunk("Fecha de pago", BoldFont8)));
                    TableNominaMaestro.AddCell(new Phrase(new Chunk("Días pagados", BoldFont8)));
                    TableNominaMaestro.AddCell(new Phrase(new Chunk("Fecha inicio", BoldFont8)));
                    TableNominaMaestro.AddCell(new Phrase(new Chunk("Fecha fin", BoldFont8)));

                    TableNominaMaestro.AddCell(new Phrase(new Chunk(oCFDINomina.PeriodicidadPago, Font8)));
                    TableNominaMaestro.AddCell(new Phrase(new Chunk(oCFDINomina.Banco, Font8)));
                    TableNominaMaestro.AddCell(new Phrase(new Chunk(oCFDINomina.CuentaBancaria, Font8)));
                    TableNominaMaestro.AddCell(new Phrase(new Chunk("$ " + oCFDINomina.SalarioDiarioIntegrado, Font8)));
                    TableNominaMaestro.AddCell(new Phrase(new Chunk(String.Format("{0:MM/dd/yyyy}", Convert.ToDateTime(oCFDINomina.FechaPago)), Font8)));
                    TableNominaMaestro.AddCell(new Phrase(new Chunk(oCFDINomina.NumDiasPagados, Font8)));
                    TableNominaMaestro.AddCell(new Phrase(new Chunk(String.Format("{0:MM/dd/yyyy}", Convert.ToDateTime(oCFDINomina.FechaInicialPago)), Font8)));
                    TableNominaMaestro.AddCell(new Phrase(new Chunk(String.Format("{0:MM/dd/yyyy}", Convert.ToDateTime(oCFDINomina.FechaFinalPago)), Font8)));


                    TableNominaMaestro.AddCell(new Phrase(" "));
                    TableNominaMaestro.AddCell(new Phrase(" "));
                    TableNominaMaestro.AddCell(new Phrase(" "));
                    TableNominaMaestro.AddCell(new Phrase(" "));
                    TableNominaMaestro.AddCell(new Phrase(" "));
                    TableNominaMaestro.AddCell(new Phrase(" "));
                    TableNominaMaestro.AddCell(new Phrase(" "));
                    TableNominaMaestro.AddCell(new Phrase(" "));

                    document.Add(TableNominaMaestro);

                    //DETALLE DE PERCEPCIONES
                    PdfPTable TableNominaPercepcionesTitulo = new PdfPTable(1);
                    TableNominaPercepcionesTitulo.DefaultCell.BackgroundColor = new iTextSharp.text.BaseColor(Convert.ToInt16(ColoresPlantilla[0]), Convert.ToInt16(ColoresPlantilla[1]), Convert.ToInt16(ColoresPlantilla[2]));
                    float[] widthsNomMaestroPercepcionesTitulo = new float[] { 400f };
                    TableNominaPercepcionesTitulo.SetWidths(widthsNomMaestroPercepcionesTitulo);
                    TableNominaPercepcionesTitulo.WidthPercentage = 100f;
                    TableNominaPercepcionesTitulo.DefaultCell.Border = PdfPCell.NO_BORDER;

                    TableNominaPercepcionesTitulo.AddCell(new Phrase(new Chunk("DETALLE DE PERCEPCIONES", BoldFontBlank)));
                    document.Add(TableNominaPercepcionesTitulo);

                    PdfPTable TableNominaPercepciones = new PdfPTable(5);
                    float[] widthsNomPercepciones = new float[] { 160f, 100f, 100f, 100f, 100f };
                    TableNominaPercepciones.SetWidths(widthsNomPercepciones);
                    TableNominaPercepciones.WidthPercentage = 100f;
                    TableNominaPercepciones.DefaultCell.Border = PdfPCell.NO_BORDER;


                    TableNominaPercepciones.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                    TableNominaPercepciones.AddCell(new Phrase(new Chunk("Concepto", BoldFont8)));
                    TableNominaPercepciones.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                    TableNominaPercepciones.AddCell(new Phrase(new Chunk("Tipo", BoldFont8)));
                    TableNominaPercepciones.AddCell(new Phrase(new Chunk("Exento", BoldFont8)));
                    TableNominaPercepciones.AddCell(new Phrase(new Chunk("Gravado", BoldFont8)));
                    TableNominaPercepciones.AddCell(new Phrase(new Chunk("Total", BoldFont8)));
                    string TipoPercepcion = "";
                    for (int y = 1; y <= 39; y++)
                    {
                        if (y < 10)
                            TipoPercepcion = "00" + y.ToString();
                        else
                            TipoPercepcion = "0" + y.ToString();

                        if (Convert.ToDecimal(HTPercepciones[y + "-G"].ToString()) > 0 || Convert.ToDecimal(HTPercepciones[y + "-E"].ToString()) > 0 || Convert.ToDecimal(HTPercepciones[y + "-T"].ToString()) > 0)
                        {
                            TableNominaPercepciones.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                            TableNominaPercepciones.AddCell(new Phrase(new Chunk(HTPercepciones[y + "-C"].ToString(), Font8)));
                            TableNominaPercepciones.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                            TableNominaPercepciones.AddCell(new Phrase(new Chunk(TipoPercepcion, Font8)));
                            TableNominaPercepciones.AddCell(new Phrase(new Chunk("$ " + HTPercepciones[y + "-G"].ToString(), Font8)));
                            TableNominaPercepciones.AddCell(new Phrase(new Chunk("$ " + HTPercepciones[y + "-E"].ToString(), Font8)));
                            TableNominaPercepciones.AddCell(new Phrase(new Chunk("$ " + HTPercepciones[y + "-T"].ToString(), Font8)));
                        }
                    }

                    TableNominaPercepciones.AddCell(new Phrase(" "));
                    TableNominaPercepciones.AddCell(new Phrase(" "));
                    TableNominaPercepciones.AddCell(new Phrase(" "));
                    TableNominaPercepciones.AddCell(new Phrase(" "));
                    TableNominaPercepciones.AddCell(new Phrase(" "));

                    document.Add(TableNominaPercepciones);


                    if (VersionNomina == "1.1")
                    {
                        //DETALLE DE DEDUCCIONES
                        PdfPTable TableNominaDeduccionesTitulo = new PdfPTable(1);
                        TableNominaDeduccionesTitulo.DefaultCell.BackgroundColor = new iTextSharp.text.BaseColor(Convert.ToInt16(ColoresPlantilla[0]), Convert.ToInt16(ColoresPlantilla[1]), Convert.ToInt16(ColoresPlantilla[2]));
                        float[] widthsNomMaestroDeducionesTitulo = new float[] { 400f };
                        TableNominaDeduccionesTitulo.SetWidths(widthsNomMaestroDeducionesTitulo);
                        TableNominaDeduccionesTitulo.WidthPercentage = 100f;
                        TableNominaDeduccionesTitulo.DefaultCell.Border = PdfPCell.NO_BORDER;

                        TableNominaDeduccionesTitulo.AddCell(new Phrase(new Chunk("DETALLE DE DEDUCCIONES", BoldFontBlank)));
                        document.Add(TableNominaDeduccionesTitulo);

                        PdfPTable TableNominaDeducciones = new PdfPTable(5);
                        float[] widthsNomDeducciones = new float[] { 160f, 100f, 100f, 100f, 100f };
                        TableNominaDeducciones.SetWidths(widthsNomDeducciones);
                        TableNominaDeducciones.WidthPercentage = 100f;
                        TableNominaDeducciones.DefaultCell.Border = PdfPCell.NO_BORDER;

                        TableNominaDeducciones.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                        TableNominaDeducciones.AddCell(new Phrase(new Chunk("Concepto", BoldFont8)));
                        TableNominaDeducciones.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                        TableNominaDeducciones.AddCell(new Phrase(new Chunk("Tipo", BoldFont8)));
                        TableNominaDeducciones.AddCell(new Phrase(new Chunk("Exento", BoldFont8)));
                        TableNominaDeducciones.AddCell(new Phrase(new Chunk("Gravado", BoldFont8)));
                        TableNominaDeducciones.AddCell(new Phrase(new Chunk("Total", BoldFont8)));
                        string TipoDeduccion = "";
                        for (int z = 1; z <= 21; z++)
                        {
                            if (z < 10)
                                TipoDeduccion = "00" + z.ToString();
                            else
                                TipoDeduccion = "0" + z.ToString();
                            try
                            {
                                if (Convert.ToDecimal(HTDeducciones[z + "-G"].ToString()) > 0 || Convert.ToDecimal(HTDeducciones[z + "-E"].ToString()) > 0 || Convert.ToDecimal(HTDeducciones[z + "-T"].ToString()) > 0)
                                {
                                    TableNominaDeducciones.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                                    TableNominaDeducciones.AddCell(new Phrase(new Chunk(HTDeducciones[z + "-C"].ToString(), Font8)));
                                    TableNominaDeducciones.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                                    TableNominaDeducciones.AddCell(new Phrase(new Chunk(TipoDeduccion, Font8)));
                                    TableNominaDeducciones.AddCell(new Phrase(new Chunk("$ " + HTDeducciones[z + "-G"].ToString(), Font8)));
                                    TableNominaDeducciones.AddCell(new Phrase(new Chunk("$ " + HTDeducciones[z + "-E"].ToString(), Font8)));
                                    TableNominaDeducciones.AddCell(new Phrase(new Chunk("$ " + HTDeducciones[z + "-T"].ToString(), Font8)));
                                }
                            }
                            catch (Exception ex)
                            {
                                //log.Error("Message: " + ex.Message + "######### StackTrace: " + ex.StackTrace.ToString());   
                            }
                        }

                        TableNominaDeducciones.AddCell(new Phrase(" "));
                        TableNominaDeducciones.AddCell(new Phrase(" "));
                        TableNominaDeducciones.AddCell(new Phrase(" "));
                        TableNominaDeducciones.AddCell(new Phrase(" "));
                        TableNominaDeducciones.AddCell(new Phrase(" "));
                        document.Add(TableNominaDeducciones);
                    }
                    else if (VersionNomina == "1.2")
                    {
                        //DETALLE DE DEDUCCIONES
                        PdfPTable TableNominaDeduccionesTitulo = new PdfPTable(1);
                        TableNominaDeduccionesTitulo.DefaultCell.BackgroundColor = new iTextSharp.text.BaseColor(Convert.ToInt16(ColoresPlantilla[0]), Convert.ToInt16(ColoresPlantilla[1]), Convert.ToInt16(ColoresPlantilla[2]));
                        float[] widthsNomMaestroDeducionesTitulo = new float[] { 400f };
                        TableNominaDeduccionesTitulo.SetWidths(widthsNomMaestroDeducionesTitulo);
                        TableNominaDeduccionesTitulo.WidthPercentage = 100f;
                        TableNominaDeduccionesTitulo.DefaultCell.Border = PdfPCell.NO_BORDER;

                        TableNominaDeduccionesTitulo.AddCell(new Phrase(new Chunk("DETALLE DE DEDUCCIONES", BoldFontBlank)));
                        document.Add(TableNominaDeduccionesTitulo);

                        PdfPTable TableNominaDeducciones = new PdfPTable(5);
                        float[] widthsNomDeducciones = new float[] { 160f, 100f, 100f, 100f, 100f };
                        TableNominaDeducciones.SetWidths(widthsNomDeducciones);
                        TableNominaDeducciones.WidthPercentage = 100f;
                        TableNominaDeducciones.DefaultCell.Border = PdfPCell.NO_BORDER;

                        TableNominaDeducciones.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                        TableNominaDeducciones.AddCell(new Phrase(new Chunk("Concepto", BoldFont8)));
                        TableNominaDeducciones.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                        TableNominaDeducciones.AddCell(new Phrase(new Chunk("Tipo", BoldFont8)));
                        TableNominaDeducciones.AddCell(new Phrase(new Chunk("", BoldFont8)));
                        TableNominaDeducciones.AddCell(new Phrase(new Chunk("", BoldFont8)));
                        TableNominaDeducciones.AddCell(new Phrase(new Chunk("Importe", BoldFont8)));
                        string TipoDeduccion = "";
                        for (int z = 1; z <= 21; z++)
                        {
                            if (z < 10)
                                TipoDeduccion = "00" + z.ToString();
                            else
                                TipoDeduccion = "0" + z.ToString();
                            try
                            {
                                if (Convert.ToDecimal(HTDeducciones["" + z + ""].ToString().Split('&')[0]) > 0)
                                {
                                    TableNominaDeducciones.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                                    TableNominaDeducciones.AddCell(new Phrase(new Chunk(HTDeducciones["" + z + ""].ToString().Split('&')[1].ToString(), Font8)));
                                    TableNominaDeducciones.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                                    TableNominaDeducciones.AddCell(new Phrase(new Chunk(TipoDeduccion, Font8)));
                                    TableNominaDeducciones.AddCell(new Phrase(new Chunk("", BoldFont8)));
                                    TableNominaDeducciones.AddCell(new Phrase(new Chunk("", BoldFont8)));
                                    TableNominaDeducciones.AddCell(new Phrase(new Chunk("$ " + HTDeducciones["" + z + ""].ToString().Split('&')[0].ToString(), Font8)));
                                }
                            }
                            catch (Exception ex)
                            {
                                //log.Error("Message: " + ex.Message + "######### StackTrace: " + ex.StackTrace.ToString());
                            }

                        }

                        TableNominaDeducciones.AddCell(new Phrase(" "));
                        TableNominaDeducciones.AddCell(new Phrase(" "));
                        TableNominaDeducciones.AddCell(new Phrase(" "));
                        TableNominaDeducciones.AddCell(new Phrase(" "));
                        TableNominaDeducciones.AddCell(new Phrase(" "));

                        document.Add(TableNominaDeducciones);
                    }


                    //DETALLE DE HORAS EXTRA
                    PdfPTable TableNominaHorasExtraTitulo = new PdfPTable(1);
                    TableNominaHorasExtraTitulo.DefaultCell.BackgroundColor = new iTextSharp.text.BaseColor(Convert.ToInt16(ColoresPlantilla[0]), Convert.ToInt16(ColoresPlantilla[1]), Convert.ToInt16(ColoresPlantilla[2]));
                    float[] widthsNomMaestroHorasExtraTitulo = new float[] { 400f };
                    TableNominaHorasExtraTitulo.SetWidths(widthsNomMaestroHorasExtraTitulo);
                    TableNominaHorasExtraTitulo.WidthPercentage = 100f;
                    TableNominaHorasExtraTitulo.DefaultCell.Border = PdfPCell.NO_BORDER;

                    TableNominaHorasExtraTitulo.AddCell(new Phrase(new Chunk("DETALLE DE HORAS EXTRA", BoldFontBlank)));
                    document.Add(TableNominaHorasExtraTitulo);

                    PdfPTable TableNominaHorasExtra = new PdfPTable(4);
                    float[] widthsNomHorasExtra = new float[] { 100f, 100f, 100f, 100f };
                    TableNominaHorasExtra.SetWidths(widthsNomHorasExtra);
                    TableNominaHorasExtra.WidthPercentage = 100f;
                    TableNominaHorasExtra.DefaultCell.Border = PdfPCell.NO_BORDER;

                    TableNominaHorasExtra.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                    TableNominaHorasExtra.AddCell(new Phrase(new Chunk("Días", BoldFont8)));
                    TableNominaHorasExtra.AddCell(new Phrase(new Chunk("Tipo de Horas", BoldFont8)));
                    TableNominaHorasExtra.AddCell(new Phrase(new Chunk("Horas Extra", BoldFont8)));
                    TableNominaHorasExtra.AddCell(new Phrase(new Chunk("Importe Pagado", BoldFont8)));

                    if (oCFDINomina.Dias.Length == 0)
                        oCFDINomina.Dias = "-";
                    if (oCFDINomina.TipoHoras.Length == 0)
                        oCFDINomina.TipoHoras = "-";
                    if (oCFDINomina.HorasExtra.Length == 0)
                        oCFDINomina.HorasExtra = "-";
                    if (oCFDINomina.ImportePagado.Length == 0)
                        oCFDINomina.ImportePagado = "-";
                    else
                        oCFDINomina.ImportePagado = "$ " + oCFDINomina.ImportePagado;

                    TableNominaHorasExtra.AddCell(new Phrase(new Chunk(oCFDINomina.Dias, Font8)));
                    TableNominaHorasExtra.AddCell(new Phrase(new Chunk(oCFDINomina.TipoHoras, Font8)));
                    TableNominaHorasExtra.AddCell(new Phrase(new Chunk(oCFDINomina.HorasExtra, Font8)));
                    TableNominaHorasExtra.AddCell(new Phrase(new Chunk(oCFDINomina.ImportePagado, Font8)));

                    TableNominaHorasExtra.AddCell(new Phrase(" "));
                    TableNominaHorasExtra.AddCell(new Phrase(" "));
                    TableNominaHorasExtra.AddCell(new Phrase(" "));
                    TableNominaHorasExtra.AddCell(new Phrase(" "));

                    document.Add(TableNominaHorasExtra);


                    //DETALLE DE INCAPACIDADES
                    PdfPTable TableNominaIncapacidadesTitulo = new PdfPTable(1);
                    TableNominaIncapacidadesTitulo.DefaultCell.BackgroundColor = new iTextSharp.text.BaseColor(Convert.ToInt16(ColoresPlantilla[0]), Convert.ToInt16(ColoresPlantilla[1]), Convert.ToInt16(ColoresPlantilla[2]));
                    float[] widthsNomMaestroIncapacidadesTitulo = new float[] { 400f };
                    TableNominaIncapacidadesTitulo.SetWidths(widthsNomMaestroIncapacidadesTitulo);
                    TableNominaIncapacidadesTitulo.WidthPercentage = 100f;
                    TableNominaIncapacidadesTitulo.DefaultCell.Border = PdfPCell.NO_BORDER;

                    TableNominaIncapacidadesTitulo.AddCell(new Phrase(new Chunk("DETALLE INCAPACIDADES", BoldFontBlank)));
                    document.Add(TableNominaIncapacidadesTitulo);

                    PdfPTable TableNominaIncapacidades = new PdfPTable(4);
                    float[] widthsNomIncapacidades = new float[] { 100f, 100f, 100f, 100f };
                    TableNominaHorasExtra.SetWidths(widthsNomHorasExtra);
                    TableNominaIncapacidades.WidthPercentage = 100f;
                    TableNominaIncapacidades.DefaultCell.Border = PdfPCell.NO_BORDER;

                    TableNominaIncapacidades.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                    TableNominaIncapacidades.AddCell(new Phrase(new Chunk("Días", BoldFont8)));
                    TableNominaIncapacidades.AddCell(new Phrase(new Chunk("Tipo Incapacidades", BoldFont8)));
                    TableNominaIncapacidades.AddCell(new Phrase(new Chunk("", BoldFont8)));
                    TableNominaIncapacidades.AddCell(new Phrase(new Chunk("Importe", BoldFont8)));


                    if (oCFDINomina.DiasIncapacidad.Length == 0)
                        oCFDINomina.DiasIncapacidad = "-";
                    if (oCFDINomina.TipoIncapacidad.Length == 0)
                        oCFDINomina.TipoIncapacidad = "-";
                    if (oCFDINomina.ImporteMonetario.Length == 0)
                        oCFDINomina.ImporteMonetario = "-";
                    else
                        oCFDINomina.ImporteMonetario = "$ " + oCFDINomina.ImporteMonetario;

                    TableNominaIncapacidades.AddCell(new Phrase(new Chunk(oCFDINomina.DiasIncapacidad, Font8)));
                    TableNominaIncapacidades.AddCell(new Phrase(new Chunk(oCFDINomina.TipoIncapacidad, Font8)));
                    TableNominaIncapacidades.AddCell(new Phrase(new Chunk("", Font8)));
                    TableNominaIncapacidades.AddCell(new Phrase(new Chunk(oCFDINomina.ImporteMonetario, Font8)));

                    TableNominaIncapacidades.AddCell(new Phrase(" "));
                    TableNominaIncapacidades.AddCell(new Phrase(" "));
                    TableNominaIncapacidades.AddCell(new Phrase(" "));
                    TableNominaIncapacidades.AddCell(new Phrase(" "));

                    document.Add(TableNominaIncapacidades);


                    //DETALLE DE SEPARACIÓN
                    PdfPTable TableNominaSeparacionTitulo = new PdfPTable(1);
                    TableNominaSeparacionTitulo.DefaultCell.BackgroundColor = new iTextSharp.text.BaseColor(Convert.ToInt16(ColoresPlantilla[0]), Convert.ToInt16(ColoresPlantilla[1]), Convert.ToInt16(ColoresPlantilla[2]));
                    float[] widthsNomMaestroSeparacionTitulo = new float[] { 400f };
                    TableNominaSeparacionTitulo.SetWidths(widthsNomMaestroSeparacionTitulo);
                    TableNominaSeparacionTitulo.WidthPercentage = 100f;
                    TableNominaSeparacionTitulo.DefaultCell.Border = PdfPCell.NO_BORDER;

                    TableNominaSeparacionTitulo.AddCell(new Phrase(new Chunk("DETALLE DE SEPARACIÓN - INDEMNIZACIÓN", BoldFontBlank)));
                    document.Add(TableNominaSeparacionTitulo);

                    PdfPTable TableNominaSeparacion = new PdfPTable(5);
                    float[] widthsNomSeparacion = new float[] { 100f, 100f, 100f, 100f, 100f };
                    TableNominaSeparacion.SetWidths(widthsNomSeparacion);
                    TableNominaSeparacion.WidthPercentage = 100f;
                    TableNominaSeparacion.DefaultCell.Border = PdfPCell.NO_BORDER;

                    TableNominaSeparacion.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                    TableNominaSeparacion.AddCell(new Phrase(new Chunk("Total Pagado", BoldFont8)));
                    TableNominaSeparacion.AddCell(new Phrase(new Chunk("Número Años Servicio", BoldFont8)));
                    TableNominaSeparacion.AddCell(new Phrase(new Chunk("Ultimo Sueldo Mens Ord", BoldFont8)));
                    TableNominaSeparacion.AddCell(new Phrase(new Chunk("Ingreso Acumulable", BoldFont8)));
                    TableNominaSeparacion.AddCell(new Phrase(new Chunk("Ingreso No Acumulable", BoldFont8)));

                    if (oCFDINomina.IndemnizacionTotalPagado.Length == 0)
                        oCFDINomina.IndemnizacionTotalPagado = "-";
                    if (oCFDINomina.IndemnizacionNumAñosServicio.Length == 0)
                        oCFDINomina.IndemnizacionNumAñosServicio = "-";
                    if (oCFDINomina.IndemnizacionUltimoSueldoMensOrd.Length == 0)
                        oCFDINomina.IndemnizacionUltimoSueldoMensOrd = "-";
                    if (oCFDINomina.IndemnizacionIngresoAcumulable.Length == 0)
                        oCFDINomina.IndemnizacionIngresoAcumulable = "-";
                    else
                        oCFDINomina.IndemnizacionIngresoAcumulable = "$ " + oCFDINomina.IndemnizacionIngresoAcumulable;
                    if (oCFDINomina.IndemnizacionIngresoNoAcumulable.Length == 0)
                        oCFDINomina.IndemnizacionIngresoNoAcumulable = "-";
                    else
                        oCFDINomina.IndemnizacionIngresoNoAcumulable = "$ " + oCFDINomina.IndemnizacionIngresoNoAcumulable;

                    TableNominaSeparacion.AddCell(new Phrase(new Chunk(oCFDINomina.IndemnizacionTotalPagado, BoldFont8)));
                    TableNominaSeparacion.AddCell(new Phrase(new Chunk(oCFDINomina.IndemnizacionNumAñosServicio, BoldFont8)));
                    TableNominaSeparacion.AddCell(new Phrase(new Chunk(oCFDINomina.IndemnizacionUltimoSueldoMensOrd, BoldFont8)));
                    TableNominaSeparacion.AddCell(new Phrase(new Chunk(oCFDINomina.IndemnizacionIngresoAcumulable, BoldFont8)));
                    TableNominaSeparacion.AddCell(new Phrase(new Chunk(oCFDINomina.IndemnizacionIngresoNoAcumulable, BoldFont8)));

                    TableNominaSeparacion.AddCell(new Phrase(" "));
                    TableNominaSeparacion.AddCell(new Phrase(" "));
                    TableNominaSeparacion.AddCell(new Phrase(" "));
                    TableNominaSeparacion.AddCell(new Phrase(" "));
                    TableNominaSeparacion.AddCell(new Phrase(" "));

                    document.Add(TableNominaSeparacion);


                    //DETALLE DE JUBILACIÓN
                    PdfPTable TableNominaJubilacionTitulo = new PdfPTable(1);
                    TableNominaJubilacionTitulo.DefaultCell.BackgroundColor = new iTextSharp.text.BaseColor(Convert.ToInt16(ColoresPlantilla[0]), Convert.ToInt16(ColoresPlantilla[1]), Convert.ToInt16(ColoresPlantilla[2]));
                    float[] widthsNomMaestroJubilacionTitulo = new float[] { 400f };
                    TableNominaJubilacionTitulo.SetWidths(widthsNomMaestroJubilacionTitulo);
                    TableNominaJubilacionTitulo.WidthPercentage = 100f;
                    TableNominaJubilacionTitulo.DefaultCell.Border = PdfPCell.NO_BORDER;

                    TableNominaJubilacionTitulo.AddCell(new Phrase(new Chunk("DETALLE DE JUBILACIÓN, PENSIÓN Y RETIRO", BoldFontBlank)));
                    document.Add(TableNominaJubilacionTitulo);

                    PdfPTable TableNominaJubilacion = new PdfPTable(5);
                    float[] widthsNomJubilacion = new float[] { 100f, 100f, 100f, 100f, 100f };
                    TableNominaJubilacion.SetWidths(widthsNomJubilacion);
                    TableNominaJubilacion.WidthPercentage = 100f;
                    TableNominaJubilacion.DefaultCell.Border = PdfPCell.NO_BORDER;

                    TableNominaJubilacion.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                    TableNominaJubilacion.AddCell(new Phrase(new Chunk("Total Una Exhibicion", BoldFont8)));
                    TableNominaJubilacion.AddCell(new Phrase(new Chunk("Total Parcialidad", BoldFont8)));
                    TableNominaJubilacion.AddCell(new Phrase(new Chunk("Monto Diario", BoldFont8)));
                    TableNominaJubilacion.AddCell(new Phrase(new Chunk("Ingreso Acumulable", BoldFont8)));
                    TableNominaJubilacion.AddCell(new Phrase(new Chunk("Ingreso No Acumulable", BoldFont8)));

                    if (oCFDINomina.JubilacionTotalUnaExhibicion.Length == 0)
                        oCFDINomina.JubilacionTotalUnaExhibicion = "-";
                    if (oCFDINomina.JubilacionTotalParcialidad.Length == 0)
                        oCFDINomina.JubilacionTotalParcialidad = "-";
                    if (oCFDINomina.JubilacionMontoDiario.Length == 0)
                        oCFDINomina.JubilacionMontoDiario = "-";
                    if (oCFDINomina.JubilacionIngresoAcumulable.Length == 0)
                        oCFDINomina.JubilacionIngresoAcumulable = "-";
                    else
                        oCFDINomina.JubilacionIngresoAcumulable = "$ " + oCFDINomina.JubilacionIngresoAcumulable;
                    if (oCFDINomina.JubilacionIngresoNoAcumulable.Length == 0)
                        oCFDINomina.JubilacionIngresoNoAcumulable = "-";
                    else
                        oCFDINomina.JubilacionIngresoNoAcumulable = "$ " + oCFDINomina.JubilacionIngresoNoAcumulable;

                    TableNominaJubilacion.AddCell(new Phrase(new Chunk(oCFDINomina.JubilacionTotalUnaExhibicion, BoldFont8)));
                    TableNominaJubilacion.AddCell(new Phrase(new Chunk(oCFDINomina.JubilacionTotalParcialidad, BoldFont8)));
                    TableNominaJubilacion.AddCell(new Phrase(new Chunk(oCFDINomina.JubilacionMontoDiario, BoldFont8)));
                    TableNominaJubilacion.AddCell(new Phrase(new Chunk(oCFDINomina.JubilacionIngresoAcumulable, BoldFont8)));
                    TableNominaJubilacion.AddCell(new Phrase(new Chunk(oCFDINomina.JubilacionIngresoNoAcumulable, BoldFont8)));

                    TableNominaJubilacion.AddCell(new Phrase(" "));
                    TableNominaJubilacion.AddCell(new Phrase(" "));
                    TableNominaJubilacion.AddCell(new Phrase(" "));
                    TableNominaJubilacion.AddCell(new Phrase(" "));
                    TableNominaJubilacion.AddCell(new Phrase(" "));

                    TableNominaJubilacion.AddCell(new Phrase(" "));
                    TableNominaJubilacion.AddCell(new Phrase(" "));
                    TableNominaJubilacion.AddCell(new Phrase(" "));
                    TableNominaJubilacion.AddCell(new Phrase(" "));
                    TableNominaJubilacion.AddCell(new Phrase(" "));

                    TableNominaJubilacion.AddCell(new Phrase(" "));
                    TableNominaJubilacion.AddCell(new Phrase(" "));
                    TableNominaJubilacion.AddCell(new Phrase(" "));
                    TableNominaJubilacion.AddCell(new Phrase(" "));
                    TableNominaJubilacion.AddCell(new Phrase(" "));

                    document.Add(TableNominaJubilacion);
                }
                

                PdfPTable TableTotales = new PdfPTable(4);
                float[] widths4 = new float[] { 160f, 360f, 200f, 100f };
                TableTotales.SetWidths(widths4);
                TableTotales.WidthPercentage = 100f;
                TableTotales.DefaultCell.Border = PdfPCell.NO_BORDER;

                TableTotales.AddCell(new Phrase(" "));
                TableTotales.AddCell(new Phrase(" "));
                TableTotales.AddCell(new Phrase(" "));
                TableTotales.AddCell(new Phrase(" "));

                TableTotales.AddCell(new Phrase(" "));
                TableTotales.AddCell(new Phrase(" "));
                TableTotales.AddCell(new Phrase(" "));
                TableTotales.AddCell(new Phrase(" "));

                TableTotales.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                TableTotales.AddCell(new Phrase(new Chunk("Moneda: ", BoldFont10)));
                TableTotales.AddCell(new Phrase(new Chunk(oCFDINomina.Moneda, Font10)));


                TableTotales.AddCell(new Phrase(new Chunk("Subtotal: ", BoldFont10)));
                TableTotales.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                TableTotales.AddCell(new Phrase(new Chunk("$ " + oCFDINomina.SubTotal, Font10)));

                TableTotales.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                TableTotales.AddCell(new Phrase(new Chunk("Forma de Pago: ", BoldFont10)));
                TableTotales.AddCell(new Phrase(new Chunk(oCFDINomina.FormaPago, Font10)));
                TableTotales.AddCell(new Phrase(new Chunk("Impuestos Trasladados: ", BoldFont10)));
                TableTotales.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                if (oCFDINomina.TotalImpuestosTrasladados.Length == 0) oCFDINomina.TotalImpuestosTrasladados = "0.00";
                TableTotales.AddCell(new Phrase(new Chunk("$ " + oCFDINomina.TotalImpuestosTrasladados, Font10)));

                TableTotales.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                TableTotales.AddCell(new Phrase(new Chunk("Método de Pago: ", BoldFont10)));
                TableTotales.AddCell(new Phrase(new Chunk(oCFDINomina.MetodoPago, Font10)));
                TableTotales.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;                
                TableTotales.AddCell(new Phrase(new Chunk("Impuestos Retenidos: ", BoldFont10)));
                TableTotales.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                if (oCFDINomina.TotalImpuestosRetenidos.Length == 0) oCFDINomina.TotalImpuestosRetenidos = "0.00";
                TableTotales.AddCell(new Phrase(new Chunk("$ " + oCFDINomina.TotalImpuestosRetenidos, Font10)));

                TableTotales.AddCell(new Phrase(" "));
                TableTotales.AddCell(new Phrase(" "));
                TableTotales.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                TableTotales.AddCell(new Phrase(new Chunk("Total: ", BoldFont10)));
                TableTotales.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                TableTotales.AddCell(new Phrase(new Chunk("$ " + oCFDINomina.Total, Font10)));


                TableTotales.AddCell(new Phrase(" "));
                TableTotales.AddCell(new Phrase(" "));
                TableTotales.AddCell(new Phrase(" "));
                TableTotales.AddCell(new Phrase(" "));

                document.Add(TableTotales);



                PdfPTable TableSelloDigital = new PdfPTable(1);
                TableSelloDigital.WidthPercentage = 100f;
                TableSelloDigital.DefaultCell.Border = PdfPCell.NO_BORDER;

                TableSelloDigital.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                TableSelloDigital.AddCell(new Phrase(new Chunk("Sello Digital CFDI: ", BoldFont10)));
                TableSelloDigital.AddCell(new Phrase(new Chunk(oCFDINomina.SelloCFDI, Font10)));
                TableSelloDigital.AddCell(new Phrase(new Chunk("Sello Digital SAT: ", BoldFont10)));
                TableSelloDigital.AddCell(new Phrase(new Chunk(oCFDINomina.SelloSAT, Font10)));
                TableSelloDigital.AddCell(new Phrase(" "));
                document.Add(TableSelloDigital);

                PdfPTable TableNodoSello = new PdfPTable(3);
                float[] widths5 = new float[] { 120f, 140f, 200f };
                TableNodoSello.SetWidths(widths5);
                TableNodoSello.WidthPercentage = 100f;
                TableNodoSello.DefaultCell.Border = PdfPCell.NO_BORDER;
                string QRCode = "https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx&id=" + oCFDINomina.Folio + "&re=" + oCFDINomina.RfcEmisor + "&rr=" + oCFDINomina.RfcReceptor + "&tt=" + oCFDINomina.Total + "&fe=" + oCFDINomina.SelloCFDI.Substring(oCFDINomina.SelloCFDI.Length - 8, 8);
                var qrcode = new BarcodeQRCode(QRCode, 30, 30, null);
                var ImageQRCode = qrcode.GetImage();
                ImageQRCode.ScaleToFit(120f, 120f);

                PdfPCell vCell = new PdfPCell(ImageQRCode);
                vCell.BorderColor = new iTextSharp.text.BaseColor(255, 255, 255);
                vCell.Rowspan = 3;
                TableNodoSello.CompleteRow();
                TableNodoSello.AddCell(vCell);
                
                TableNodoSello.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                TableNodoSello.AddCell(new Phrase(new Chunk("RFC PAC: ", BoldFont10)));
                TableNodoSello.AddCell(new Phrase(new Chunk(oCFDINomina.RfcProvCertif, Font10)));
                                                              
                TableNodoSello.AddCell(new Phrase(new Chunk("Fecha Certificación: ", BoldFont10)));
                TableNodoSello.AddCell(new Phrase(new Chunk(oCFDINomina.FechaTimbrado, Font10)));

                TableNodoSello.AddCell(new Phrase(new Chunk("Número serie certificado SAT: ", BoldFont10)));
                TableNodoSello.AddCell(new Phrase(new Chunk(oCFDINomina.NumeroSerieCertificadoSAT, Font10)));

                document.Add(TableNodoSello);

                PdfPTable TableLeyenda = new PdfPTable(1);
                TableLeyenda.WidthPercentage = 100f;
                TableLeyenda.DefaultCell.Border = PdfPCell.NO_BORDER;

                TableLeyenda.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;
                TableLeyenda.AddCell(new Phrase(new Chunk("Este documento es una representación impresa de un CFDI", BoldFont10)));

                document.Add(TableLeyenda);
                
                document.Close();
                writer.Close();
                return ms;
            }
        }

        public static bool IsOdd(int value)
        {
            return value % 2 != 0;
        }

        public static string LeerAtributoConfiguracionXML(string ElementoActualizar)
        {

            var RutaRelativaXML =  "C:\\XML\\XMLConfiguracion.xml";
            XDocument xmlFile = XDocument.Load(RutaRelativaXML);

            var Consulta = from c in xmlFile.Elements("Configuraciones").Elements("Configuracion")
                           select c;

            string Valor = "";
            foreach (XElement Parametro in Consulta)
            {
                Valor = Parametro.Attribute(ElementoActualizar).Value;
            }
            return Valor;
        }
    }
    public class pdfPageEventHandlerNomina : PdfPageEventHelper
    {
        #region "variables"
        //private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        //Contentbyte del objeto writer
        PdfContentByte cb;
        // Pone el numero de pagina al final en el template
        PdfTemplate template;
        BaseFont bf = null;
        DateTime PrintTime = DateTime.Now;

        #endregion

        #region Propiedades

        public int lblPaginaIdioma { get; set; }
        public Font FooterFont { get; set; }
        public PdfPTable footer { get; set; }

        #endregion

        #region "Pdf Eventos de Página"

        public override void OnOpenDocument(PdfWriter writer, Document document)
        {
            try
            {
                PrintTime = DateTime.Now;
                bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                cb = writer.DirectContent;
                template = cb.CreateTemplate(50, 50);
            }
            catch (DocumentException ex)
            {
                //log.Error("Message: " + ex.Message + "######### StackTrace: " + ex.StackTrace.ToString());
            }
            catch (IOException ex)
            {
               // log.Error("Message: " + ex.Message + "######### StackTrace: " + ex.StackTrace.ToString());
            }
        }

        public override void OnStartPage(PdfWriter writer, Document document)
        {
            base.OnStartPage(writer, document);
            //document.Add(encabezado);
            //cb.EndText();
        }

        public override void OnEndPage(PdfWriter writer, Document document)
        {

            base.OnEndPage(writer, document);
            

            string lblPagina = "Página ";
            string lblDe = " de ";
            string lblFechaImpresion = "Fecha de Impresión ";
                   

            int pageN = writer.PageNumber;
            String text = lblPagina + pageN + lblDe;
            float len = bf.GetWidthPoint(text, 8);

            Rectangle pageSize = document.PageSize;

            cb.SetRGBColorFill(100, 100, 100);

            cb.BeginText();
            cb.SetFontAndSize(bf, 8);
            cb.SetTextMatrix(pageSize.GetLeft(30), pageSize.GetBottom(20));
            cb.ShowText(text);
            cb.EndText();

            cb.AddTemplate(template, pageSize.GetLeft(30) + len, pageSize.GetBottom(20));

            cb.BeginText();
            cb.SetFontAndSize(bf, 8);
            cb.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, lblFechaImpresion + PrintTime, pageSize.GetRight(30), pageSize.GetBottom(20), 0);
            cb.EndText();
        }

        public override void OnCloseDocument(PdfWriter writer, Document document)
        {
            base.OnCloseDocument(writer, document);

            template.BeginText();
            template.SetFontAndSize(bf, 8);
            template.SetTextMatrix(0, 0);
            template.ShowText("" + (writer.PageNumber - 1));
            template.EndText();
        }

        #endregion
    }  
    
}
